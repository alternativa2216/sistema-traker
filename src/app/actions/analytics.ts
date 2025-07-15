
'use server';

import 'server-only';
import { getDbConnection } from '@/lib/db';
import { getCurrentUser } from './auth';
import { startOfDay, subDays, endOfDay } from 'date-fns';

interface AnalyticsParams {
    projectId: string;
    range: 'today' | 'yesterday' | '7d' | '30d' | 'all';
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

function getStartAndEndDates(range: 'today' | 'yesterday' | '7d' | '30d' | 'all'): { startDate: Date; endDate: Date } {
    const now = new Date();
    let startDate: Date;
    const endDate = endOfDay(now);

    switch (range) {
        case 'today':
            startDate = startOfDay(now);
            break;
        case 'yesterday':
            const yesterday = subDays(now, 1);
            startDate = startOfDay(yesterday);
            break;
        case '7d':
            startDate = startOfDay(subDays(now, 6)); // Including today
            break;
        case '30d':
            startDate = startOfDay(subDays(now, 29)); // Including today
            break;
        case 'all':
        default:
            startDate = new Date(0); // The beginning of time
            break;
    }
    return { startDate, endDate };
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

        const { startDate, endDate } = getStartAndEndDates(range);
        
        let dateFilter = range !== 'all' ? 'created_at >= ? AND created_at <= ?' : '1=1';
        const params: (string|Date)[] = [projectId];
        if (range !== 'all') {
            params.push(startDate, endDate);
        }
        
        const executeParams = (query: string) => {
             let qParams: (string|Date)[] = [projectId];
            if (range !== 'all') {
                qParams.push(startDate, endDate);
            }
            return connection!.execute(query, qParams);
        }

        // Summary Metrics
        const [summaryRows]: [any[], any] = await executeParams(
            `SELECT
                COUNT(DISTINCT session_id) as sessions
             FROM analytics_visits WHERE project_id = ? AND ${dateFilter}`
        );
        const sessions = summaryRows[0].sessions || 0;

        const [totalVisitsRows]: [any[], any] = await executeParams(
            `SELECT COUNT(*) as visits FROM analytics_visits WHERE project_id = ? AND ${dateFilter}`
        );
        const visits = totalVisitsRows[0].visits || 0;

        let bounceRate = 0;
        if (sessions > 0) {
            const [bouncedSessionsRows]: [any[], any] = await executeParams(
                `SELECT COUNT(*) as bouncedCount FROM (
                    SELECT session_id FROM analytics_visits
                    WHERE project_id = ? AND ${dateFilter}
                    GROUP BY session_id
                    HAVING COUNT(*) = 1
                ) as single_page_sessions`
            );
            const bouncedSessions = bouncedSessionsRows[0].bouncedCount || 0;
            bounceRate = (bouncedSessions / sessions) * 100;
        }

        const [sessionDurations]: [any[], any] = await executeParams(
            `SELECT AVG(duration) as avg_duration FROM (
                SELECT TIMESTAMPDIFF(SECOND, MIN(created_at), MAX(created_at)) as duration
                FROM analytics_visits
                WHERE project_id = ? AND ${dateFilter}
                GROUP BY session_id
                HAVING COUNT(*) > 1
             ) as durations`
        );

        const avgDuration = sessionDurations[0].avg_duration || 0;
        
        // Time Series Data
        const [timeSeriesRows]: [any[], any] = await executeParams(
            `SELECT
                DATE(created_at) as date,
                SUM(CASE WHEN device_type = 'desktop' THEN 1 ELSE 0 END) as desktop,
                SUM(CASE WHEN device_type != 'desktop' THEN 1 ELSE 0 END) as mobile
             FROM analytics_visits
             WHERE project_id = ? AND ${dateFilter}
             GROUP BY DATE(created_at)
             ORDER BY date ASC`
        );

        // Top Sources
        const [sourceRows]: [any[], any] = await executeParams(
            `SELECT
                CASE
                    WHEN referrer LIKE '%google.com%' THEN 'Google'
                    WHEN referrer LIKE '%facebook.com%' THEN 'Facebook'
                    WHEN referrer = '' OR referrer IS NULL THEN 'Direto'
                    ELSE 'Outros'
                END as source,
                COUNT(DISTINCT session_id) as visitors
             FROM analytics_visits
             WHERE project_id = ? AND ${dateFilter}
             GROUP BY source
             ORDER BY visitors DESC`
        );
        
        // Top & Exit Pages
        const [topPagesRows]: [any[], any] = await executeParams(
            `SELECT path, COUNT(*) as visits
             FROM analytics_visits
             WHERE project_id = ? AND ${dateFilter}
             GROUP BY path ORDER BY visits DESC LIMIT 5`
        );

        const [exitPagesRows]: [any[], any] = await executeParams(
            `WITH LastVisits AS (
                SELECT session_id, path, ROW_NUMBER() OVER(PARTITION BY session_id ORDER BY created_at DESC) as rn
                FROM analytics_visits
                WHERE project_id = ? AND ${dateFilter}
            )
            SELECT path, COUNT(*) as visits
            FROM LastVisits
            WHERE rn = 1
            GROUP BY path
            ORDER BY visits DESC
            LIMIT 5;`
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
                session_id,
                MAX(created_at) as last_seen
            FROM analytics_visits
            WHERE project_id = ? AND created_at >= ?
            GROUP BY session_id
        )
        SELECT 
            v.id,
            SUBSTRING_INDEX(v.session_id, '-', 1) as ip,
            c.name as country_name,
            c.code as country_code,
            c.emoji as country_flag,
            v.device_type as device,
            v.path as currentPage,
            CASE
                WHEN v.referrer IS NULL OR v.referrer = '' THEN 'Direct'
                ELSE v.referrer
            END as referrer,
            TIMESTAMPDIFF(SECOND, s.session_start, NOW()) as timeOnSite
        FROM analytics_visits v
        JOIN LastVisits lv ON v.session_id = lv.session_id AND v.created_at = lv.last_seen
        JOIN (
            SELECT session_id, MIN(created_at) as session_start
            FROM analytics_visits
            WHERE project_id = ?
            GROUP BY session_id
        ) s ON v.session_id = s.session_id
        LEFT JOIN countries c ON v.country_code = c.code
        `, [projectId, fiveMinutesAgo, projectId]
        );

        return rows.map(row => ({
            id: row.id,
            ip: row.ip,
            country: {
                code: row.country_code || '??',
                name: row.country_name || 'Desconhecido',
                flag: row.country_flag || '🌎'
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
