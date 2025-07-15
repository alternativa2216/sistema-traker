// /src/app/api/track/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { UAParser } from 'ua-parser-js';

// Função para determinar o tipo de dispositivo a partir do User-Agent
function getDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
    const parser = new UAParser(userAgent);
    const device = parser.getDevice();
    if (device.type === 'mobile' || device.type === 'tablet') {
        return device.type;
    }
    const os = parser.getOS();
    if (['iOS', 'Android'].includes(os.name || '')) {
      return 'mobile';
    }
    return 'desktop';
}

const botUserAgents = [
    'facebookexternalhit',
    'facebot',
    'googlebot',
    'bingbot',
    'linkedinbot',
    'twitterbot',
    'ahrefsbot',
    'semrushbot',
];

async function logSecurityEvent(connection: any, projectId: string, ipAddress: string | null, countryCode: string | null, userAgent: string | null, reason: string) {
    await connection.execute(
        `INSERT INTO security_logs (project_id, ip_address, country_code, user_agent, reason, is_critical) VALUES (?, ?, ?, ?, ?, ?)`,
        [projectId, ipAddress, countryCode, userAgent, reason, false]
    );
}

// Função principal para o endpoint POST
export async function POST(request: NextRequest) {
    let connection;
    try {
        const body = await request.json();
        const { projectId, path, referrer, userAgent, screenWidth, screenHeight } = body;

        // Validação básica
        if (!projectId || !path) {
            return NextResponse.json({ message: 'projectId e path são obrigatórios' }, { 
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            });
        }

        const deviceType = getDeviceType(userAgent || '');
        const countryCode = request.headers.get('x-vercel-ip-country') || null;
        const ipAddress = request.headers.get('x-forwarded-for') || request.ip;
        const sessionId = `${ipAddress}-${userAgent}`;

        connection = await getDbConnection();

        // 1. Verificar regras de cloaker
        const [settingsRows] = await connection.execute('SELECT cloaker_config FROM project_settings WHERE project_id = ?', [projectId]);
        const settings = (settingsRows as any[])[0];

        if (settings && settings.cloaker_config) {
            const config = JSON.parse(settings.cloaker_config);
            
            // Lógica de redirecionamento por dispositivo
            if (config.redirectMobileEnabled && deviceType === 'mobile' && config.mobileRedirectUrl) {
                await logSecurityEvent(connection, projectId, ipAddress, countryCode, userAgent, 'Redirecionamento Mobile');
                return NextResponse.json({ redirectTo: config.mobileRedirectUrl }, { status: 200, headers: corsHeaders() });
            }
            if (config.redirectDesktopEnabled && deviceType === 'desktop' && config.desktopRedirectUrl) {
                await logSecurityEvent(connection, projectId, ipAddress, countryCode, userAgent, 'Redirecionamento Desktop');
                return NextResponse.json({ redirectTo: config.desktopRedirectUrl }, { status: 200, headers: corsHeaders() });
            }

            // Lógica de bot
            if (config.antiBotFilter) {
                const isBot = botUserAgents.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()));
                if (isBot) {
                    await logSecurityEvent(connection, projectId, ipAddress, countryCode, userAgent, 'Bot Detectado');
                    return NextResponse.json({ redirectTo: config.redirectOnInspectUrl || 'https://google.com' }, { status: 200, headers: corsHeaders() });
                }
            }
            // Adicionar mais lógicas de filtro aqui (geo, IP, etc.) conforme necessário
        }
        
        // 2. Se nenhuma regra de cloaker corresponder, registrar a visita
        await connection.execute(
            `INSERT INTO analytics_visits 
            (project_id, session_id, path, referrer, user_agent, country_code, device_type) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [projectId, sessionId, path, referrer || null, userAgent || null, countryCode, deviceType]
        );
        
        await connection.end();

        return NextResponse.json({ success: true }, { 
            status: 200,
            headers: corsHeaders()
        });

    } catch (error: any) {
        console.error('Erro na API de rastreamento:', error);
        if (connection) await connection.end();
        return NextResponse.json({ message: 'Erro interno do servidor', error: error.message }, { 
            status: 500,
            headers: corsHeaders()
        });
    }
}

// Handler para preflight (CORS)
export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };
}
