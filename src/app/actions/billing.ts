'use server';

import 'server-only';
import { getSettingsAction, saveSettingsAction } from './settings';
import { z } from 'zod';
import { getCurrentUser } from './auth';
import { getDbConnection } from '@/lib/db';

// Funções para o lado do cliente (usuário final)
export async function getBillingInfoAction() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("Usuário não autenticado.");
    }
    
    let connection;
    try {
        connection = await getDbConnection();
        const [rows] = await connection.execute(
            'SELECT plan_name, status, next_billing_date, plan_price FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
            [user.uid]
        );

        const subscription = (rows as any[])[0];

        if (subscription) {
            return {
                plan: subscription.plan_name,
                status: subscription.status === 'active' ? 'Ativa' : 'Inativa',
                nextBillingDate: subscription.next_billing_date,
                price: subscription.plan_price,
            };
        }
        
        // Fallback for users without a subscription entry (e.g. on free plan)
        const [userRow] = await connection.execute('SELECT plan FROM users WHERE id = ?', [user.uid]);
        const userPlan = (userRow as any[])[0]?.plan || 'free';
        
        return {
            plan: userPlan.charAt(0).toUpperCase() + userPlan.slice(1),
            status: 'Ativa',
            nextBillingDate: null,
            price: '0.00',
        };

    } catch (error: any) {
        console.error("Falha ao buscar informações de faturamento:", error);
        throw new Error("Não foi possível carregar as informações de faturamento.");
    } finally {
        if (connection) await connection.end();
    }
}

export async function getInvoicesAction() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("Usuário não autenticado.");
    }
     // Lógica para buscar faturas do usuário.
    return []; // Retornando array vazio por enquanto.
}


// Funções para o painel de administração
const billingSettingsSchema = z.object({
  billingEnabled: z.boolean(),
  paymentGatewayPublicKey: z.string().optional(),
  paymentGatewaySecretKey: z.string().optional(),
  freePlanFeatures: z.string(),
  proPlanPrice: z.string(),
  proPlanFeatures: z.string(),
});

export async function getBillingSettingsAction() {
    await getCurrentUser(); // Idealmente, verificar se é admin
    const keys = ['billingEnabled', 'paymentGatewayPublicKey', 'paymentGatewaySecretKey', 'freePlanFeatures', 'proPlanPrice', 'proPlanFeatures'];
    return getSettingsAction(keys);
}

export async function saveBillingSettingsAction(data: unknown) {
    await getCurrentUser(); // Idealmente, verificar se é admin
    
    const validation = billingSettingsSchema.safeParse(data);
    if (!validation.success) {
        throw new Error("Dados de faturamento inválidos.");
    }

    return saveSettingsAction(validation.data);
}
