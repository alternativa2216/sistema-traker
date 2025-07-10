'use server';
import 'server-only';

import {
  generateSwotAnalysis,
} from '@/ai/flows/generate-swot-analysis';
import {
  analyzeProjectData,
} from '@/ai/flows/analyze-project-data';
import {
  generateAdCopy,
} from '@/ai/flows/generate-ad-copy';
import {
  suggestAdAudience,
} from '@/ai/flows/suggest-ad-audience';
import {
  analyzeAdCreative,
} from '@/ai/flows/analyze-ad-creative';
import {
  generateAbTestHypothesis,
} from '@/ai/flows/generate-ab-test-hypothesis';
import type { 
    GenerateSwotAnalysisInput, 
    GenerateSwotAnalysisOutput,
    AnalyzeProjectDataInput,
    AnalyzeProjectDataOutput,
    GenerateAdCopyInput,
    GenerateAdCopyOutput,
    SuggestAdAudienceInput,
    SuggestAdAudienceOutput,
    AnalyzeAdCreativeInput,
    AnalyzeAdCreativeOutput,
    GenerateAbTestHypothesisInput,
    GenerateAbTestHypothesisOutput
} from '@/ai/schemas';

// Função auxiliar para garantir que a chave da API esteja configurada antes de executar um fluxo.
// Isso fornece uma mensagem de erro clara para o usuário final.
function ensureApiKey() {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error(
      'A chave da API do Google (GOOGLE_API_KEY) não foi configurada. Por favor, adicione-a ao seu arquivo .env para usar as funcionalidades de IA.'
    );
  }
}

export async function generateSwotAnalysisAction(
  input: GenerateSwotAnalysisInput
): Promise<GenerateSwotAnalysisOutput> {
  ensureApiKey();
  return await generateSwotAnalysis(input);
}

export async function analyzeProjectDataAction(
  input: AnalyzeProjectDataInput
): Promise<AnalyzeProjectDataOutput> {
  ensureApiKey();
  return await analyzeProjectData(input);
}

export async function generateAdCopyAction(
  input: GenerateAdCopyInput
): Promise<GenerateAdCopyOutput> {
  ensureApiKey();
  return await generateAdCopy(input);
}

export async function suggestAdAudienceAction(
  input: SuggestAdAudienceInput
): Promise<SuggestAdAudienceOutput> {
  ensureApiKey();
  return await suggestAdAudience(input);
}

export async function analyzeAdCreativeAction(
  input: AnalyzeAdCreativeInput
): Promise<AnalyzeAdCreativeOutput> {
  ensureApiKey();
  return await analyzeAdCreative(input);
}

export async function generateAbTestHypothesisAction(
  input: GenerateAbTestHypothesisInput
): Promise<GenerateAbTestHypothesisOutput> {
  ensureApiKey();
  return await generateAbTestHypothesis(input);
}
