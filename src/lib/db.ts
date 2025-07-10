'use server';
import 'server-only';
import mysql from 'mysql2/promise';

export interface DbCredentials {
    host?: string | null;
    port?: number | null;
    user?: string | null;
    password?: string | null;
    database?: string | null;
}

// Em um cenário de alto tráfego, esta função deve ser memoizada ou o objeto de conexão deve ser colocado em cache.
export async function getDbConnection(credentials?: DbCredentials) {
    const config = {
        host: credentials?.host || process.env.DB_HOST,
        user: credentials?.user || process.env.DB_USER,
        password: credentials?.password || process.env.DB_PASSWORD,
        database: credentials?.database || process.env.DB_NAME,
        port: credentials?.port ? Number(credentials.port) : (process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306),
    };

    if (!config.host || !config.user || !config.database) {
        throw new Error("As credenciais do banco de dados (Host, User, Database) não estão configuradas. Por favor, configure-as no seu arquivo .env ou na página de instalação.");
    }
    
    try {
        const connection = await mysql.createConnection(config);
        return connection;
    } catch (error) {
        console.error("Falha na conexão com o banco de dados:", error);
        // This is a generic error, the action will handle specific error codes.
        throw new Error("Não foi possível conectar ao banco de dados. Verifique as credenciais fornecidas.");
    }
}
