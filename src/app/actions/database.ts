'use server';

import mysql from 'mysql2/promise';
import { z } from 'zod';

const DbCredentialsSchema = z.object({
  host: z.string().min(1, 'Host é obrigatório'),
  port: z.number(),
  user: z.string().min(1, 'Usuário é obrigatório'),
  password: z.string().optional(),
  database: z.string().min(1, 'Nome do banco de dados é obrigatório'),
});

type DbCredentials = z.infer<typeof DbCredentialsSchema>;

export async function testDatabaseConnectionAction(credentials: DbCredentials) {
  const validation = DbCredentialsSchema.safeParse(credentials);

  if (!validation.success) {
    throw new Error('Credenciais inválidas fornecidas.');
  }
  
  try {
    const connection = await mysql.createConnection({
        ...credentials,
        connectTimeout: 5000 // 5 second timeout
    });
    await connection.end();
    return { success: true };
  } catch (error: any) {
    console.error('Falha ao conectar ao MySQL:', error.message);
    if (error.code === 'ECONNREFUSED') {
        throw new Error('Conexão recusada. Verifique o host e a porta.');
    }
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        throw new Error('Acesso negado. Verifique o usuário e a senha.');
    }
    if (error.code === 'ER_BAD_DB_ERROR') {
        throw new Error('Banco de dados não encontrado.');
    }
    if (error.code === 'ENOTFOUND') {
        throw new Error('Host não encontrado. Verifique o nome do host.');
    }
    throw new Error('Falha ao conectar. Verifique os detalhes e a conectividade de rede.');
  }
}
