'use server';

import nodemailer from 'nodemailer';
import { z } from 'zod';

const SmtpCredentialsSchema = z.object({
  host: z.string().min(1, 'Host é obrigatório'),
  port: z.number(),
  secure: z.boolean(),
  user: z.string().min(1, 'Usuário é obrigatório'),
  pass: z.string().min(1, 'Senha é obrigatória'),
  fromName: z.string().min(1, 'Nome do remetente é obrigatório'),
  fromEmail: z.string().email('Email do remetente inválido'),
  testEmail: z.string().email('Email de teste inválido'),
});

type SmtpCredentials = z.infer<typeof SmtpCredentialsSchema>;

export async function testSmtpConnectionAction(credentials: SmtpCredentials) {
  const validation = SmtpCredentialsSchema.safeParse(credentials);

  if (!validation.success) {
    throw new Error('Credenciais SMTP inválidas fornecidas.');
  }

  const { host, port, secure, user, pass, fromName, fromEmail, testEmail } = validation.data;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    await transporter.verify();
    
    await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: testEmail,
        subject: 'Tracklytics - Teste de Conexão SMTP',
        text: 'Sua conexão SMTP foi configurada com sucesso!',
        html: '<b>Sua conexão SMTP foi configurada com sucesso!</b>',
    });

    return { success: true, message: `Conexão bem-sucedida. E-mail de teste enviado para ${testEmail}.` };
  } catch (error: any) {
    console.error('Falha ao conectar ao SMTP:', error.message);
    if (error.code === 'ECONNREFUSED') {
        throw new Error('Conexão recusada. Verifique o host e a porta.');
    }
    if (error.code === 'EAUTH') {
        throw new Error('Falha na autenticação. Verifique o usuário e a senha.');
    }
    throw new Error('Falha na conexão SMTP. Verifique os detalhes e as configurações de segurança.');
  }
}
