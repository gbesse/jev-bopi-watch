// Objectif : trier les dépôts sans assimiler les classes de Nice à une conclusion juridique.
export const RISKS = ["high_similarity", "medium_similarity", "low_similarity", "unrelated"];

function classes(values) {
  const out = [...new Set((values || []).map(Number))];
  if (!out.length || out.some((value) => !Number.isInteger(value) || value < 1 || value > 45))
    throw new TypeError("Nice classes must be integers from 1 to 45");
  return out.sort((a, b) => a - b);
}

export function mark(input) {
  if (!input?.id || !input?.name || !input?.territory)
    throw new TypeError("A mark needs id, name and territory");
  return {
    id: String(input.id), name: String(input.name).trim(), goods: String(input.goods || ""),
    niceClasses: classes(input.niceClasses), territory: String(input.territory),
    status: input.status == null ? "unknown" : String(input.status),
    sourceUrl: String(input.sourceUrl || ""),
  };
}

export async function assessFiling(ownedInput, filingInput, provider) {
  const owned = mark(ownedInput);
  const filing = mark(filingInput);
  if (filing.status !== "active" && filing.status !== "pending")
    return { risk: "status_unverified", review: true, deterministic: true };
  const sameTerritory = owned.territory === filing.territory;
  const franceAndEU = new Set([owned.territory, filing.territory]);
  const knownOverlap = franceAndEU.size === 2 && franceAndEU.has("FR") && franceAndEU.has("EU");
  if (!sameTerritory && !knownOverlap)
    return { risk: "territory_unverified", review: true, deterministic: true };
  const sharedClasses = owned.niceClasses.filter((value) => filing.niceClasses.includes(value));
  // Different classes can still contain similar goods or services. Without descriptions,
  // there is no evidence to assess and the candidate must remain in human review.
  if (!sharedClasses.length && (!owned.goods.trim() || !filing.goods.trim()))
    return { risk: "insufficient_goods", sharedClasses, review: true, deterministic: true };

  const response = await provider.decide({
    state: { owned, filing, sharedClasses },
    questions: { risk: {
      type: "choice",
      instructions: "Assess conceptual similarity of the signs and supplied goods or services. Different Nice classes do not prove that goods or services are dissimilar. Do not decide likelihood of confusion as a legal conclusion.",
      criteria: {
        high_similarity: "Strongly similar signs and overlapping goods or services",
        medium_similarity: "Meaningful similarity with material differences",
        low_similarity: "Limited similarity of signs or goods and services",
        unrelated: "No meaningful semantic relationship",
      },
    } },
  });
  const answer = response.answers.risk;
  return {
    risk: answer.choice, probability: answer.probabilities[answer.choice],
    confidence: answer.confidence, sharedClasses,
    review: !sharedClasses.length || !sameTerritory || answer.choice !== "unrelated" || answer.confidence < .9,
    deterministic: false, usage: response.usage,
  };
}
