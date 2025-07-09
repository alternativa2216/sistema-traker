'use server';

import { z } from 'zod';
import { adminAuth } from '@/lib/firebase-admin';
import { getDbConnection } from '@/lib/db';
import { cookies } from 'next/headers';

const SignUpSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

export async function signUpUser(formData: z.infer<typeof SignUpSchema>) {
  const validation = SignUpSchema.safeParse(formData);
  if (!validation.success) {
    throw new Error(validation.error.errors.map(e => e.message).join(', '));
  }

  const { name, email, password } = validation.data;

  try {
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    const connection = await getDbConnection();
    await connection.execute(
      'INSERT INTO users (id, name, email, plan) VALUES (?, ?, ?, ?)',
      [userRecord.uid, name, email, 'free']
    );
    await connection.end();

    return { success: true, userId: userRecord.uid };
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      throw new Error('Este e-mail já está em uso.');
    }
    console.error("Firebase SignUp Error:", error);
    throw new Error('Falha ao criar a conta. Por favor, tente novamente.');
  }
}

export async function createSessionCookie(idToken: string) {
    try {
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
        cookies().set('__session', sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: true, path: '/' });
        return { success: true };
    } catch(error) {
        console.error("Failed to create session cookie:", error);
        throw new Error("Failed to create session.");
    }
}

export async function clearSessionCookie() {
    cookies().set('__session', '', { maxAge: 0, path: '/' });
}

export async function sendPasswordResetEmailAction(email: string) {
    try {
        await adminAuth.generatePasswordResetLink(email);
        // Firebase handles sending the email if configured in the console
        return { success: true };
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            // To prevent email enumeration, we don't reveal that the user doesn't exist.
            // We just return success, but log the issue.
            console.log(`Password reset attempt for non-existent user: ${email}`);
            return { success: true };
        }
        console.error("Password Reset Error:", error);
        throw new Error("Não foi possível enviar o e-mail de redefinição de senha.");
    }
}

export async function getCurrentUser() {
  const sessionCookie = cookies().get('__session')?.value;
  if (!sessionCookie) return null;

  try {
    const decodedIdToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedIdToken;
  } catch (error) {
    return null;
  }
}
