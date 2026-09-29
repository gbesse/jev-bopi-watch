// Objectif : démontrer la frontière de décision sans appel réseau.
import assert from "node:assert/strict";
import { assessFiling } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const p = createFakeProvider(() => ({
  model: "jev-1.13.0",
  answers: {
    risk: {
      type: "choice",
      choice: "medium_similarity",
      probabilities: {
        high_similarity: 0.18,
        medium_similarity: 0.7,
        low_similarity: 0.08,
        unrelated: 0.04,
      },
      confidence: 0.7,
    },
  },
  usage: {},
}));
const resultat = await assessFiling(
  {
    id: "m1",
    name: "NOVA BUREAU",
    goods: "logiciel de gestion",
    niceClasses: [9, 42],
    territory: "FR",
  },
  {
    id: "m2",
    name: "NOVO BUREAUX",
    goods: "services logiciels de gestion",
    niceClasses: [9, 35, 42],
    territory: "FR",
    status: "pending",
    sourceUrl: "https://data.inpi.fr",
  },
  p,
);
assert.equal(resultat.risk, "medium_similarity");
console.log(JSON.stringify(resultat, null, 2));
