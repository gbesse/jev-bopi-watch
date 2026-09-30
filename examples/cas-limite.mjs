// Cas limite : l’absence de classe commune exclut la comparaison sémantique.
import assert from "node:assert/strict";
import { assessFiling } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";

const jev = createFakeProvider(() => {
  throw new Error("Jev ne doit pas être appelé");
});
const resultat = await assessFiling(
  { id: "m1", name: "NOVA BUREAU", niceClasses: [9], territory: "FR" },
  {
    id: "m2",
    name: "NOVA TEXTILE",
    niceClasses: [25],
    territory: "FR",
    status: "pending",
  },
  jev,
);
assert.equal(resultat.risk, "different_classes");
assert.equal(jev.calls, 0);
console.log(JSON.stringify(resultat, null, 2));
