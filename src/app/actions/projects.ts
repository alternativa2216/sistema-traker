'use server';

import { getDbConnection } from '@/lib/db';
import { getCurrentUser } from './auth';
import { z } from 'zod';
import { randomUUID } from 'crypto';

const addSiteSchema = z.object({
  name: z.string().min(1, 'O nome do site é obrigatório.'),
  url: z.string().url('A URL do site é inválida.'),
});

export async function addProjectAction(formData: { name: string; url:string; }) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Usuário não autenticado.');
  }

  const validation = addSiteSchema.safeParse(formData);
  if (!validation.success) {
    throw new Error(validation.error.errors.map((e) => e.message).join(', '));
  }

  const { name, url } = validation.data;
  const projectId = randomUUID();

  let connection;
  try {
    connection = await getDbConnection();
    await connection.execute(
      'INSERT INTO projects (id, user_id, name, url) VALUES (?, ?, ?, ?)',
      [projectId, user.uid, name, url]
    );
    return { success: true, project: { id: projectId, name, url } };
  } catch (error: any) {
    console.error('Falha ao criar projeto:', error);
    throw new Error('Não foi possível adicionar o site ao banco de dados.');
  } finally {
    if (connection) await connection.end();
  }
}

export async function getProjectsAction() {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  let connection;
  try {
    connection = await getDbConnection();
    const [rows] = await connection.execute(
      'SELECT id, name, url FROM projects WHERE user_id = ? ORDER BY created_at DESC',
      [user.uid]
    );
    return rows as { id: string; name: string; url: string; }[];
  } catch (error) {
    console.error('Falha ao buscar projetos:', error);
    return [];
  } finally {
    if (connection) await connection.end();
  }
}
