'use server';
import 'server-only';
import dotenv from 'dotenv';
import path from 'path';

// Carrega as variáveis do arquivo .env na raiz do projeto
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
