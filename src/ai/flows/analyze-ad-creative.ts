'use server';
/**
 * @fileOverview Analisa um criativo de anúncio (imagem) e fornece feedback.
 *
 * - analyzeAdCreative - Analisa o criativo.
 */

import {ai} from '@/ai/genkit';
import {
    AnalyzeAdCreativeInputSchema,
    AnalyzeAdCreativeOutputSchema,
    type AnalyzeAdCreativeInput,
    type AnalyzeAdCreativeOutput
} from '@/ai/schemas';


export async function analyzeAdCreative(input: AnalyzeAdCreativeInput): Promise<AnalyzeAdCreativeOutput> {
  return analyzeAdCreativeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeAdCreativePrompt',
  input: {schema: AnalyzeAdCreativeInputSchema},
  output: {schema: AnalyzeAdCreativeOutputSchema},
  prompt: `Você é um diretor de arte e especialista em anúncios do Facebook. Analise a imagem fornecida.

Avalie os seguintes pontos:
- Clareza da mensagem
- Apelo visual e estético
- Proporção de texto na imagem (regra dos 20%)
- Potencial de chamar a atenção no feed
- Alinhamento com as políticas de anúncios do Facebook

Forneça uma pontuação de 0 a 100, um feedback geral e sugestões práticas para melhorar o criativo.

Imagem: {{media url=imageDataUri}}`,
});

const analyzeAdCreativeFlow = ai.defineFlow(
  {
    name: 'analyzeAdCreativeFlow',
    inputSchema: AnalyzeAdCreativeInputSchema,
    outputSchema: AnalyzeAdCreativeOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
