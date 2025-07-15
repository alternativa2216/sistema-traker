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
        const [totalProjectsRows] = await connection.execute('SELECT COUNT(*) as totalProjects FROM projects');
        const [totalSubscriptionsRows] = await connection.execute("SELECT COUNT(*) as totalSubscriptions FROM subscriptions WHERE status = 'active'");
        const [mrrRows] = await connection.execute("SELECT SUM(REPLACE(s.plan_price, ',', '.')) as mrr FROM subscriptions s JOIN users u ON s.user_id = u.id WHERE s.status = 'active'");

        const totalUsers = (totalUsersRows as any[])[0].totalUsers || 0;
        const totalProjects = (totalProjectsRows as any[])[0].totalProjects || 0;
        const activeSubscribers = (totalSubscriptionsRows as any[])[0].totalSubscriptions || 0;
        const mrr = (mrrRows as any[])[0].mrr || 0;
        
        const [recentUsersRows] = await connection.execute('SELECT name, email, created_at FROM users ORDER BY created_at DESC LIMIT 5');
        const [recentProjectsRows] = await connection.execute(`
            SELECT p.name, u.name as user_name, p.created_at 
            FROM projects p 
            JOIN users u ON p.user_id = u.id 
            ORDER BY p.created_at DESC 
            LIMIT 5
        `);
        
        // Mocked data as these tables aren't populated yet by a real service
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
            recentUsers: recentUsersRows as any[],
            recentProjects: recentProjectsRows as any[],
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
            LIMIT 100
        `);
        return rows as any[];
    } catch (error: any) {
        console.error("Falha ao buscar notificações enviadas:", error);
        throw new Error("Não foi possível buscar as notificações.");
    } finally {
        if (connection) await connection.end();
    }
}


export async function deleteNotificationAction(id: number) {
    await verifyAdmin();
    let connection;
    try {
        connection = await getDbConnection();
        await connection.execute('DELETE FROM notifications WHERE id = ?', [id]);
        return { success: true, message: "Notificação excluída com sucesso." };
    } catch (error: any) {
        console.error("Falha ao excluir notificação:", error);
        throw new Error("Não foi possível excluir a notificação.");
    } finally {
        if (connection) await connection.end();
    }
}


export async function getSystemHealthAction() {
  await verifyAdmin();
  let connection;

  // API Check (simple, just measures response time of this action)
  const apiStart = Date.now();

  // Database Check
  let dbLatency = 0;
  let dbStatus: 'Conectado' | 'Não Conectado' = 'Não Conectado';
  try {
    connection = await getDbConnection();
    const start = Date.now();
    await connection.ping();
    dbLatency = Date.now() - start;
    dbStatus = 'Conectado';
  } catch (e) {
    // Error is handled, status will remain 'Not Connected'
  } finally {
    if (connection) await connection.end();
  }

  // AI Services Check
  let aiLatency = 0;
  let aiStatus: 'Operacional' | 'Não Configurado' | 'Indisponível' = 'Não Configurado';
  if (process.env.GOOGLE_API_KEY) {
      try {
        const start = Date.now();
        // A simple, fast AI call to test connectivity
        const { ai } = await import('@/ai/genkit');
        await ai.generate({
            model: 'googleai/gemini-pro',
            prompt: 'teste',
            config: { temperature: 0 }
        });
        aiLatency = Date.now() - start;
        aiStatus = 'Operacional';
      } catch (e) {
        aiStatus = 'Indisponível';
      }
  }

  // Final API response time
  const apiResponseTime = Date.now() - apiStart;

  return {
    api: { status: 'Operacional', responseTime: apiResponseTime },
    database: { status: dbStatus, latency: dbLatency },
    ai_services: { status: aiStatus, latency: aiLatency },
    background_jobs: { status: 'Ocioso', queue: 0 }, // Mocked
  };
}


export async function getAllSubscriptionsAction() {
    await verifyAdmin();
    let connection;
    try {
        connection = await getDbConnection();
        const [rows] = await connection.execute(`
            SELECT 
                s.id,
                u.name as user_name,
                u.email as user_email,
                s.plan_name,
                s.status,
                s.plan_price,
                s.next_billing_date
            FROM subscriptions s
            JOIN users u ON s.user_id = u.id
            ORDER BY s.created_at DESC
        `);
        return rows as any[];
    } catch (error: any) {
        console.error("Falha ao buscar assinaturas:", error);
        throw new Error("Não foi possível buscar as assinaturas.");
    } finally {
        if (connection) await connection.end();
    }
}