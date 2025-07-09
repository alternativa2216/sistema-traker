'use server';
import 'server-only';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const apiKey = process.env.GOOGLE_API_KEY;

// Inicializa os plugins apenas se a chave da API estiver disponível.
// Isso evita que a aplicação quebre durante a inicialização se a chave não estiver configurada.
const plugins = [];
if (apiKey) {
  plugins.push(
    googleAI({
      apiKey,
    })
  );
} else {
  // Em vez de lançar um erro, apenas registramos no console que a IA está desativada.
  // A verificação real e o erro para o usuário ocorrerão no nível da ação.
  console.warn(
    'A variável de ambiente GOOGLE_API_KEY não está definida. A funcionalidade de IA está desativada.'
  );
}

export const ai = genkit({
  plugins,
});
