'use server';

import { generateSwotAnalysis } from "@/ai/flows/generate-swot-analysis";
import { analyzeProjectData } from "@/ai/flows/analyze-project-data";
import { generateAdCopy } from "@/ai/flows/generate-ad-copy";
import { suggestAdAudience } from "@/ai/flows/suggest-ad-audience";
import { analyzeAdCreative } from "@/ai/flows/analyze-ad-creative";
import { generateAbTestHypothesis } from "@/ai/flows/generate-ab-test-hypothesis";

import type {
  GenerateSwotAnalysisInput, GenerateSwotAnalysisOutput,
  AnalyzeProjectDataInput, AnalyzeProjectDataOutput,
  GenerateAdCopyInput, GenerateAdCopyOutput,
  SuggestAdAudienceInput, SuggestAdAudienceOutput,
  AnalyzeAdCreativeInput, AnalyzeAdCreativeOutput,
  GenerateAbTestHypothesisInput, GenerateAbTestHypothesisOutput
} from "@/ai/schemas";

export async function generateSwotAnalysisAction(
  input: GenerateSwotAnalysisInput
): Promise<GenerateSwotAnalysisOutput> {
  // In a real app, you'd add authentication and validation here
  try {
    return await generateSwotAnalysis(input);
  } catch (error) {
    console.error("Error generating SWOT analysis:", error);
    throw new Error("Falha ao gerar a análise SWOT.");
  }
}

export async function analyzeProjectDataAction(
  input: AnalyzeProjectDataInput
): Promise<AnalyzeProjectDataOutput> {
  // In a real app, you'd add authentication and validation here
  // And probably fetch real project data based on projectId
  const dummyData = JSON.stringify({
    "pageviews": [
      {"date": "2024-05-01", "count": 2100, "unique": 1500},
      {"date": "2024-05-02", "count": 2400, "unique": 1800},
      {"date": "2024-05-03", "count": 2250, "unique": 1600},
      {"date": "2024-05-04", "count": 2600, "unique": 1950},
      {"date": "2024-05-05", "count": 3100, "unique": 2400}
    ],
    "top_pages": [
      {"path": "/", "views": 1200},
      {"path": "/pricing", "views": 850},
      {"path": "/features", "views": 600},
      {"path": "/blog/new-feature", "views": 450}
    ],
    "traffic_sources": [
        {"source": "Google", "visits": 4500},
        {"source": "Direct", "visits": 3200},
        {"source": "Twitter", "visits": 1800},
        {"source": "ProductHunt", "visits": 950}
    ]
  }, null, 2);
  
  try {
    return await analyzeProjectData({ ...input, data: input.data || dummyData });
  } catch (error) {
    console.error("Error analyzing project data:", error);
    throw new Error("Falha ao analisar os dados do projeto.");
  }
}

export async function generateAdCopyAction(
  input: GenerateAdCopyInput
): Promise<GenerateAdCopyOutput> {
  try {
    return await generateAdCopy(input);
  } catch (error) {
    console.error("Error generating ad copy:", error);
    throw new Error("Falha ao gerar o texto do anúncio.");
  }
}

export async function suggestAdAudienceAction(
  input: SuggestAdAudienceInput
): Promise<SuggestAdAudienceOutput> {
  try {
    return await suggestAdAudience(input);
  } catch (error) {
    console.error("Error suggesting ad audience:", error);
    throw new Error("Falha ao sugerir o público-alvo.");
  }
}

export async function analyzeAdCreativeAction(
  input: AnalyzeAdCreativeInput
): Promise<AnalyzeAdCreativeOutput> {
  try {
    return await analyzeAdCreative(input);
  } catch (error) {
    console.error("Error analyzing ad creative:", error);
    throw new Error("Falha ao analisar o criativo.");
  }
}

export async function generateAbTestHypothesisAction(
  input: GenerateAbTestHypothesisInput
): Promise<GenerateAbTestHypothesisOutput> {
  try {
    return await generateAbTestHypothesis(input);
  } catch (error) {
    console.error("Error generating A/B test hypothesis:", error);
    throw new Error("Falha ao gerar hipóteses de teste A/B.");
  }
}
