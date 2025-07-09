'use server';

// A funcionalidade de instalação foi temporariamente desativada para diagnóstico.
const installDisabledError = "A funcionalidade de instalação está temporariamente desativada para diagnóstico.";

export async function installDatabaseAction() {
  console.log("installDatabaseAction called but is disabled for diagnostics");
  throw new Error(installDisabledError);
}
