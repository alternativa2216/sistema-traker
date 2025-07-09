'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Clock, Cpu, Database, Server } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";

const status = {
    api: { status: 'Operacional', responseTime: 52 },
    database: { status: 'Operacional', connections: 25, latency: 12 },
    ai_services: { status: 'Operacional', latency: 150 },
    background_jobs: { status: 'Operacional', queue: 0 },
}

const responseTimeData = [
  { time: '15:00', ms: 45 },
  { time: '15:01', ms: 50 },
  { time: '15:02', ms: 55 },
  { time: '15:03', ms: 48 },
  { time: '15:04', ms: 60 },
  { time: '15:05', ms: 52 },
];


export default function AdminHealthPage() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Saúde do Sistema</h1>
        <p className="text-muted-foreground">Monitore os indicadores vitais da plataforma em tempo real.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Principal</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <Badge variant="secondary" className="text-green-400 gap-1.5 mb-2"><CheckCircle className="h-3 w-3" /> {status.api.status}</Badge>
                <p className="text-2xl font-bold">{status.api.responseTime}ms</p>
                <p className="text-xs text-muted-foreground">Tempo de resposta médio</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Banco de Dados</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <Badge variant="secondary" className="text-green-400 gap-1.5 mb-2"><CheckCircle className="h-3 w-3" /> {status.database.status}</Badge>
                <p className="text-2xl font-bold">{status.database.connections} / 100</p>
                <p className="text-xs text-muted-foreground">Conexões ativas</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Serviços de IA</CardTitle>
                <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <Badge variant="secondary" className="text-green-400 gap-1.5 mb-2"><CheckCircle className="h-3 w-3" /> {status.ai_services.status}</Badge>
                <p className="text-2xl font-bold">{status.ai_services.latency}ms</p>
                <p className="text-xs text-muted-foreground">Latência da API Gemini</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fila de Processamento</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                 <Badge variant="secondary" className="text-green-400 gap-1.5 mb-2"><CheckCircle className="h-3 w-3" /> {status.background_jobs.status}</Badge>
                <p className="text-2xl font-bold">{status.background_jobs.queue}</p>
                <p className="text-xs text-muted-foreground">Trabalhos na fila</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Latência da API (Últimos 5 minutos)</CardTitle>
          <CardDescription>Tempo de resposta do endpoint principal da API em milissegundos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis unit="ms" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                    <Line type="monotone" dataKey="ms" stroke="hsl(var(--primary))" strokeWidth={2} dot={{r: 4}} />
                </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
