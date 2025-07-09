import 'server-only';

// A funcionalidade de banco de dados foi temporariamente desativada para diagnóstico.
const dbDisabledError = "A funcionalidade de banco de dados está temporariamente desativada para diagnóstico.";

export async function getDbConnection(): Promise<any> {
    console.log("getDbConnection called but is disabled for diagnostics");
    throw new Error(dbDisabledError);
}
