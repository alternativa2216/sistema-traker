'use server';

import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { getDbConnection } from '@/lib/db';
import { z } from 'zod';

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
  
  const { email, password, name } = validation.data;

  try {
    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });
    
    // Create user in local database
    const connection = await getDbConnection();
    await connection.execute(
      'INSERT INTO users (id, name, email) VALUES (?, ?, ?)',
      [userRecord.uid, name, email]
    );
    await connection.end();

    return { success: true, userId: userRecord.uid };
  } catch (error: any) {
    console.error("Error signing up:", error);
    if (error.code === 'auth/email-already-exists') {
      throw new Error('Este e-mail já está em uso. Por favor, tente outro.');
    }
    throw new Error('Ocorreu um erro inesperado ao criar a conta.');
  }
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
    try {
        const link = await adminAuth.generatePasswordResetLink(email);
        // Here you would typically use an email service to send the link.
        // For now, we'll just log it to the console for demonstration.
        console.log(`Password reset link for ${email}: ${link}`);
        // In a real app, you'd want to avoid leaking the link to the console.
        // You would integrate a service like Nodemailer, SendGrid, etc.
    } catch (error: any) {
        console.error("Error sending password reset email:", error);
        if (error.code === 'auth/user-not-found') {
            // To avoid email enumeration attacks, don't reveal that the user doesn't exist.
            // Just return normally. The user won't receive an email.
            return;
        }
        throw new Error('Não foi possível enviar o e-mail de redefinição de senha.');
    }
}

export async function getCurrentUser() {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) {
    return null;
  }
  try {
    const decodedIdToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedIdToken;
  } catch (error) {
    // Session cookie is invalid or expired.
    // Force a cleanup of the cookie.
    cookies().delete('session');
    return null;
  }
}
