'use server';

import { getDbConnection, type DbCredentials } from "@/lib/db";
import { z } from "zod";
import { promises as fs } from 'fs';
import path from 'path';

// Zod schema for validation
const dbCredentialsSchema = z.object({
  host: z.string().min(1, 'Host é obrigatório'),
  port: z.coerce.number().min(1, 'Porta é obrigatória'),
  user: z.string().min(1, 'Usuário é obrigatório'),
  password: z.string().optional(),
  database: z.string().min(1, 'Nome do banco de dados é obrigatório'),
});


// Definições das tabelas
const createUsersTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  plan VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createProjectsTableQuery = `
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

const createSettingsTableQuery = `
CREATE TABLE IF NOT EXISTS settings (
  setting_key VARCHAR(255) PRIMARY KEY,
  setting_value TEXT
);
`;

async function handleConnectionError(error: any, connection: any) {
    if (connection) {
        await connection.end();
    }

    if (error.code === 'ECONNREFUSED') {
        throw new Error("A conexão com o banco de dados foi recusada. Verifique se o servidor de banco de dados está em execução e se o host e a porta estão corretos.");
    }
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
         throw new Error("Acesso negado ao banco de dados. Verifique o usuário e a senha.");
    }
     if (error.code === 'ER_BAD_DB_ERROR') {
         throw new Error(`O banco de dados especificado não foi encontrado. Por favor, crie-o ou verifique o nome.`);
    }

    throw new Error(error.message || "Ocorreu um erro desconhecido durante a operação do banco de dados.");
}

export async function saveDbCredentialsAction(data: unknown) {
    const validation = dbCredentialsSchema.safeParse(data);
    if (!validation.success) {
        throw new Error(validation.error.errors.map(e => e.message).join(', '));
    }
    const credentials = validation.data;

    const envPath = path.resolve(process.cwd(), '.env');
    let envContent = '';
    try {
        envContent = await fs.readFile(envPath, 'utf-8');
    } catch (e) {
        // .env file might not exist, which is fine
    }

    const lines = envContent.split('\n');
    const dbKeys = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
    
    // Filter out old DB keys and empty lines
    let newLines = lines.filter(line => {
        const trimmedLine = line.trim();
        if (trimmedLine === '') return false;
        return !dbKeys.some(key => trimmedLine.startsWith(key + '='));
    });

    // Add new DB keys from credentials
    newLines.push(`DB_HOST=${credentials.host}`);
    newLines.push(`DB_PORT=${credentials.port}`);
    newLines.push(`DB_USER=${credentials.user}`);
    newLines.push(`DB_PASSWORD=${credentials.password || ''}`);
    newLines.push(`DB_NAME=${credentials.database}`);

    try {
        await fs.writeFile(envPath, newLines.join('\n'));
        return { success: true, message: 'Credenciais salvas com sucesso no arquivo .env!' };
    } catch (error: any) {
        console.error("Falha ao salvar o arquivo .env:", error);
        throw new Error("Não foi possível salvar as credenciais. Verifique as permissões do servidor.");
    }
}


export async function testDbConnectionAction(data: unknown) {
    const validation = dbCredentialsSchema.safeParse(data);
    if (!validation.success) {
        throw new Error(validation.error.errors.map(e => e.message).join(', '));
    }
    const credentials = validation.data;
    
    let connection;
    try {
        connection = await getDbConnection(credentials);
        await connection.ping();
        await connection.end();
        return {
            success: true,
            message: "Conexão com o banco de dados bem-sucedida!",
        };
    } catch (error: any) {
        console.error("Falha no teste de conexão com o banco de dados:", error);
        await handleConnectionError(error, connection);
        // Fallback return (should not be reached if handleConnectionError throws)
        return { success: false, message: error.message };
    }
}


export async function installDatabaseAction(data: unknown) {
    const validation = dbCredentialsSchema.safeParse(data);
    if (!validation.success) {
        throw new Error(validation.error.errors.map(e => e.message).join(', '));
    }
    const credentials = validation.data;

    let connection;
    try {
        connection = await getDbConnection(credentials);
        await connection.query(createUsersTableQuery);
        await connection.query(createProjectsTableQuery);
        await connection.query(createSettingsTableQuery);
        
        await connection.end();
        
        return {
            success: true,
            message: "Banco de dados instalado com sucesso! As tabelas 'users', 'projects' e 'settings' foram criadas.",
        };
    } catch (error: any) {
        console.error("Falha na instalação do banco de dados:", error);
        await handleConnectionError(error, connection);
        // Fallback return (should not be reached if handleConnectionError throws)
        return { success: false, message: error.message };
    }
}
