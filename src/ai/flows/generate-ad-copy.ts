'use server';
/**
 * @fileOverview Gera textos de anúncio para o Facebook com base na descrição de um produto.
 *
 * - generateAdCopy - Gera o texto do anúncio.
 */

import {ai} from '@/ai/genkit';
import {
    GenerateAdCopyInputSchema,
    GenerateAdCopyOutputSchema,
    type GenerateAdCopyInput,
    type GenerateAdCopyOutput
} from '@/ai/schemas';

export async function generateAdCopy(input: GenerateAdCopyInput): Promise<GenerateAdCopyOutput> {
  return generateAdCopyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdCopyPrompt',
  input: {schema: GenerateAdCopyInputSchema},
  output: {schema: GenerateAdCopyOutputSchema},
  prompt: `Você é um especialista em marketing digital e copywriting, especializado em anúncios para o Facebook.
Sua tarefa é criar um conjunto de textos de anúncio (copy) com base na descrição do produto fornecida.

O texto deve ser persuasivo, claro e otimizado para a plataforma do Facebook.

Descrição do Produto:
{{{productDescription}}}

Gere um resultado no formato JSON com as seguintes chaves: "headline", "primaryText" e "cta".`,
});

const generateAdCopyFlow = ai.defineFlow(
  {
    name: 'generateAdCopyFlow',
    inputSchema: GenerateAdCopyInputSchema,
    outputSchema: GenerateAdCopyOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
