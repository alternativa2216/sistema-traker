'use server';
import 'server-only';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Verifica se a chave da API do Google está disponível.
// Se não, lança um erro para evitar que a aplicação execute com a IA desconfigurada.
if (!process.env.GOOGLE_API_KEY) {
    const errorMessage = "A variável de ambiente GOOGLE_API_KEY não está definida. A funcionalidade de IA não pode ser inicializada. Por favor, adicione sua chave ao arquivo .env";
    console.error(errorMessage);
    // Em um ambiente de produção, você pode querer lidar com isso de forma mais graciosa.
    // Para desenvolvimento, lançar um erro é claro e informativo.
    throw new Error(errorMessage);
}

export const ai = genkit({
  plugins: [
    googleAI({
      // A chave da API é passada para o plugin do Google AI.
      // O Genkit usará esta chave para autenticar as solicitações para a API do Gemini.
      apiKey: process.env.GOOGLE_API_KEY,
    }),
  ],
});
