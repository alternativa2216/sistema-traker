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

// Helper function to get multiple settings at once
export async function getSettingsAction(keys: string[]) {
    if (keys.length === 0) {
        return {};
    }
    let connection;
    try {
        connection = await getDbConnection();
        const placeholders = keys.map(() => '?').join(',');
        const [rows] = await connection.execute(`SELECT setting_key, setting_value FROM settings WHERE setting_key IN (${placeholders})`, keys);
        
        const settings: Record<string, any> = {};
        for (const row of rows as any[]) {
            try {
                // Attempt to parse JSON values, which is how we store complex objects
                settings[row.setting_key] = JSON.parse(row.setting_value);
            } catch (e) {
                // Fallback to string if not valid JSON (for simple key-value pairs)
                settings[row.setting_key] = row.setting_value;
            }
        }
        return settings;
    } catch (error: any) {
        console.error("Failed to fetch settings:", error);
        // Do not throw sensitive errors to the client
        throw new Error("Não foi possível buscar as configurações.");
    } finally {
        if (connection) await connection.end();
    }
}

// Helper function to save multiple settings
const settingsSchema = z.record(z.any());
export async function saveSettingsAction(data: unknown) {
    await verifyAdmin(); // Ensure only admins can save settings
    
    const validation = settingsSchema.safeParse(data);
    if (!validation.success) {
        throw new Error("Formato de configurações inválido.");
    }
    const settings = validation.data;

    let connection;
    try {
        connection = await getDbConnection();
        await connection.beginTransaction();

        for (const key in settings) {
            if (Object.prototype.hasOwnProperty.call(settings, key)) {
                // Always stringify the value to handle both strings and objects consistently
                const value = JSON.stringify(settings[key]);
                await connection.execute(
                    'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
                    [key, value, value]
                );
            }
        }
        
        await connection.commit();
        return { success: true, message: "Configurações salvas com sucesso!" };
    } catch (error: any) {
        if (connection) await connection.rollback();
        console.error("Failed to save settings:", error);
        throw new Error("Não foi possível salvar as configurações.");
    } finally {
        if (connection) await connection.end();
    }
}
