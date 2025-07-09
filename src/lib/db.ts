import 'server-only';
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


/**
 * Cria e retorna uma nova conexão com o banco de dados.
 * É responsabilidade do chamador fechar a conexão com `connection.end()`.
 * Para aplicações de produção, considere usar um pool de conexões.
 */
export async function getDbConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
  } catch (error) {
    console.error('Falha ao criar conexão com o MySQL:', error);
    // Em uma aplicação real, você deve tratar este erro de forma mais robusta.
    throw new Error('Não foi possível conectar ao banco de dados.');
  }
}

// Para uma aplicação de produção, um pool de conexões é mais eficiente.
// Você pode inicializá-lo aqui e exportá-lo para ser usado em toda a aplicação.
/*
let pool: mysql.Pool | null = null;

export function getDbPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool.promise();
}
*/
