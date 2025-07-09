'use server';

// A funcionalidade de e-mail foi temporariamente desativada para diagnóstico.
const emailDisabledError = "A funcionalidade de e-mail está temporariamente desativada para diagnóstico.";

export async function testSmtpConnectionAction(credentials: any) {
  console.log("testSmtpConnectionAction called but is disabled for diagnostics");
  throw new Error(emailDisabledError);
}
