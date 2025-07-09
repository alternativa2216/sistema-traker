'use server';

/**
 * @fileOverview Generates a SWOT analysis for a given project based on collected data.
 *
 * - generateSwotAnalysis - A function that generates a SWOT analysis.
 * - GenerateSwotAnalysisInput - The input type for the generateSwotAnalysis function.
 * - GenerateSwotAnalysisOutput - The return type for the generateSwotAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSwotAnalysisInputSchema = z.object({
  projectData: z
    .string()
    .describe('The collected data for the project to analyze.'),
});
export type GenerateSwotAnalysisInput = z.infer<typeof GenerateSwotAnalysisInputSchema>;

const GenerateSwotAnalysisOutputSchema = z.object({
  strengths: z.string().describe('The strengths of the project.'),
  weaknesses: z.string().describe('The weaknesses of the project.'),
  opportunities: z.string().describe('The opportunities for the project.'),
  threats: z.string().describe('The threats to the project.'),
});
export type GenerateSwotAnalysisOutput = z.infer<typeof GenerateSwotAnalysisOutputSchema>;

export async function generateSwotAnalysis(
  input: GenerateSwotAnalysisInput
): Promise<GenerateSwotAnalysisOutput> {
  return generateSwotAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSwotAnalysisPrompt',
  input: {schema: GenerateSwotAnalysisInputSchema},
  output: {schema: GenerateSwotAnalysisOutputSchema},
  prompt: `You are an AI expert in performing SWOT analysis.

Analyze the following project data and generate a SWOT analysis, identifying strengths, weaknesses, opportunities, and threats.

Project Data: {{{projectData}}}

Format your output as a JSON object with the keys "strengths", "weaknesses", "opportunities", and "threats". Each key should contain a string value with a detailed explanation.
`,
});

const generateSwotAnalysisFlow = ai.defineFlow(
  {
    name: 'generateSwotAnalysisFlow',
    inputSchema: GenerateSwotAnalysisInputSchema,
    outputSchema: GenerateSwotAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
