'use server';
/**
 * @fileOverview Gera textos de anúncio para o Facebook com base na descrição de um produto.
 *
 * - generateAdCopy - Gera o texto do anúncio.
 * - GenerateAdCopyInput - O tipo de entrada para a função generateAdCopy.
 * - GenerateAdCopyOutput - O tipo de retorno para a função generateAdCopy.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAdCopyInputSchema = z.object({
  productDescription: z.string().describe('Uma descrição detalhada do produto ou serviço a ser anunciado.'),
});
export type GenerateAdCopyInput = z.infer<typeof GenerateAdCopyInputSchema>;

const GenerateAdCopyOutputSchema = z.object({
  headline: z.string().describe('Um título curto e impactante para o anúncio (máximo 40 caracteres).'),
  primaryText: z.string().describe('O corpo principal do anúncio, persuasivo e informativo (máximo 125 caracteres).'),
  cta: z.string().describe('Uma chamada para ação clara e concisa (ex: "Compre Agora", "Saiba Mais").'),
});
export type GenerateAdCopyOutput = z.infer<typeof GenerateAdCopyOutputSchema>;

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
