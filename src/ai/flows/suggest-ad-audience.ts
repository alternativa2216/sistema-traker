'use server';
/**
 * @fileOverview Sugere públicos-alvo para campanhas do Facebook Ads.
 *
 * - suggestAdAudience - Sugere um público-alvo.
 * - SuggestAdAudienceInput - O tipo de entrada para a função suggestAdAudience.
 * - SuggestAdAudienceOutput - O tipo de retorno para a função suggestAdAudience.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAdAudienceInputSchema = z.object({
  customerProfile: z.string().describe('Uma descrição do cliente ideal, incluindo seus desejos, dores e dados demográficos.'),
});
export type SuggestAdAudienceInput = z.infer<typeof SuggestAdAudienceInputSchema>;

const SuggestAdAudienceOutputSchema = z.object({
  interests: z.array(z.string()).describe('Uma lista de interesses detalhados que este público provavelmente tem no Facebook.'),
  behaviors: z.array(z.string()).describe('Uma lista de comportamentos de compra ou online que podem ser usados para segmentação.'),
  demographics: z.string().describe('Um resumo dos dados demográficos do público (idade, gênero, localização, etc.).'),
});
export type SuggestAdAudienceOutput = z.infer<typeof SuggestAdAudienceOutputSchema>;

export async function suggestAdAudience(input: SuggestAdAudienceInput): Promise<SuggestAdAudienceOutput> {
  return suggestAdAudienceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAdAudiencePrompt',
  input: {schema: SuggestAdAudienceInputSchema},
  output: {schema: SuggestAdAudienceOutputSchema},
  prompt: `Você é um especialista em compra de mídia (media buyer) com vasta experiência em segmentação de público no Facebook Ads.
Sua tarefa é criar uma sugestão detalhada de público-alvo com base na descrição do cliente ideal fornecida.

A sugestão deve ser prática e diretamente aplicável na plataforma do Facebook.

Descrição do Cliente Ideal:
{{{customerProfile}}}

Gere um resultado no formato JSON com as seguintes chaves: "interests", "behaviors" e "demographics".`,
});

const suggestAdAudienceFlow = ai.defineFlow(
  {
    name: 'suggestAdAudienceFlow',
    inputSchema: SuggestAdAudienceInputSchema,
    outputSchema: SuggestAdAudienceOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
