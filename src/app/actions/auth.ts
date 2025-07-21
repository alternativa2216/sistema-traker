'use server';

import 'server-only';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { getDbConnection } from '@/lib/db';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { verifyPasswordAndCreateSession } from './auth-helpers';

const signUpSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  email: z.string().email('Por favor, insira um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
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
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const userId = randomUUID(); 

  let connection;
  try {
    connection = await getDbConnection();

    // Check if there are any users in the database
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const count = (rows as any[])[0].count;
    
    // The first user to register becomes the admin
    const isFirstUser = count === 0;
    const role = isFirstUser ? 'admin' : 'user';

    await connection.execute(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [userId, name, email, hashedPassword, role]
    );
    
    // Create session automatically after signing up
    const user: MockUser = {
        uid: userId,
        email: email,
        name: name,
        role: role as 'user' | 'admin',
    };
    const sessionValue = JSON.stringify(user);
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    cookies().set('session', sessionValue, { maxAge: expiresIn, httpOnly: true, secure: process.env.NODE_ENV === 'production' });


    return { success: true, userId, isFirstUser, role };
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
    const result = await verifyPasswordAndCreateSession(formData);
    
    if (!result.success) {
        throw new Error(result.message);
    }

    const { user, role } = result;

    // Create a session if the user exists.
    const sessionValue = JSON.stringify(user);
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    cookies().set('session', sessionValue, { maxAge: expiresIn, httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    return { success: true, role };
}


export async function clearSessionCookie() {
  cookies().delete('session');
}

// This is the main version of getCurrentUser for use in Server Components and Server Actions.
// It is NOT safe for the Edge runtime.
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
