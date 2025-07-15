'use server';
import 'server-only';

import { getSettingsAction, saveSettingsAction } from './settings';
import { z } from 'zod';
import { getCurrentUser } from './auth';

// Funções para o lado do cliente (usuário final)
export async function getBillingInfoAction() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("Usuário não autenticado.");
    }
    // Lógica para buscar o status da assinatura do usuário no banco de dados.
    // Retornando dados mockados por enquanto.
    return {
        plan: 'Grátis', // ou 'Pro'
        status: 'Ativa',
        nextBillingDate: null,
        // ... outras informações
    };
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
