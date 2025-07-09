'use server';

// A funcionalidade de autenticação foi temporariamente desativada para diagnóstico.
const authDisabledError = "A funcionalidade de autenticação está temporariamente desativada para diagnóstico.";

export async function signUpUser(formData: any) {
  console.log("signUpUser called but is disabled for diagnostics");
  throw new Error(authDisabledError);
}

export async function createSessionCookie(idToken: string) {
    console.log("createSessionCookie called but is disabled for diagnostics");
    throw new Error(authDisabledError);
}

export async function clearSessionCookie() {
    // Não gere erro aqui para permitir que o fluxo de logout complete visualmente.
    console.log("clearSessionCookie called but is disabled for diagnostics");
}

export async function sendPasswordResetEmailAction(email: string) {
    console.log("sendPasswordResetEmailAction called but is disabled for diagnostics");
    throw new Error(authDisabledError);
}

export async function getCurrentUser() {
  console.log("getCurrentUser called but is disabled for diagnostics");
  // Retornar null permite que o aplicativo renderize, embora em um estado de logout.
  return null;
}
