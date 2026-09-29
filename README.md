# Jev BOPI Watch

**Priorise les dépôts de marques françaises potentiellement conflictuels après filtrage par classe, territoire et statut.**

[![Tests](https://github.com/gbesse/jev-bopi-watch/actions/workflows/test.yml/badge.svg)](https://github.com/gbesse/jev-bopi-watch/actions/workflows/test.yml) [MIT](LICENSE) · Node.js 22+ · v0.1.2 · Documentation française

Le moteur réduit les candidats avec les classes de Nice, le territoire et le statut du dépôt. Jev évalue ensuite la proximité conceptuelle des signes et des produits ou services.

## Démarrage rapide

```sh
git clone https://github.com/gbesse/jev-bopi-watch.git
cd jev-bopi-watch
npm install
npm run demo
```

La démonstration utilise uniquement des données et probabilités synthétiques. Elle n’effectue aucun appel réseau et ne constitue pas une mesure de qualité de Jev.

## Exemple exécutable

Cet exemple compare deux marques partageant des classes de Nice. Il utilise un fournisseur Jev simulé : aucune clé API ni connexion réseau n’est nécessaire. L’assertion intégrée fait échouer la commande si le comportement attendu change.

Le code complet de [`examples/demo.mjs`](examples/demo.mjs) est directement copiable :

```js
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
```

Lancez-le avec :

```sh
npm run demo
```

Résultat à repérer : `risk: medium_similarity`.

## Utilisation de la bibliothèque

Importez les fonctions métier depuis `@gbesse/jev-bopi-watch`. Fournissez soit `createJevClient()` depuis l’export `./jev`, soit `createFakeProvider()` pour les tests hors ligne.

Les noms de l’API JavaScript restent stables pour préserver la compatibilité avec les versions précédentes. La documentation, les exemples et les explications destinées aux utilisateurs sont en français.

## Frontière de décision

Les classes, territoires, statuts et dates restent dans le code. Le résultat constitue une piste de surveillance et non une recherche d’antériorité exhaustive ou un avis juridique.

La question exacte envoyée à Jev est versionnée dans [`src/index.mjs`](src/index.mjs). Les identifiants, dates, calculs, filtres, seuils et transitions d’état restent gérés par du code ordinaire.

## Sources

- [https://data.inpi.fr/content/editorial/apis_pi](https://data.inpi.fr/content/editorial/apis_pi)
- [https://www.inpi.fr/ressources/propriete-intellectuelle/rechercher-une-marque-base-marques](https://www.inpi.fr/ressources/propriete-intellectuelle/rechercher-une-marque-base-marques)

Conservez l’attribution amont, les identifiants d’origine, les URL de source et les dates de récupération avec chaque enregistrement dérivé.

## Appels Jev réels

Les appels réels sont facultatifs et payants. Le client fixe le modèle `jev-1.13.0`, valide l’identité du modèle et toutes les probabilités, refuse les redirections, ne retente que les erreurs réseau et les réponses HTTP 429/529, puis bloque les requêtes dépassant une estimation prudente de 24 000 jetons.

```sh
TYPESAFE_API_KEY=... node scripts/live-smoke.mjs
```

N’envoyez jamais de secret, de donnée personnelle ni de dossier sensible non expurgé. Évaluez le comportement sur un jeu représentatif de cas français avant tout usage opérationnel.

## Validation

```sh
npm run check
npm run typecheck
npm test
npm run demo
```

La CI exécute ces vérifications sous Node.js 22 et 24.

Projet indépendant, sans affiliation avec TypeSafe AI ni avec l’administration française. Consultez la [documentation de l’API Jev](https://docs.typesafe.ai/api) et les [limites du modèle](https://docs.typesafe.ai/model-jaggedness/jev-1.13).
