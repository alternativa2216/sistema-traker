'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';
import { getDbConnection } from '@/lib/db';
import { adminAuth } from '@/lib/firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { Auth, getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '@/lib/firebase';

const signUpSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  email: z.string().email('Por favor, insira um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

export async function signUpUser(formData: unknown) {
  const validation = signUpSchema.safeParse(formData);

  if (!validation.success) {
    throw new Error(validation.error.errors.map(e => e.message).join(', '));
  }
  
  const { name, email, password } = validation.data;

  // 1. Create user in Firebase Auth
  const userRecord = await adminAuth.createUser({
    email,
    password,
    displayName: name,
  });

  // 2. Insert user into the database
  const connection = await getDbConnection();
  try {
    await connection.execute(
      'INSERT INTO users (id, name, email) VALUES (?, ?, ?)',
      [userRecord.uid, name, email]
    );
  } catch (error: any) {
    // If database insertion fails, delete the Firebase user to keep things consistent
    await adminAuth.deleteUser(userRecord.uid);
    console.error("Database insertion failed:", error);
    throw new Error("Não foi possível salvar o usuário no banco de dados.");
  } finally {
    await connection.end();
  }
  
  return { success: true, userId: userRecord.uid };
}


export async function createSessionCookie(idToken: string) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
  cookies().set('session', sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: true });
}


export async function clearSessionCookie() {
  cookies().delete('session');
}


export async function sendPasswordResetEmailAction(email: string) {
  if (!app) {
    console.warn("Firebase client not initialized. Cannot send password reset email.");
    throw new Error("A funcionalidade de e-mail não está configurada.");
  }
  const authClient = getAuth(app);
  await sendPasswordResetEmail(authClient, email);
}


export async function getCurrentUser(): Promise<DecodedIdToken | null> {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    // Set checkRevoked to true, forcing a check for session revocation.
    const decodedIdToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedIdToken;
  } catch (error) {
    console.log("Could not verify session cookie:", error);
    return null;
  }
}
