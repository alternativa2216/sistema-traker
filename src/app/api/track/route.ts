
// /src/app/api/track/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { UAParser } from 'ua-parser-js';

// Função para determinar o tipo de dispositivo a partir do User-Agent
function getDeviceType(userAgent: string): string {
    const parser = new UAParser(userAgent);
    const device = parser.getDevice();
    if (device.type) {
        return device.type; // 'mobile', 'tablet', 'smarttv', etc.
    }
    const os = parser.getOS();
    if (['iOS', 'Android'].includes(os.name || '')) {
      return 'mobile';
    }
    return 'desktop';
}

export async function POST(request: NextRequest) {
    let connection;
    try {
        const body = await request.json();
        
        const { projectId, path, referrer, userAgent } = body;

        // Validação básica dos dados recebidos
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
        
        // Obter informações de geolocalização do cabeçalho da Vercel/Netlify ou similar
        const countryCode = request.headers.get('x-vercel-ip-country') || null;
        const ipAddress = request.headers.get('x-forwarded-for') || request.ip;
        
        // Cria um ID de sessão simples (ex: IP + User Agent). Em uma aplicação real, seria algo mais robusto.
        const sessionId = `${ipAddress}-${userAgent}`;

        connection = await getDbConnection();
        
        // Insere a visita no banco de dados
        await connection.execute(
            `INSERT INTO analytics_visits 
            (project_id, session_id, path, referrer, user_agent, country_code, device_type) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                projectId,
                sessionId,
                path,
                referrer || null,
                userAgent || null,
                countryCode,
                deviceType,
            ]
        );
        
        await connection.end();

        return NextResponse.json({ success: true }, { 
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });

    } catch (error: any) {
        console.error('Erro na API de rastreamento:', error);
        if (connection) {
            await connection.end();
        }
        return NextResponse.json({ message: 'Erro interno do servidor', error: error.message }, { 
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }
}

// Handler para preflight (CORS) se o script for hospedado em um domínio diferente da API
export async function OPTIONS() {
    const response = new NextResponse(null, {
        status: 204
    });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
}
