'use server';

// A funcionalidade de autenticação foi temporariamente desativada para diagnóstico.
const authDisabledError = "A funcionalidade de autenticação está temporariamente desativada para diagnóstico.";

export async function signUpUser(formData: any) {
  console.log("signUpUser called but is disabled for diagnostics");
  throw new Error(authDisabledError);
}

export async function createSessionCookie(idToken: string) {
    console.log("createSessionCookie called but is disabled for diagnostics");
    // Não gere erro para permitir que o fluxo de login de teste pareça funcionar.
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
  // Para fins de desenvolvimento, estamos retornando um usuário mockado.
  // Isso permite que você acesse o painel sem precisar configurar a autenticação completa.
  console.log("getCurrentUser called, returning mock user for development.");
  return {
    name: "Usuário de Teste",
    email: "teste@tracklytics.com",
    picture: "https://placehold.co/40x40.png",
    uid: "mock-user-uid",
    auth_time: Date.now() / 1000,
    user_id: "mock-user-uid",
    firebase: { identities: {}, 'sign_in_provider': 'password' },
    iat: Date.now() / 1000,
    exp: (Date.now() / 1000) + 3600,
    sub: "mock-user-uid",
    aud: "mock-project-id",
    iss: "https://securetoken.google.com/mock-project-id"
  };
}
