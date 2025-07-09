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

export async function getProjectByIdAction(id: string) {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('Usuário não autenticado.');
    }

    let connection;
    try {
        connection = await getDbConnection();
        const [rows] = await connection.execute(
            'SELECT id, name, url, fb_pixel_id FROM projects WHERE id = ? AND user_id = ?',
            [id, user.uid]
        );
        const projects = rows as { id: string; name: string; url: string, fb_pixel_id: string }[];
        if (projects.length === 0) {
            throw new Error('Projeto não encontrado ou acesso negado.');
        }
        return projects[0];
    } catch (error: any) {
        console.error('Falha ao buscar projeto por ID:', error);
        throw new Error('Não foi possível buscar os detalhes do projeto.');
    } finally {
        if (connection) await connection.end();
    }
}

const updateSiteSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'O nome do site é obrigatório.'),
  url: z.string().url('A URL do site é inválida.'),
  fbPixelId: z.string().optional(),
});

export async function updateProjectAction(data: unknown) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Usuário não autenticado.');

  const validation = updateSiteSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(validation.error.errors.map(e => e.message).join(', '));
  }
  const { id, name, url, fbPixelId } = validation.data;

  let connection;
  try {
    connection = await getDbConnection();
    await connection.execute(
      'UPDATE projects SET name = ?, url = ?, fb_pixel_id = ? WHERE id = ? AND user_id = ?',
      [name, url, fbPixelId || null, id, user.uid]
    );
    return { success: true, message: "Projeto atualizado com sucesso!" };
  } catch (error: any) {
    console.error('Falha ao atualizar projeto:', error);
    throw new Error('Não foi possível atualizar o projeto.');
  } finally {
    if (connection) await connection.end();
  }
}


export async function deleteProjectAction(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Usuário não autenticado.');

  let connection;
  try {
    connection = await getDbConnection();
    await connection.execute('DELETE FROM projects WHERE id = ? AND user_id = ?', [id, user.uid]);
    return { success: true, message: 'Projeto excluído com sucesso.' };
  } catch (error: any) {
    console.error('Falha ao excluir projeto:', error);
    throw new Error('Não foi possível excluir o projeto.');
  } finally {
    if (connection) await connection.end();
  }
}

export async function getFunnelStepsAction(projectId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado.');

    let connection;
    try {
        connection = await getDbConnection();
        // Check if user owns the project
        const [projectRows] = await connection.execute('SELECT id FROM projects WHERE id = ? AND user_id = ?', [projectId, user.uid]);
        if ((projectRows as any[]).length === 0) throw new Error('Acesso negado.');

        const [steps] = await connection.execute(
            'SELECT id, name, url_path as url, step_order FROM funnel_steps WHERE project_id = ? ORDER BY step_order ASC',
            [projectId]
        );
        return steps as any[];
    } catch (error: any) {
        console.error('Falha ao buscar etapas do funil:', error);
        throw new Error('Não foi possível buscar as etapas do funil.');
    } finally {
        if (connection) await connection.end();
    }
}

const funnelStepSchema = z.object({
  name: z.string().min(1, "O nome da etapa é obrigatório."),
  url: z.string().min(1, "A URL da etapa é obrigatória."),
});

const saveFunnelSchema = z.object({
    projectId: z.string(),
    steps: z.array(funnelStepSchema)
});

export async function saveFunnelStepsAction(data: { projectId: string, steps: any[]}) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado.');

    const validation = saveFunnelSchema.safeParse(data);
    if (!validation.success) {
        throw new Error(validation.error.errors.map(e => e.message).join(', '));
    }
    const { projectId, steps } = validation.data;
    
    let connection;
    try {
        connection = await getDbConnection();
        await connection.beginTransaction();

        // Check ownership
        const [projectRows] = await connection.execute('SELECT id FROM projects WHERE id = ? AND user_id = ?', [projectId, user.uid]);
        if ((projectRows as any[]).length === 0) throw new Error('Acesso negado.');
        
        // Delete old steps
        await connection.execute('DELETE FROM funnel_steps WHERE project_id = ?', [projectId]);

        // Insert new steps
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            await connection.execute(
                'INSERT INTO funnel_steps (project_id, name, url_path, step_order) VALUES (?, ?, ?, ?)',
                [projectId, step.name, step.url, i + 1]
            );
        }

        await connection.commit();
        return { success: true, message: 'Funil salvo com sucesso!' };
    } catch (error: any) {
        if (connection) await connection.rollback();
        console.error('Falha ao salvar o funil:', error);
        throw new Error('Não foi possível salvar as alterações do funil.');
    } finally {
        if (connection) await connection.end();
    }
}
