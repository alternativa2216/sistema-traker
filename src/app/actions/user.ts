'use server';

import 'server-only';
import { getDbConnection } from '@/lib/db';
import { z } from 'zod';
import { getCurrentUser } from './auth';
import bcrypt from 'bcryptjs';

export async function getCurrentUserAction() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('Usuário não autenticado.');
    }

    let connection;
    try {
        connection = await getDbConnection();
        const [rows] = await connection.execute('SELECT name, email, notification_settings, custom_alert FROM users WHERE id = ?', [user.uid]);
        
        const userFromDb = (rows as any[])[0];
        if (!userFromDb) {
            throw new Error('Usuário não encontrado no banco de dados.');
        }

        return {
            name: userFromDb.name,
            email: userFromDb.email,
            notificationSettings: userFromDb.notification_settings ? JSON.parse(userFromDb.notification_settings) : {},
            customAlert: userFromDb.custom_alert || null
        };

    } catch (error: any) {
        console.error("Falha ao buscar dados do usuário:", error);
        throw new Error("Não foi possível carregar os dados do perfil.");
    } finally {
        if (connection) await connection.end();
    }
}

const updateInfoSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  email: z.string().email("Por favor, insira um e-mail válido."),
});

export async function updateUserInfoAction(data: unknown) {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('Usuário não autenticado.');
    }

    const validation = updateInfoSchema.safeParse(data);
    if (!validation.success) {
        throw new Error(validation.error.errors.map(e => e.message).join(', '));
    }
    const { name, email } = validation.data;

    let connection;
    try {
        connection = await getDbConnection();
        await connection.execute(
            'UPDATE users SET name = ?, email = ? WHERE id = ?',
            [name, email, user.uid]
        );
        return { success: true };
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
          throw new Error("Este e-mail já está em uso por outro usuário.");
        }
        console.error("Falha ao atualizar informações do usuário:", error);
        throw new Error("Não foi possível salvar as informações.");
    } finally {
        if (connection) await connection.end();
    }
}

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória.'),
  newPassword: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres.'),
});

export async function updateUserPasswordAction(data: unknown) {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('Usuário não autenticado.');
    }

    const validation = passwordSchema.safeParse(data);
     if (!validation.success) {
        throw new Error(validation.error.errors.map(e => e.message).join(', '));
    }
    const { currentPassword, newPassword } = validation.data;

    let connection;
    try {
        connection = await getDbConnection();
        // 1. Verify current password
        const [rows] = await connection.execute('SELECT password FROM users WHERE id = ?', [user.uid]);
        const userFromDb = (rows as any[])[0];

        if (!userFromDb) {
             throw new Error('Usuário não encontrado.');
        }

        const passwordMatch = await bcrypt.compare(currentPassword, userFromDb.password);
        if (!passwordMatch) {
            throw new Error('A senha atual está incorreta.');
        }

        // 2. Update to new password
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
        await connection.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedNewPassword, user.uid]
        );
        return { success: true };
    } catch (error: any) {
        console.error("Falha ao alterar senha:", error);
        throw new Error(error.message || "Não foi possível alterar a senha.");
    } finally {
        if (connection) await connection.end();
    }
}

const notificationSettingsSchema = z.record(z.boolean());

export async function saveNotificationSettingsAction(data: unknown) {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('Usuário não autenticado.');
    }

    const validation = notificationSettingsSchema.safeParse(data);
     if (!validation.success) {
        throw new Error('Formato de configurações inválido.');
    }

    let connection;
    try {
        connection = await getDbConnection();
        const settingsJson = JSON.stringify(validation.data);
        await connection.execute(
            'UPDATE users SET notification_settings = ? WHERE id = ?',
            [settingsJson, user.uid]
        );
        return { success: true };
    } catch (error: any) {
        console.error("Falha ao salvar configurações de notificação:", error);
        throw new Error('Não foi possível salvar suas preferências.');
    } finally {
        if (connection) await connection.end();
    }
}

