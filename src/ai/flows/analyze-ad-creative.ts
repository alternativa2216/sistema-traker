'use server';
/**
 * @fileOverview Analisa um criativo de anúncio (imagem) e fornece feedback.
 *
 * - analyzeAdCreative - Analisa o criativo.
 * - AnalyzeAdCreativeInput - O tipo de entrada para a função analyzeAdCreative.
 * - AnalyzeAdCreativeOutput - O tipo de retorno para a função analyzeAdCreative.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAdCreativeInputSchema = z.object({
  imageDataUri: z.string().describe("A imagem do anúncio, como um data URI que deve incluir um MIME type e usar Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type AnalyzeAdCreativeInput = z.infer<typeof AnalyzeAdCreativeInputSchema>;

const AnalyzeAdCreativeOutputSchema = z.object({
  score: z.number().min(0).max(100).describe('Uma pontuação de 0 a 100 para a eficácia geral do criativo.'),
  feedback: z.string().describe('Um feedback geral sobre os pontos fortes e fracos da imagem.'),
  suggestions: z.array(z.string()).describe('Uma lista de sugestões acionáveis para melhorar o criativo.'),
});
export type AnalyzeAdCreativeOutput = z.infer<typeof AnalyzeAdCreativeOutputSchema>;

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
