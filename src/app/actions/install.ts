'use server';

import { getDbConnection } from "@/lib/db";

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


export async function installDatabaseAction() {
    let connection;
    try {
        connection = await getDbConnection();
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
        
        if (connection) {
            await connection.end();
        }

        // Fornece mensagens de erro mais específicas
        if (error.code === 'ECONNREFUSED') {
            throw new Error("A conexão com o banco de dados foi recusada. Verifique se o servidor de banco de dados está em execução e as credenciais em seu arquivo .env estão corretas.");
        }
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
             throw new Error("Acesso negado ao banco de dados. Verifique o usuário e a senha no seu arquivo .env.");
        }
         if (error.code === 'ER_BAD_DB_ERROR') {
             throw new Error(`O banco de dados '${process.env.DB_NAME}' não foi encontrado. Por favor, crie-o ou verifique o nome no seu arquivo .env.`);
        }

        throw new Error(error.message || "Ocorreu um erro desconhecido durante a instalação.");
    }
}
