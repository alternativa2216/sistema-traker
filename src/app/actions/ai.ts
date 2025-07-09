'use server';

import { generateSwotAnalysis, GenerateSwotAnalysisInput, GenerateSwotAnalysisOutput } from "@/ai/flows/generate-swot-analysis";
import { analyzeProjectData, AnalyzeProjectDataInput, AnalyzeProjectDataOutput } from "@/ai/flows/analyze-project-data";

export async function generateSwotAnalysisAction(
  input: GenerateSwotAnalysisInput
): Promise<GenerateSwotAnalysisOutput> {
  // In a real app, you'd add authentication and validation here
  try {
    return await generateSwotAnalysis(input);
  } catch (error) {
    console.error("Error generating SWOT analysis:", error);
    throw new Error("Failed to generate SWOT analysis.");
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
    throw new Error("Failed to analyze project data.");
  }
}
