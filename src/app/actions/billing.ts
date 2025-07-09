'use server';

import { z } from 'zod';

const CreateTransactionInputSchema = z.object({
  userName: z.string(),
  userEmail: z.string().email(),
  userCpf: z.string(),
  userPhone: z.string(),
  amountInCents: z.number().int().positive(),
  description: z.string(),
});

const CheckTransactionInputSchema = z.object({
  transactionId: z.string(),
});


export async function createPaymentTransaction(input: z.infer<typeof CreateTransactionInputSchema>) {
    console.error('createPaymentTransaction is temporarily disabled.');
    throw new Error('A funcionalidade de pagamento está temporariamente desativada.');
}

export async function checkPaymentStatus(input: z.infer<typeof CheckTransactionInputSchema>) {
    console.error('checkPaymentStatus is temporarily disabled.');
    throw new Error('A funcionalidade de pagamento está temporariamente desativada.');
}
