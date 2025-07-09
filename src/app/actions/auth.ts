'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

const signUpSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  email: z.string().email('Por favor, insira um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

// Firebase functionality is disabled for diagnostics. This is a mock implementation.
export async function signUpUser(formData: unknown) {
  const validation = signUpSchema.safeParse(formData);

  if (!validation.success) {
    throw new Error(validation.error.errors.map(e => e.message).join(', '));
  }
  
  console.log("signUpUser called, but Firebase/DB is disabled. Returning success.");
  
  // The following block is temporarily disabled to diagnose a build error.
  // const connection = await getDbConnection();
  // await connection.execute(
  //   'INSERT INTO users (id, name, email) VALUES (?, ?, ?)',
  //   [userRecord.uid, name, email]
  // );
  // await connection.end();
  
  return { success: true, userId: 'mock-user-id' };
}

// Firebase functionality is disabled for diagnostics.
export async function createSessionCookie(idToken: string) {
  console.log("createSessionCookie called, but Firebase is disabled. Setting mock cookie.");
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  cookies().set('session', 'mock-session-cookie-for-diagnostics', { maxAge: expiresIn, httpOnly: true, secure: true });
}

// Firebase functionality is disabled for diagnostics.
export async function clearSessionCookie() {
  console.log("clearSessionCookie called, but Firebase is disabled.");
  cookies().delete('session');
}

// Firebase functionality is disabled for diagnostics.
export async function sendPasswordResetEmailAction(email: string) {
    console.log(`Password reset for ${email} requested. To send emails, configure SMTP variables in your .env file and implement the email sending logic.`);
    // This is now a mock action. In a real scenario, you would use a service like nodemailer
    // to send a password reset link. The UI for this is on the /forgot-password page.
    return;
}

// Firebase functionality is disabled for diagnostics. This returns a mock user to allow UI development.
export async function getCurrentUser() {
    return {
        name: 'Elon Muskads',
        email: 'elonmskads@gmail.com',
        uid: 'mock-admin-user-uid-12345',
        picture: '',
        email_verified: true,
        auth_time: Math.floor(Date.now() / 1000),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
        firebase: { identities: {}, 'sign_in_provider': 'password' }
    };
}
