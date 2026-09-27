# Allocation cancellation — report addition

This is a frontend demonstration using in-memory sample data. The PHP/database operations below describe the planned implementation, not an implemented backend.

## Implementation Mapping

| User Action | Prototype Screen | PHP Page/Component | Database Operation | Validation Rules | Security Considerations |
| --- | --- | --- | --- | --- | --- |
| Staff cancels an uncompleted allocation [D4] | Requests → Allocations → Cancel allocation | allocation_cancel.php | In one transaction, lock and re-check the allocation and linked item/request. UPDATE ALLOCATION with cancelled_at and cancellation_reason; UPDATE CASEWORKER_REQUEST.request_status to 'closed'; UPDATE FURNITURE_ITEM.item_status to staff-selected 'available' or 'unavailable'. Retain all records. | Allocation must not be completed or already cancelled; cancellation reason required; linked request must be approved and item allocated; staff must explicitly select the item's availability. Reject conflicting active allocations. | Staff-only session and server-side authorization; CSRF validation; prepared statements; escape notes when displayed. Keep cancellation reasons staff-only. Use row locks and a consistent locking order across cancellation, allocation and completion. |

## Appendix wording

**D4:** Staff may cancel an allocation before completion. The cancellation date and reason are retained, and the related request is closed. Staff reassess whether the item should become available again or remain unavailable. This workflow is a proposed design decision, not an explicitly confirmed interview requirement.

**A4:** Each request has at most one allocation record. A cancelled allocation is retained; any subsequent allocation requires a new request.

## Demonstration

1. Sign in through Explore the prototype → Staff.
2. Open Requests → Allocations and select Cancel allocation on an active record.
3. Enter a reason, select the furniture's availability, then confirm.
4. Verify the retained record shows Cancelled, the request is Closed, and inventory reflects the selected availability. Cancelled records have no completion/cancellation actions and do not count as active allocations.
5. Sign in as the relevant caseworker to see the closed request. Only Available furniture appears in the catalogue. Refreshing resets the prototype's sample data.
