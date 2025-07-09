'use server';

/**
 * @fileOverview Implementa um chatbot de IA para analisar dados de projetos com base nas consultas do usuário.
 *
 * - analyzeProjectData - Uma função que aceita uma solicitação de análise de dados do projeto e retorna uma análise gerada por IA.
 */

import {ai} from '@/ai/genkit';
import {
    AnalyzeProjectDataInputSchema,
    AnalyzeProjectDataOutputSchema,
    type AnalyzeProjectDataInput,
    type AnalyzeProjectDataOutput
} from '@/ai/schemas';

export async function analyzeProjectData(input: AnalyzeProjectDataInput): Promise<AnalyzeProjectDataOutput> {
  return analyzeProjectDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeProjectDataPrompt',
  input: {schema: AnalyzeProjectDataInputSchema},
  output: {schema: AnalyzeProjectDataOutputSchema},
  prompt: `Você é um especialista em Otimização da Taxa de Conversão (CRO).
Analise os dados do projeto fornecidos. Com base nos dados, forneça insights acionáveis e sugestões concretas sobre como melhorar o site para aumentar as conversões.
Concentre-se na experiência do usuário, chamadas para ação e melhorias no funil de vendas.

Consulta do usuário: {{{query}}}
Dados do projeto: {{{data}}}
`,
});

const analyzeProjectDataFlow = ai.defineFlow(
  {
    name: 'analyzeProjectDataFlow',
    inputSchema: AnalyzeProjectDataInputSchema,
    outputSchema: AnalyzeProjectDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
