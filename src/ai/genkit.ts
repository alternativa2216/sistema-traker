'use server';
import 'server-only';
import {genkit, type Genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

let aiInstance: Genkit | null = null;

function getAiInstance(): Genkit {
    if (aiInstance) {
        return aiInstance;
    }

    try {
        // This will throw an error if GOOGLE_API_KEY is not set
        aiInstance = genkit({
            plugins: [googleAI()],
        });
        return aiInstance;
    } catch (e) {
        console.warn(
            'Genkit com Google AI não foi inicializado. A funcionalidade de IA não funcionará. ' +
            'Verifique se a variável de ambiente GOOGLE_API_KEY está definida corretamente. ' +
            `Erro: ${(e as Error).message}`
        );

        // Return a mock implementation that will throw a clear error at runtime if used,
        // but allows the application to build and start successfully.
        const unconfiguredAction = () => {
            throw new Error(
                'A funcionalidade de IA não está configurada. Verifique as variáveis de ambiente.'
            );
        };
        
        // This is a type-safe mock of the Genkit object.
        aiInstance = {
            defineFlow: () => unconfiguredAction,
            definePrompt: () => unconfiguredAction,
            generate: unconfiguredAction,
        } as unknown as Genkit;

        return aiInstance;
    }
}

// A proxy to lazily initialize Genkit and get its services
const aiProxy = new Proxy<Genkit>({} as Genkit, {
  get(target, prop) {
    const instance = getAiInstance();
    // @ts-ignore
    const value = Reflect.get(instance, prop);
    if (typeof value === 'function') {
        return value.bind(instance);
    }
    return value;
  },
});

export { aiProxy as ai };
