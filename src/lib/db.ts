'use server';
import 'server-only';
import mysql from 'mysql2/promise';

// Em um cenário de alto tráfego, esta função deve ser memoizada ou o objeto de conexão deve ser colocado em cache.
export async function getDbConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
        });
        return connection;
    } catch (error) {
        console.error("Falha na conexão com o banco de dados:", error);
        throw new Error("Não foi possível conectar ao banco de dados. Por favor, verifique suas variáveis de ambiente.");
    }
}
