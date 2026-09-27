export type ReleaseStatus = "Available" | "Unavailable";

interface AllocationRecord {
  id: string; itemId?: string; requestId?: string; completed: boolean;
  cancelledAt?: string; cancellationReason?: string;
}

// One state transition keeps the retained allocation, request and item consistent.
export function cancelAllocation<
  A extends AllocationRecord,
  I extends { id: string; status: string },
  R extends { id: string; status: string; outcome?: string },
>(allocations: A[], items: I[], requests: R[], id: string, reason: string, status: ReleaseStatus, now: string) {
  const allocation = allocations.find(a => a.id === id);
  if (!allocation || allocation.completed || allocation.cancelledAt) throw new Error("Only active allocations can be cancelled.");
  if (!reason.trim()) throw new Error("Enter a cancellation reason.");
  if (status !== "Available" && status !== "Unavailable") throw new Error("Choose the item's availability after cancellation.");
  const item = items.find(i => i.id === allocation.itemId);
  const request = requests.find(r => r.id === allocation.requestId);
  if (!item || !request || item.status !== "Allocated" || request.status !== "Approved") {
    throw new Error("The linked item or request has changed. Close this dialog and review the allocation.");
  }
  if (allocations.some(a => a.id !== id && a.itemId === item.id && !a.completed && !a.cancelledAt)) {
    throw new Error("Another active allocation uses this item. Review it before changing availability.");
  }
  return {
    allocations: allocations.map(a => a.id === id ? { ...a, cancelledAt: now, cancellationReason: reason.trim() } : a),
    items: items.map(i => i.id === item.id ? { ...i, status } : i),
    requests: requests.map(r => r.id === request.id ? { ...r, status: "Closed", outcome: "Allocation cancelled by staff. Submit a new request if furniture is still needed." } : r),
  };
}
