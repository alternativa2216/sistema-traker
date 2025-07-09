'use server';
import 'server-only';

// A funcionalidade de IA (Genkit) foi temporariamente desativada para diagnóstico.
const genkitDisabledError = "A funcionalidade de IA (Genkit) está temporariamente desativada para diagnóstico.";

const unconfiguredAction = () => {
    throw new Error(genkitDisabledError);
};

// This proxy will throw an error if any genkit function is actually called,
// but it allows the application to build by not having any direct imports to genkit libraries.
const aiProxy = new Proxy({}, {
  get() {
    return unconfiguredAction;
  },
}) as any;

export { aiProxy as ai };
