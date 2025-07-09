import 'server-only';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

let ai: any;

try {
  // This will throw an error if GOOGLE_API_KEY is not set
  ai = genkit({
    plugins: [googleAI()],
  });
} catch (e) {
  console.warn(
    'Genkit com Google AI não foi inicializado. A funcionalidade de IA não funcionará. ' +
    'Verifique se a variável de ambiente GOOGLE_API_KEY está definida corretamente. ' +
    `Erro: ${(e as Error).message}`
  );

  // Provide a mock implementation that will throw a clear error at runtime if used,
  // but allows the application to build and start successfully.
  const unconfiguredAction = () => {
    throw new Error(
      'A funcionalidade de IA não está configurada. Verifique as variáveis de ambiente.'
    );
  };

  ai = {
    defineFlow: () => unconfiguredAction,
    definePrompt: () => unconfiguredAction,
    generate: unconfiguredAction,
  };
}

export {ai};
