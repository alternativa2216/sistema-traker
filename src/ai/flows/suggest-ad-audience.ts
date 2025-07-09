'use server';
/**
 * @fileOverview Sugere públicos-alvo para campanhas do Facebook Ads.
 *
 * - suggestAdAudience - Sugere um público-alvo.
 */

import {ai} from '@/ai/genkit';
import {
    SuggestAdAudienceInputSchema,
    SuggestAdAudienceOutputSchema,
    type SuggestAdAudienceInput,
    type SuggestAdAudienceOutput
} from '@/ai/schemas';


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
