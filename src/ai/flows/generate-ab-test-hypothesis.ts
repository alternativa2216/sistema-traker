'use server';
/**
 * @fileOverview Gera hipóteses de testes A/B para otimização de conversão.
 *
 * - generateAbTestHypothesis - Gera hipóteses de teste A/B.
 */

import {ai} from '@/ai/genkit';
import {
    GenerateAbTestHypothesisInputSchema,
    GenerateAbTestHypothesisOutputSchema,
    type GenerateAbTestHypothesisInput,
    type GenerateAbTestHypothesisOutput
} from '@/ai/schemas';

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

Seja criativo, mas mantenha as sugestões realistas e focadas no objetivo.

Exemplo de Hipótese: "Mudar a cor do botão de CTA principal de azul para laranja aumentará a taxa de cliques em 15%, porque a nova cor tem mais contraste com o fundo da página."
Exemplo de Sugestão: "Variante A (Controle): Botão azul. Variante B: Botão laranja. Meça os cliques em cada variante por 2 semanas."`,
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
