'use server';

import { z } from 'zod';
import { getDbConnection } from '@/lib/db';

const CreateTransactionInputSchema = z.object({
  userName: z.string(),
  userEmail: z.string().email(),
  userCpf: z.string().length(11),
  userPhone: z.string(),
  amountInCents: z.number().int().positive(),
  description: z.string(),
});

const CheckTransactionInputSchema = z.object({
  transactionId: z.string(),
});

const NovaEraTransactionResponseSchema = z.object({
    id: z.string(),
    pix: z.object({
      qrcode: z.string(),
      qrcode_image: z.string().optional(),
    }),
});

const NovaEraStatusResponseSchema = z.object({
    data: z.object({
        status: z.string(),
    })
})

function getNovaEraAuth() {
    const publicKey = process.env.NOVAERA_PUBLIC_KEY;
    const secretKey = process.env.NOVAERA_SECRET_KEY;

    if (!publicKey || !secretKey) {
        throw new Error('As chaves de API da Nova Era não estão configuradas no ambiente.');
    }

    return Buffer.from(`${publicKey}:${secretKey}`).toString('base64');
}

export async function createPaymentTransaction(input: z.infer<typeof CreateTransactionInputSchema>) {
    const validation = CreateTransactionInputSchema.safeParse(input);
    if (!validation.success) {
        throw new Error('Dados de transação inválidos.');
    }

    const { userName, userEmail, userCpf, userPhone, amountInCents, description } = validation.data;
    const auth = getNovaEraAuth();

    try {
        const transactionPayload = {
            amount: amountInCents,
            paymentMethod: "pix",
            customer: {
                name: userName,
                email: userEmail,
                document: {
                    number: userCpf,
                    type: "cpf"
                },
                phone: userPhone,
                externalRef: `ref-${userCpf}`
            },
            pix: {
                expiresInDays: 1
            },
            items: [{
                title: description,
                unitPrice: amountInCents,
                quantity: 1,
                tangible: false
            }]
        };

        const response = await fetch('https://api.novaera-pagamentos.com/api/v1/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify(transactionPayload)
        });
        
        const responseBody = await response.text();
        let rawData;
        try {
            rawData = JSON.parse(responseBody);
        } catch (e) {
            console.error('A resposta da API não é um JSON válido:', response.status, responseBody);
            throw new Error(`Erro inesperado da API de pagamento. Status: ${response.status}`);
        }

        // Handle business logic errors returned by the API (even with a 200 OK status)
        if (rawData.errors && Array.isArray(rawData.errors) && rawData.errors.length > 0) {
            const errorMessage = rawData.errors[0]?.message || 'Erro desconhecido da API de pagamento.';
            console.error('Erro de negócio retornado pela API Nova Era:', errorMessage, rawData.errors);
            throw new Error(errorMessage);
        }

        // Handle non-OK HTTP statuses that were not caught above
        if (!response.ok) {
            console.error('Erro HTTP da API Nova Era:', response.status, rawData);
            throw new Error(`Falha ao criar transação PIX. Status: ${response.status}`);
        }

        // If we get here, the response is OK and doesn't contain a business logic error.
        // Now, we can safely validate the expected success structure.
        const validationResult = NovaEraTransactionResponseSchema.safeParse(rawData.data);

        if (!validationResult.success) {
            console.error('Falha na validação da resposta da Nova Era:', validationResult.error.flatten());
            console.error('Resposta bruta recebida:', JSON.stringify(rawData, null, 2));
            throw new Error('A resposta da API de pagamento está em um formato inesperado.');
        }

        const transactionData = validationResult.data;

        // Salvar a transação no banco de dados (descomente quando estiver pronto)
        // const connection = await getDbConnection();
        // await connection.execute(
        //     'INSERT INTO transactions (transaction_id, user_cpf, user_name, user_email, amount, pix_code, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        //     [transactionData.id, userCpf, userName, userEmail, amountInCents / 100, transactionData.pix.qrcode, 'pending']
        // );
        // await connection.end();

        return {
            transactionId: transactionData.id,
            pixCode: transactionData.pix.qrcode,
            pixQrCodeImage: transactionData.pix.qrcode_image || ''
        };

    } catch (error: any) {
        console.error('Erro ao criar transação PIX:', error);
        // Re-throw the original error message from the API or our custom messages
        throw new Error(error.message || 'Não foi possível gerar o pagamento PIX. Tente novamente mais tarde.');
    }
}

export async function checkPaymentStatus(input: z.infer<typeof CheckTransactionInputSchema>) {
    const validation = CheckTransactionInputSchema.safeParse(input);
    if (!validation.success) {
        throw new Error('ID da transação inválido.');
    }
    const { transactionId } = validation.data;
    const auth = getNovaEraAuth();
    
    try {
        const response = await fetch(`https://api.novaera-pagamentos.com/api/v1/transactions/${transactionId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Falha ao verificar status do pagamento. Status: ${response.status}`);
        }

        const rawData = await response.json();
        const statusData = NovaEraStatusResponseSchema.parse(rawData);
        const status = statusData.data.status;

        if (status === 'paid') {
            // Atualizar status no banco de dados (descomente quando estiver pronto)
            // const connection = await getDbConnection();
            // await connection.execute(
            //     "UPDATE transactions SET status = 'paid', paid_at = NOW() WHERE transaction_id = ?",
            //     [transactionId]
            // );
            // await connection.end();
        }

        return { status };

    } catch (error) {
        console.error('Erro ao verificar status do pagamento:', error);
        throw new Error('Não foi possível verificar o status do pagamento.');
    }
}
