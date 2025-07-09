'use server';

/**
 * @fileOverview Gera uma análise SWOT para um determinado projeto com base nos dados coletados.
 *
 * - generateSwotAnalysis - Uma função que gera uma análise SWOT.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateSwotAnalysisInputSchema,
  GenerateSwotAnalysisOutputSchema,
  type GenerateSwotAnalysisInput,
  type GenerateSwotAnalysisOutput
} from '@/ai/schemas';

export async function generateSwotAnalysis(
  input: GenerateSwotAnalysisInput
): Promise<GenerateSwotAnalysisOutput> {
  return generateSwotAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSwotAnalysisPrompt',
  input: {schema: GenerateSwotAnalysisInputSchema},
  output: {schema: GenerateSwotAnalysisOutputSchema},
  prompt: `Você é um especialista em IA na realização de análises SWOT.

Analise os seguintes dados do projeto e gere uma análise SWOT, identificando forças, fraquezas, oportunidades e ameaças.

Dados do Projeto: {{{projectData}}}

Formate sua saída como um objeto JSON com as chaves "strengths", "weaknesses", "opportunities" e "threats". Cada chave deve conter um valor de string com uma explicação detalhada.
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
