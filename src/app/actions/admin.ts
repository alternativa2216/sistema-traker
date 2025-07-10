
'use server';
import 'server-only';

import { getDbConnection } from '@/lib/db';
import { z } from 'zod';
import { getCurrentUser } from './auth';

async function verifyAdmin() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('Usuário não autenticado.');
    }
    // Em um app real, você checaria a role do usuário no banco.
    // if (user.role !== 'admin') throw new Error('Acesso negado.');
    return user;
}


export async function getUsersAction() {
    await verifyAdmin();
    let connection;
    try {
        connection = await getDbConnection();
        const [rows] = await connection.execute('SELECT id, name, email, plan, created_at, custom_alert FROM users ORDER BY created_at DESC');
        return rows as any[];
    } catch (error: any) {
        console.error("Falha ao buscar usuários:", error);
        throw new Error("Não foi possível buscar os usuários.");
    } finally {
        if (connection) await connection.end();
    }
}

const updateUserSchema = z.object({
  id: z.string(),
  plan: z.string(),
  customAlert: z.string().optional(),
});

export async function updateUserAction(data: unknown) {
    await verifyAdmin();
    const validation = updateUserSchema.safeParse(data);
    if (!validation.success) {
        throw new Error(validation.error.errors.map(e => e.message).join(', '));
    }
    const { id, plan, customAlert } = validation.data;

    let connection;
    try {
        connection = await getDbConnection();
        await connection.execute(
            'UPDATE users SET plan = ?, custom_alert = ? WHERE id = ?',
            [plan, customAlert || '', id]
        );
        return { success: true, message: 'Usuário atualizado com sucesso!' };
    } catch (error: any) {
        console.error("Falha ao atualizar usuário:", error);
        throw new Error("Não foi possível atualizar o usuário.");
    } finally {
        if (connection) await connection.end();
    }
}


export async function getAllProjectsAction() {
    await verifyAdmin();
    let connection;
    try {
        connection = await getDbConnection();
        const [rows] = await connection.execute(`
            SELECT p.id, p.name, p.url, p.created_at, u.name as user_name, u.email as user_email
            FROM projects p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
        `);
        return rows as any[];
    } catch (error: any) {
        console.error("Falha ao buscar todos os projetos:", error);
        throw new Error("Não foi possível buscar os projetos.");
    } finally {
        if (connection) await connection.end();
    }
}

export async function getAdminDashboardStatsAction() {
    await verifyAdmin();
    let connection;
    try {
        connection = await getDbConnection();
        
        const [totalUsersRows] = await connection.execute('SELECT COUNT(*) as totalUsers FROM users');
        const totalUsers = (totalUsersRows as any[])[0].totalUsers;

        const [totalProjectsRows] = await connection.execute('SELECT COUNT(*) as totalProjects FROM projects');
        const totalProjects = (totalProjectsRows as any[])[0].totalProjects;

        const [recentUsers] = await connection.execute('SELECT name, email, created_at FROM users ORDER BY created_at DESC LIMIT 5');
        const [recentProjects] = await connection.execute(`
            SELECT p.name, u.name as user_name, p.created_at 
            FROM projects p 
            JOIN users u ON p.user_id = u.id 
            ORDER BY p.created_at DESC 
            LIMIT 5
        `);
        
        // Mocked data as these tables aren't populated yet by a real service
        const mrr = 0;
        const activeSubscribers = 0;
        const newTrials = 0;
        const churnRate = 0;
        const topProjects: any[] = [];
        const avgVisits = 0;

        return {
            mrr,
            activeSubscribers,
            newTrials,
            churnRate,
            totalUsers,
            totalProjects,
            recentUsers,
            recentProjects,
            topProjects,
            avgVisits
        };

    } catch (error: any) {
        console.error("Falha ao buscar estatísticas do admin:", error);
        throw new Error("Não foi possível buscar as estatísticas do painel.");
    } finally {
        if (connection) await connection.end();
    }
}

const sendNotificationSchema = z.object({
    target: z.string(), // 'all' or specific user email
    specificUser: z.string().optional(),
    notificationType: z.string(),
    message: z.string().min(1, "A mensagem não pode estar vazia."),
});

export async function sendNotificationAction(data: unknown) {
    await verifyAdmin();
    const validation = sendNotificationSchema.safeParse(data);
    if (!validation.success) {
        throw new Error(validation.error.errors.map(e => e.message).join(', '));
    }
    const { target, specificUser, notificationType, message } = validation.data;
    
    let connection;
    try {
        connection = await getDbConnection();
        if (target === 'all') {
            const [users] = await connection.execute('SELECT id FROM users');
            for (const user of users as any[]) {
                 await connection.execute(
                    'INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)',
                    [user.id, notificationType, message]
                );
            }
        } else if (target === 'specific' && specificUser) {
            const [rows] = await connection.execute('SELECT id FROM users WHERE email = ?', [specificUser]);
            const user = (rows as any[])[0];
            if (!user) {
                throw new Error("Usuário específico não encontrado.");
            }
            await connection.execute(
                'INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)',
                [user.id, notificationType, message]
            );
        } else {
             throw new Error("Destinatário da notificação inválido.");
        }
        return { success: true, message: 'Notificação enviada com sucesso!' };
    } catch (error: any) {
        console.error("Falha ao enviar notificação:", error);
        throw new Error(error.message || "Não foi possível enviar a notificação.");
    } finally {
        if (connection) await connection.end();
    }
}

export async function getSentNotificationsAction() {
    await verifyAdmin();
    let connection;
    try {
        connection = await getDbConnection();
        // This is a simplified view. A real implementation might be more complex.
        const [rows] = await connection.execute(`
            SELECT n.id, n.message, n.type, n.created_at, u.email as target
            FROM notifications n
            JOIN users u ON n.user_id = u.id
            ORDER BY n.created_at DESC
            LIMIT 10
        `);
        return rows as any[];
    } catch (error: any) {
        console.error("Falha ao buscar notificações enviadas:", error);
        throw new Error("Não foi possível buscar as notificações.");
    } finally {
        if (connection) await connection.end();
    }
}
