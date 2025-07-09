'use server';

/**
 * @fileOverview Gera uma análise SWOT para um determinado projeto com base nos dados coletados.
 *
 * - generateSwotAnalysis - Uma função que gera uma análise SWOT.
 * - GenerateSwotAnalysisInput - O tipo de entrada para a função generateSwotAnalysis.
 * - GenerateSwotAnalysisOutput - O tipo de retorno para a função generateSwotAnalysis.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSwotAnalysisInputSchema = z.object({
  projectData: z
    .string()
    .describe('Os dados coletados para o projeto a ser analisado.'),
});
export type GenerateSwotAnalysisInput = z.infer<typeof GenerateSwotAnalysisInputSchema>;

const GenerateSwotAnalysisOutputSchema = z.object({
  strengths: z.string().describe('As forças do projeto.'),
  weaknesses: z.string().describe('As fraquezas do projeto.'),
  opportunities: z.string().describe('As oportunidades para o projeto.'),
  threats: z.string().describe('As ameaças ao projeto.'),
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
