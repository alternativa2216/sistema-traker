'use server';
import 'server-only';

import { getDbConnection } from '@/lib/db';
import { getCurrentUser } from './auth';

interface AnalyticsParams {
    projectId: string;
    range: 'today' | 'yesterday' | '7d' | '30d' | 'all' | string;
}

export interface AnalyticsData {
    summary: {
        visitors: number;
        sessions: number;
        bounceRate: number;
        sessionDuration: string;
    };
    timeSeries: { date: string; desktop: number; mobile: number }[];
    sources: { source: string; visitors: number }[];
    topPages: { path: string; visits: number }[];
    exitPages: { path: string; visits: number }[];
}

function getStartDate(range: string): Date {
    const now = new Date();
    switch (range) {
        case 'today':
            now.setHours(0, 0, 0, 0);
            return now;
        case 'yesterday':
            now.setDate(now.getDate() - 1);
            now.setHours(0, 0, 0, 0);
            return now;
        case '7d':
            now.setDate(now.getDate() - 7);
            return now;
        case '30d':
            now.setDate(now.getDate() - 30);
            return now;
        case 'all':
        default:
            return new Date(0); // The beginning of time
    }
}

function formatDuration(seconds: number) {
    if (isNaN(seconds) || seconds === 0) return '0m 0s';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${s}s`;
}

export async function getAnalyticsForProjectAction({ projectId, range }: AnalyticsParams): Promise<AnalyticsData> {
    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado.');

    let connection;
    try {
        connection = await getDbConnection();
        const [projectCheck] = await connection.execute('SELECT id FROM projects WHERE id = ? AND user_id = ?', [projectId, user.uid]);
        if ((projectCheck as any[]).length === 0) {
            throw new Error("Acesso negado ao projeto.");
        }

        const startDate = getStartDate(range);

        // Summary Metrics
        const [summaryRows]: [any[], any] = await connection.execute(
            `SELECT
                COUNT(DISTINCT session_id) as sessions,
                COUNT(*) as visits
             FROM analytics_visits WHERE project_id = ? AND created_at >= ?`,
            [projectId, startDate]
        );
        const { sessions, visits } = summaryRows[0];

        const [sessionDurations]: [any[], any] = await connection.execute(
            `SELECT session_id, TIMESTAMPDIFF(SECOND, MIN(created_at), MAX(created_at)) as duration
             FROM analytics_visits
             WHERE project_id = ? AND created_at >= ?
             GROUP BY session_id`,
            [projectId, startDate]
        );
        
        let singleVisitSessions = 0;
        if(sessionDurations.length > 0) {
            const [singleVisitRows]: [any[], any] = await connection.execute(
                `SELECT COUNT(*) as singleVisitCount FROM (
                    SELECT session_id
                    FROM analytics_visits
                    WHERE project_id = ? AND created_at >= ?
                    GROUP BY session_id
                    HAVING COUNT(*) = 1
                ) as single_visits`,
                [projectId, startDate]
            );
            singleVisitSessions = singleVisitRows[0].singleVisitCount;
        }

        const totalDuration = sessionDurations.reduce((acc: number, row: any) => acc + row.duration, 0);
        const avgDuration = sessions > 0 ? totalDuration / sessions : 0;
        const bounceRate = sessions > 0 ? (singleVisitSessions / sessions) * 100 : 0;
        
        // Time Series Data
        const [timeSeriesRows]: [any[], any] = await connection.execute(
            `SELECT
                DATE(created_at) as date,
                SUM(CASE WHEN device_type = 'desktop' THEN 1 ELSE 0 END) as desktop,
                SUM(CASE WHEN device_type != 'desktop' THEN 1 ELSE 0 END) as mobile
             FROM analytics_visits
             WHERE project_id = ? AND created_at >= ?
             GROUP BY DATE(created_at)
             ORDER BY date ASC`,
            [projectId, startDate]
        );

        // Top Sources
        const [sourceRows]: [any[], any] = await connection.execute(
            `SELECT
                CASE
                    WHEN referrer LIKE '%google.com%' THEN 'Google'
                    WHEN referrer LIKE '%facebook.com%' THEN 'Facebook'
                    WHEN referrer = '' OR referrer IS NULL THEN 'Direto'
                    ELSE 'Outros'
                END as source,
                COUNT(DISTINCT session_id) as visitors
             FROM analytics_visits
             WHERE project_id = ? AND created_at >= ?
             GROUP BY source
             ORDER BY visitors DESC`,
            [projectId, startDate]
        );
        
        // Top & Exit Pages
        const [topPagesRows]: [any[], any] = await connection.execute(
            `SELECT path, COUNT(*) as visits
             FROM analytics_visits
             WHERE project_id = ? AND created_at >= ?
             GROUP BY path ORDER BY visits DESC LIMIT 5`,
            [projectId, startDate]
        );

        const [exitPagesRows]: [any[], any] = await connection.execute(
            `WITH LastVisits AS (
                SELECT session_id, path, ROW_NUMBER() OVER(PARTITION BY session_id ORDER BY created_at DESC) as rn
                FROM analytics_visits
                WHERE project_id = ? AND created_at >= ?
            )
            SELECT path, COUNT(*) as visits
            FROM LastVisits
            WHERE rn = 1
            GROUP BY path
            ORDER BY visits DESC
            LIMIT 5;`,
            [projectId, startDate]
        );


        return {
            summary: {
                visitors: sessions,
                sessions: visits,
                bounceRate: bounceRate,
                sessionDuration: formatDuration(avgDuration),
            },
            timeSeries: timeSeriesRows.map(row => ({ ...row, date: new Date(row.date).toISOString() })),
            sources: sourceRows,
            topPages: topPagesRows,
            exitPages: exitPagesRows
        };
    } catch (error: any) {
        console.error("Falha ao buscar dados de analytics:", error);
        throw new Error("Não foi possível buscar os dados de analytics do projeto.");
    } finally {
        if (connection) await connection.end();
    }
}

export async function getRealTimeVisitorsAction(projectId: string): Promise<any[]> {
     const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado.');

    let connection;
    try {
        connection = await getDbConnection();
        const [projectCheck] = await connection.execute('SELECT id FROM projects WHERE id = ? AND user_id = ?', [projectId, user.uid]);
        if ((projectCheck as any[]).length === 0) {
            throw new Error("Acesso negado ao projeto.");
        }
        
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        
        const [rows]: [any[], any] = await connection.execute(
        `
        WITH LastVisits AS (
            SELECT 
                *,
                ROW_NUMBER() OVER(PARTITION BY session_id ORDER BY created_at DESC) as rn
            FROM analytics_visits
            WHERE project_id = ? AND created_at >= ?
        )
        SELECT 
            lv.id,
            SUBSTRING_INDEX(lv.session_id, '-', 1) as ip,
            c.name as country_name,
            c.code as country_code,
            c.emoji as country_flag,
            lv.device_type as device,
            lv.path as currentPage,
            COALESCE(NULLIF(lv.referrer, ''), 'Direct') as referrer,
            TIMESTAMPDIFF(SECOND, s.session_start, NOW()) as timeOnSite
        FROM LastVisits lv
        JOIN (
            SELECT session_id, MIN(created_at) as session_start
            FROM analytics_visits
            WHERE project_id = ? AND created_at >= ?
            GROUP BY session_id
        ) s ON lv.session_id = s.session_id
        LEFT JOIN countries c ON lv.country_code = c.code
        WHERE lv.rn = 1;
        `, [projectId, fiveMinutesAgo, projectId, fiveMinutesAgo]
        );

        return rows.map(row => ({
            id: row.id,
            ip: row.ip,
            country: {
                code: row.country_code,
                name: row.country_name,
                flag: row.country_flag
            },
            device: row.device,
            currentPage: row.currentPage,
            referrer: row.referrer,
            timeOnSite: row.timeOnSite
        }));

    } catch (error: any) {
        console.error("Falha ao buscar visitantes em tempo real:", error);
        throw new Error("Não foi possível buscar os visitantes em tempo real.");
    } finally {
        if (connection) await connection.end();
    }
}
