'use server';
import 'server-only';

import { cookies } from 'next/headers';
import { z } from 'zod';
import { getDbConnection } from '@/lib/db';
import { randomUUID } from 'crypto';

const signUpSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  email: z.string().email('Por favor, insira um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

const loginSchema = z.object({
  email: z.string().email('Por favor, insira um e-mail válido.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

export type MockUser = {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  picture?: string;
}

// Mock sign-up. It saves the user to the database.
export async function signUpUser(formData: unknown) {
  const validation = signUpSchema.safeParse(formData);

  if (!validation.success) {
    throw new Error(validation.error.errors.map(e => e.message).join(', '));
  }
  
  const { name, email, password } = validation.data;
  // NOTE: In a real production environment, ALWAYS hash passwords before storing.
  const userId = randomUUID(); // Use a random UUID for the ID

  let connection;
  try {
    connection = await getDbConnection();

    // Check if there are any users in the database
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const count = (rows as any[])[0].count;
    
    // The first user to register becomes the admin
    const role = count === 0 ? 'admin' : 'user';

    // Storing password directly. Hashing should be implemented for production.
    await connection.execute(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [userId, name, email, password, role]
    );
    return { success: true, userId };
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error("Este e-mail já está em uso.");
    }
    console.error("Database insertion failed:", error);
    throw new Error("Não foi possível salvar o usuário no banco de dados.");
  } finally {
    if (connection) await connection.end();
  }
}

// Mock login. In a real app, this would verify password against DB.
export async function loginUser(formData: unknown) {
    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
        throw new Error(validation.error.errors.map(e => e.message).join(', '));
    }
    const { email, password } = validation.data;

    let connection;
    try {
        connection = await getDbConnection();
        // NOTE: Comparing plain text passwords. Hashing should be implemented for production.
        const [rows] = await connection.execute('SELECT id, name, email, password, role FROM users WHERE email = ?', [email]);
        
        if (!Array.isArray(rows) || rows.length === 0) {
            throw new Error("Usuário não encontrado ou senha inválida.");
        }

        const userFromDb: any = rows[0];
        if (userFromDb.password !== password) {
            throw new Error("Usuário não encontrado ou senha inválida.");
        }

        // Create a session if the user exists.
        const user: MockUser = {
            uid: userFromDb.id,
            email: userFromDb.email,
            name: userFromDb.name,
            role: userFromDb.role,
        };
        const sessionValue = JSON.stringify(user);
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        cookies().set('session', sessionValue, { maxAge: expiresIn, httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        return { success: true, role: user.role };

    } catch (error: any) {
         console.error("Database lookup failed:", error);
         throw new Error(error.message || "Erro ao acessar o banco de dados.");
    } finally {
        if (connection) await connection.end();
    }
}


export async function clearSessionCookie() {
  cookies().delete('session');
}


export async function getCurrentUser(): Promise<MockUser | null> {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const user = JSON.parse(sessionCookie) as MockUser;
    return user;
  } catch (error) {
    console.log("Could not parse session cookie:", error);
    return null;
  }
}
