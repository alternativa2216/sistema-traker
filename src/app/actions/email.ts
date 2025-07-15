'use server';

import 'server-only';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const smtpCredentialsSchema = z.object({
  host: z.string().min(1, "Host é obrigatório"),
  port: z.coerce.number().min(1, "Porta é obrigatória"),
  secure: z.boolean(),
  user: z.string().optional(),
  pass: z.string().optional(),
  fromName: z.string().min(1, "Nome do remetente é obrigatório"),
  fromEmail: z.string().email("Email do remetente inválido"),
  testEmail: z.string().email("Email de teste inválido"),
});


export async function testSmtpConnectionAction(credentials: unknown) {
  const validation = smtpCredentialsSchema.safeParse(credentials);
  if (!validation.success) {
    throw new Error(validation.error.errors.map(e => e.message).join(', '));
  }
  const { host, port, secure, user, pass, fromName, fromEmail, testEmail } = validation.data;

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: user || '',
        pass: pass || '',
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.verify();
    
    await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: testEmail,
        subject: "Teste de Conexão SMTP - Tracklytics",
        text: "Se você recebeu este e-mail, sua conexão SMTP está funcionando corretamente!",
        html: "<b>Se você recebeu este e-mail, sua conexão SMTP está funcionando corretamente!</b>",
    });

    return { success: true, message: 'Conexão SMTP bem-sucedida e e-mail de teste enviado!' };
  } catch (error: any) {
    console.error("SMTP Connection Error:", error);
    if (error.code === 'ECONNRESET') {
        throw new Error("A conexão foi redefinida. Verifique se a porta e as configurações de segurança (SSL/TLS) estão corretas.");
    }
    if (error.code === 'EAUTH' || error.command === 'AUTH LOGIN') {
         throw new Error("Falha na autenticação. Verifique o usuário e a senha.");
    }
    throw new Error(`Falha na conexão SMTP: ${error.message}`);
  }
}
