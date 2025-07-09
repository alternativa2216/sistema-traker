'use server';

import {
  generateSwotAnalysis,
  type GenerateSwotAnalysisInput,
  type GenerateSwotAnalysisOutput,
} from '@/ai/flows/generate-swot-analysis';
import {
  analyzeProjectData,
  type AnalyzeProjectDataInput,
  type AnalyzeProjectDataOutput,
} from '@/ai/flows/analyze-project-data';
import {
  generateAdCopy,
  type GenerateAdCopyInput,
  type GenerateAdCopyOutput,
} from '@/ai/flows/generate-ad-copy';
import {
  suggestAdAudience,
  type SuggestAdAudienceInput,
  type SuggestAdAudienceOutput,
} from '@/ai/flows/suggest-ad-audience';
import {
  analyzeAdCreative,
  type AnalyzeAdCreativeInput,
  type AnalyzeAdCreativeOutput,
} from '@/ai/flows/analyze-ad-creative';
import {
  generateAbTestHypothesis,
  type GenerateAbTestHypothesisInput,
  type GenerateAbTestHypothesisOutput,
} from '@/ai/flows/generate-ab-test-hypothesis';

export async function generateSwotAnalysisAction(
  input: GenerateSwotAnalysisInput
): Promise<GenerateSwotAnalysisOutput> {
  return await generateSwotAnalysis(input);
}

export async function analyzeProjectDataAction(
  input: AnalyzeProjectDataInput
): Promise<AnalyzeProjectDataOutput> {
  return await analyzeProjectData(input);
}

export async function generateAdCopyAction(
  input: GenerateAdCopyInput
): Promise<GenerateAdCopyOutput> {
  return await generateAdCopy(input);
}

export async function suggestAdAudienceAction(
  input: SuggestAdAudienceInput
): Promise<SuggestAdAudienceOutput> {
  return await suggestAdAudience(input);
}

export async function analyzeAdCreativeAction(
  input: AnalyzeAdCreativeInput
): Promise<AnalyzeAdCreativeOutput> {
  return await analyzeAdCreative(input);
}

export async function generateAbTestHypothesisAction(
  input: GenerateAbTestHypothesisInput
): Promise<GenerateAbTestHypothesisOutput> {
  return await generateAbTestHypothesis(input);
}
