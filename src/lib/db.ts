// NOTA: Este é um arquivo de exemplo para demonstrar como a conexão com o banco de dados seria configurada.
// Em uma aplicação real, você deve gerenciar as conexões de forma segura,
// possivelmente usando um pool de conexões e carregando as credenciais de variáveis de ambiente.

import mysql from 'mysql2/promise';

// A configuração da conexão deve usar variáveis de ambiente.
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'tracklytics',
};

// Exemplo de função para testar a conexão.
export async function testDbConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Conexão com o MySQL bem-sucedida!');
    await connection.end();
    return { success: true };
  } catch (error) {
    console.error('Falha ao conectar ao MySQL:', error);
    // Em uma aplicação real, você deve tratar este erro de forma mais robusta.
    throw new Error('Não foi possível conectar ao banco de dados.');
  }
}

// Em uma aplicação real, você exportaria um pool de conexões aqui.
// export const pool = mysql.createPool(dbConfig);
