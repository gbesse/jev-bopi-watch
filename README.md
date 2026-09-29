# Jev BOPI Watch

**Prioritize potentially conflicting French trademark filings after deterministic class, territory and status filtering.**

[![Tests](https://github.com/gbesse/jev-bopi-watch/actions/workflows/test.yml/badge.svg)](https://github.com/gbesse/jev-bopi-watch/actions/workflows/test.yml) [MIT](LICENSE) · Node.js 22+ · Public alpha

## Try it

```sh
git clone https://github.com/gbesse/jev-bopi-watch.git
cd jev-bopi-watch
npm install
npm run demo
```

The demo uses synthetic records and fixture probabilities. It makes no network call and makes no measured quality claim.

## Decision boundary

Territory, status, dates and Nice-class overlap are filtered in code. Jev assesses conceptual proximity between the supplied signs and goods or services. Results are watch leads, not trademark clearance or legal advice.

## Upstream sources

- [https://data.inpi.fr/content/editorial/apis_pi](https://data.inpi.fr/content/editorial/apis_pi)
- [https://www.inpi.fr/ressources/propriete-intellectuelle/rechercher-une-marque-base-marques](https://www.inpi.fr/ressources/propriete-intellectuelle/rechercher-une-marque-base-marques)

Keep upstream attribution, original identifiers, source URLs and retrieval dates with derived records.

## Real Jev requests

Real requests are opt-in and paid. The client pins `jev-1.13.0`, validates model identity and probabilities, rejects redirects, retries only network failures plus HTTP 429/529, and refuses state above a conservative 24,000-token estimate.

```sh
TYPESAFE_API_KEY=... node scripts/live-smoke.mjs
```

Never send secrets, personal data or unredacted case files. Evaluate representative French labels before operational use.

## Validation

`npm run validate` runs syntax checks, strict public-type checks, tests and the offline demo. CI runs it on Node.js 22 and 24.

Independent project; not affiliated with TypeSafe AI or the French administration. See the [Jev API documentation](https://docs.typesafe.ai/api) and [model limitations](https://docs.typesafe.ai/model-jaggedness/jev-1.13).
