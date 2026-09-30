// Objectif : éviter les faux négatifs dus au seul classement de Nice.
import test from "node:test";
import assert from "node:assert/strict";
import { mark, assessFiling } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";

const owned = { id: "a", name: "Alpha", goods: "logiciels de gestion", niceClasses: [9], territory: "FR" };
const answer = (choice = "low_similarity", confidence = .8) => ({
  model: "jev-1.13.0", answers: { risk: {
    type: "choice", choice,
    probabilities: choice === "unrelated"
      ? { high_similarity: .01, medium_similarity: .02, low_similarity: .02, unrelated: .95 }
      : { high_similarity: .05, medium_similarity: .1, low_similarity: .8, unrelated: .05 },
    confidence,
  } }, usage: {},
});

test("validates Nice classes", () => assert.throws(() => mark({ ...owned, niceClasses: [46] }), /Nice/));
test("unknown filing status cannot be dismissed as inactive", async () => {
  const provider = createFakeProvider(() => { throw Error("must not run"); });
  const result = await assessFiling(owned, { ...owned, id: "b", status: "registered" }, provider);
  assert.equal(result.risk, "status_unverified");
  assert.equal(result.review, true);
  assert.equal(provider.calls, 0);
});
test("different classes with described goods reach Jev and require review", async () => {
  const provider = createFakeProvider(() => answer("unrelated", .95));
  const result = await assessFiling(owned,
    { id: "b", name: "Beta", goods: "services logiciels de gestion", niceClasses: [42], territory: "FR", status: "pending" },
    provider);
  assert.deepEqual(result.sharedClasses, []);
  assert.equal(result.review, true);
  assert.equal(provider.calls, 1);
});
test("different classes without goods descriptions require manual review", async () => {
  const provider = createFakeProvider(() => { throw Error("must not run"); });
  const result = await assessFiling(owned,
    { id: "b", name: "Beta", niceClasses: [25], territory: "FR", status: "pending" }, provider);
  assert.equal(result.risk, "insufficient_goods");
  assert.equal(result.review, true);
  assert.equal(provider.calls, 0);
});
test("FR and EU territories overlap and require review", async () => {
  const provider = createFakeProvider(() => answer("unrelated", .95));
  const result = await assessFiling(owned,
    { ...owned, id: "b", territory: "EU", status: "pending" }, provider);
  assert.equal(result.review, true);
  assert.equal(provider.calls, 1);
});
test("unmapped territory combinations require manual review", async () => {
  const provider = createFakeProvider(() => { throw Error("must not run"); });
  const result = await assessFiling(owned,
    { ...owned, id: "b", territory: "WO", status: "pending" }, provider);
  assert.equal(result.risk, "territory_unverified");
  assert.equal(result.review, true);
  assert.equal(provider.calls, 0);
});
test("overlap is semantically reviewed", async () => {
  const provider = createFakeProvider(() => answer());
  assert.equal((await assessFiling(owned, { ...owned, id: "b", name: "Beta", status: "pending" }, provider)).review, true);
});
