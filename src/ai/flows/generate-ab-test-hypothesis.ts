'use server';
/**
 * @fileOverview Gera hipóteses de testes A/B para otimização de conversão.
 *
 * - generateAbTestHypothesis - Gera hipóteses de teste A/B.
 * - GenerateAbTestHypothesisInput - O tipo de entrada para a função.
 * - GenerateAbTestHypothesisOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAbTestHypothesisInputSchema = z.object({
  pageUrl: z.string().describe('A URL ou caminho da página a ser otimizada (ex: /precos).'),
  optimizationGoal: z.string().describe('O objetivo principal da otimização (ex: Aumentar cliques no botão de compra, reduzir a taxa de rejeição).'),
});
export type GenerateAbTestHypothesisInput = z.infer<typeof GenerateAbTestHypothesisInputSchema>;

const HypothesisSchema = z.object({
    hypothesis: z.string().describe("A hipótese do teste. Ex: 'Alterar o texto do botão de 'Começar' para 'Começar Gratuitamente' irá aumentar a taxa de cliques.'"),
    suggestion: z.string().describe("A sugestão de implementação. Ex: 'Variante A: 'Começar'. Variante B: 'Começar Gratuitamente'.'"),
});

const GenerateAbTestHypothesisOutputSchema = z.object({
  hypotheses: z.array(HypothesisSchema).describe('Uma lista de 3 a 5 hipóteses de teste A/B acionáveis.'),
});
export type GenerateAbTestHypothesisOutput = z.infer<typeof GenerateAbTestHypothesisOutputSchema>;

export async function generateAbTestHypothesis(input: GenerateAbTestHypothesisInput): Promise<GenerateAbTestHypothesisOutput> {
  return generateAbTestHypothesisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAbTestHypothesisPrompt',
  input: {schema: GenerateAbTestHypothesisInputSchema},
  output: {schema: GenerateAbTestHypothesisOutputSchema},
  prompt: `Você é um especialista em Otimização da Taxa de Conversão (CRO) de classe mundial. Sua tarefa é gerar hipóteses de teste A/B para uma página da web com base em uma URL e um objetivo de otimização.

Para a página em '{{pageUrl}}', gere de 3 a 5 hipóteses de teste A/B claras e acionáveis para atingir o seguinte objetivo: '{{optimizationGoal}}'.

Cada hipótese deve ser específica e mensurável. Para cada hipótese, forneça também uma sugestão clara de como implementá-la.

Exemplo de Hipótese: Mudar a cor do botão de CTA principal de azul para laranja aumentará a taxa de cliques em 15% porque a nova cor tem mais contraste com o fundo da página.
Exemplo de Sugestão: Variante A (Controle): Botão azul. Variante B: Botão laranja. Meça os cliques em cada variante por 2 semanas.`,
});

const generateAbTestHypothesisFlow = ai.defineFlow(
  {
    name: 'generateAbTestHypothesisFlow',
    inputSchema: GenerateAbTestHypothesisInputSchema,
    outputSchema: GenerateAbTestHypothesisOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
