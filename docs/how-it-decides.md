# Comment la décision est prise

Les classes de Nice sont des indices, pas une preuve juridique de dissimilarité : un candidat interclasses avec descriptions de produits ou services est évalué puis toujours soumis à revue. Sans ces descriptions, `insufficient_goods` demande une revue humaine sans appel Jev. `FR` et `EU` se recouvrent ; toute autre combinaison de territoires non reconnue renvoie `territory_unverified` pour revue. Un statut non reconnu renvoie `status_unverified` ; il n’est pas présumé inactif. Le résultat constitue une piste de surveillance et non une recherche d’antériorité exhaustive ou un avis juridique.

La question et les critères exacts sont versionnés dans [`src/index.mjs`](../src/index.mjs). Les probabilités de la démonstration sont synthétiques. Calibrez les seuils de revue sur des cas français annotés et représentatifs avant tout usage opérationnel.
