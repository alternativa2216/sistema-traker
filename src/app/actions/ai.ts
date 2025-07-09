'use server';

// A funcionalidade de IA foi temporariamente desativada para diagnóstico.
// Todas as importações e tipos foram removidos para isolar a causa
// de um erro de compilação persistente.

const aiDisabledError = "A funcionalidade de IA está temporariamente desativada para diagnóstico.";

export async function generateSwotAnalysisAction(
  input: any
): Promise<any> {
  console.log("generateSwotAnalysisAction called but is disabled for diagnostics");
  throw new Error(aiDisabledError);
}

export async function analyzeProjectDataAction(
  input: any
): Promise<any> {
  console.log("analyzeProjectDataAction called but is disabled for diagnostics");
  throw new Error(aiDisabledError);
}

export async function generateAdCopyAction(
  input: any
): Promise<any> {
  console.log("generateAdCopyAction called but is disabled for diagnostics");
  throw new Error(aiDisabledError);
}

export async function suggestAdAudienceAction(
  input: any
): Promise<any> {
  console.log("suggestAdAudienceAction called but is disabled for diagnostics");
  throw new Error(aiDisabledError);
}

export async function analyzeAdCreativeAction(
  input: any
): Promise<any> {
  console.log("analyzeAdCreativeAction called but is disabled for diagnostics");
  throw new Error(aiDisabledError);
}

export async function generateAbTestHypothesisAction(
  input: any
): Promise<any> {
  console.log("generateAbTestHypothesisAction called but is disabled for diagnostics");
  throw new Error(aiDisabledError);
}
