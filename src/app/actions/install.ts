'use server';

import mysql from 'mysql2/promise';

// ATENÇÃO: As credenciais foram inseridas diretamente aqui para facilitar a instalação,
// conforme solicitado. Em um ambiente de produção, elas NUNCA devem ser
// hardcoded. O ideal é movê-las para variáveis de ambiente.
const dbConfig = {
  host: '84.54.23.29',
  user: 'tracklytics',
  password: 'Niz83SJJwxeBCGjN',
  database: 'tracklytics',
  connectTimeout: 10000,
};

const createTablesQueries = [
  `
  CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY COMMENT 'Firebase UID',
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    plan VARCHAR(50) DEFAULT 'free' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS sites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    tracking_id VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'free',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    next_billing_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS user_alerts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL COMMENT 'info, promo, critical',
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS system_settings (
    setting_key VARCHAR(255) PRIMARY KEY,
    setting_value TEXT
  );
  `
];


export async function installDatabaseAction() {
  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    for (const query of createTablesQueries) {
      await connection.query(query);
    }
    
    await connection.end();
    return { success: true, message: 'Banco de dados instalado com sucesso! Todas as tabelas foram criadas.' };
  } catch (error: any) {
    if (connection) {
      await connection.end();
    }
    console.error('Falha na instalação do banco de dados:', error.message);
    throw new Error(`Falha na instalação do banco de dados: ${error.message}`);
  }
}
