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
    const config = (credentials && credentials.host) ? {
        host: credentials.host,
        user: credentials.user,
        password: credentials.password,
        database: credentials.database,
        port: credentials.port ? Number(credentials.port) : 3306,
    } : {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    };

    if (!config.host) {
        throw new Error("O host do banco de dados não está configurado. Por favor, configure-o no seu arquivo .env ou forneça-o na página de instalação.");
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
