'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';
import { getDbConnection } from '@/lib/db';

const signUpSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  email: z.string().email('Por favor, insira um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

const loginSchema = z.object({
  email: z.string().email('Por favor, insira um e-mail válido.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

// Mock user type that aligns with what the header expects
export type MockUser = {
  uid: string;
  name: string;
  email: string;
  picture?: string;
}

// Mock sign-up. It saves the user to the database.
export async function signUpUser(formData: unknown) {
  const validation = signUpSchema.safeParse(formData);

  if (!validation.success) {
    throw new Error(validation.error.errors.map(e => e.message).join(', '));
  }
  
  const { name, email, password } = validation.data;
  // NOTE: We are not hashing the password in this mock implementation.
  // In a real production environment, ALWAYS hash passwords before storing.
  const userId = email; // Use email as mock UID

  let connection;
  try {
    connection = await getDbConnection();
    // We are not storing the password, just creating the user record.
    await connection.execute(
      'INSERT INTO users (id, name, email) VALUES (?, ?, ?)',
      [userId, name, email]
    );
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error("Este e-mail já está em uso.");
    }
    console.error("Database insertion failed:", error);
    throw new Error("Não foi possível salvar o usuário no banco de dados.");
  } finally {
    if (connection) await connection.end();
  }
  
  return { success: true, userId };
}

// Mock login. In a real app, this would verify password against DB.
export async function loginUser(formData: unknown) {
    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
        throw new Error(validation.error.errors.map(e => e.message).join(', '));
    }
    const { email, password } = validation.data;

    let connection;
    let userFromDb: any;
    try {
        connection = await getDbConnection();
        // NOTE: We are NOT checking the password in this mock implementation.
        const [rows] = await connection.execute('SELECT id, name, email FROM users WHERE email = ?', [email]);
        if (Array.isArray(rows) && rows.length > 0) {
            userFromDb = rows[0];
        } else {
            throw new Error("Usuário não encontrado ou senha inválida.");
        }
    } catch (error: any) {
         console.error("Database lookup failed:", error);
         throw new Error("Erro ao acessar o banco de dados.");
    } finally {
        if (connection) await connection.end();
    }

    // Create a session if the user exists.
    const user: MockUser = {
        uid: userFromDb.id,
        email: userFromDb.email,
        name: userFromDb.name,
    };
    const sessionValue = JSON.stringify(user);
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    cookies().set('session', sessionValue, { maxAge: expiresIn, httpOnly: true, secure: true });

    return { success: true };
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
