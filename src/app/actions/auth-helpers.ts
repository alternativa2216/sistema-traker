'use server';

import 'server-only';
import { getDbConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';
import type { MockUser } from './auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Por favor, insira um e-mail válido.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

// This function contains bcrypt and should NOT be imported into middleware.
export async function verifyPasswordAndCreateSession(formData: unknown): Promise<{ success: true; user: MockUser, role: 'user' | 'admin' } | { success: false; message: string }> {
    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
        return { success: false, message: validation.error.errors.map(e => e.message).join(', ') };
    }
    const { email, password } = validation.data;

    let connection;
    try {
        connection = await getDbConnection();
        const [rows] = await connection.execute('SELECT id, name, email, password, role FROM users WHERE email = ?', [email]);
        
        const users = rows as any[];
        if (users.length === 0) {
            return { success: false, message: "Usuário não encontrado ou senha inválida." };
        }

        const userFromDb: any = users[0];
        
        const passwordMatch = await bcrypt.compare(password, userFromDb.password);
        if (!passwordMatch) {
            return { success: false, message: "Usuário não encontrado ou senha inválida." };
        }

        const user: MockUser = {
            uid: userFromDb.id,
            email: userFromDb.email,
            name: userFromDb.name,
            role: userFromDb.role,
        };

        return { success: true, user, role: user.role };

    } catch (error: any) {
         console.error("Database lookup failed:", error);
         return { success: false, message: error.message || "Erro ao acessar o banco de dados." };
    } finally {
        if (connection) await connection.end();
    }
}
