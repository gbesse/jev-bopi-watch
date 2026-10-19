// Purpose: Shared Nice classes do not invent missing goods descriptions.
import assert from 'node:assert/strict';
import { assessFiling } from '../src/index.mjs';
import { createFakeProvider } from '../src/jev.mjs';
const provider = createFakeProvider(() => { throw Error('unexpected provider call'); });
const result = await assessFiling(
  { id: 'owned-synthetic', name: 'NOVA EXEMPLE', goods: 'logiciels de gestion', niceClasses: [9], territory: 'FR' },
  { id: 'filing-synthetic', name: 'NOVO EXEMPLE', goods: '', niceClasses: [9], territory: 'FR', status: 'pending' },
  provider,
);
assert.equal(result.risk, 'insufficient_goods');
assert.equal(provider.calls, 0);
console.log(JSON.stringify({ synthetic: true, description: { fr: 'Même classe, description absente : revue humaine sans appel Jev.', en: 'Same class, missing description: human review without a Jev call.', es: 'Misma clase, descripción ausente: revisión humana sin llamada Jev.' }, result, providerCalls: provider.calls }, null, 2));
