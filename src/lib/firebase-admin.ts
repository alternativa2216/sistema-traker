import 'server-only';

// A funcionalidade do Firebase Admin foi temporariamente desativada para diagnóstico.
const adminDisabledError = "A funcionalidade do Firebase Admin está temporariamente desativada para diagnóstico.";

const unconfiguredAction = () => {
  throw new Error(adminDisabledError);
};

export const adminAuth = {
  createUser: unconfiguredAction,
  createSessionCookie: unconfiguredAction,
  verifySessionCookie: unconfiguredAction,
  generatePasswordResetLink: unconfiguredAction,
} as any;

export const adminDb = {
  collection: unconfiguredAction,
  doc: unconfiguredAction,
} as any;
