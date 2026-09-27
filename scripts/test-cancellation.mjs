import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/cancellation.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { cancelAllocation } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const allocations = [{ id: "A1", itemId: "I1", requestId: "R1", completed: false }];
const items = [{ id: "I1", status: "Allocated" }, { id: "I2", status: "Available" }];
const requests = [{ id: "R1", status: "Approved" }, { id: "R2", status: "Submitted" }];
const now = "2026-09-27T12:00:00.000Z";
for (const status of ["Available", "Unavailable"]) {
  const result = cancelAllocation(allocations, items, requests, "A1", "  Collection no longer needed  ", status, now);
  assert.equal(result.allocations.length, 1);
  assert.equal(result.allocations[0].cancelledAt, now);
  assert.equal(result.allocations[0].cancellationReason, "Collection no longer needed");
  assert.equal(result.items[0].status, status);
  assert.equal(result.requests[0].status, "Closed");
  assert.equal(result.requests[0].outcome.includes("Collection no longer needed"), false);
  assert.deepEqual(result.items[1], items[1]);
  assert.deepEqual(result.requests[1], requests[1]);
  assert.throws(() => cancelAllocation(result.allocations, result.items, result.requests, "A1", "Again", status, now), /active/);
}
assert.equal(items[0].status, "Allocated");
assert.equal(requests[0].status, "Approved");
assert.equal(allocations[0].cancelledAt, undefined);
assert.throws(() => cancelAllocation(allocations, items, requests, "A1", " ", "Available", now), /reason/);
assert.throws(() => cancelAllocation([{ ...allocations[0], completed: true }], items, requests, "A1", "Reason", "Available", now), /active/);
assert.throws(() => cancelAllocation(allocations, items, requests, "missing", "Reason", "Available", now), /active/);
assert.throws(() => cancelAllocation(allocations, [], requests, "A1", "Reason", "Available", now), /changed/);
assert.throws(() => cancelAllocation(allocations, items, [{ id: "R1", status: "Closed" }], "A1", "Reason", "Available", now), /changed/);
assert.throws(() => cancelAllocation([...allocations, { ...allocations[0], id: "A2" }], items, requests, "A1", "Reason", "Available", now), /Another active/);
assert.throws(() => cancelAllocation(allocations, items, requests, "A1", "Reason", "Collected", now), /availability/);
console.log("Cancellation checks passed: both release outcomes, history, privacy, unchanged unrelated records, invalid and repeated actions.");
