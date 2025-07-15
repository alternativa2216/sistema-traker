'use client'

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Clock, Cpu, Database, Server, AlertCircle, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { getSystemHealthAction } from '@/app/actions/admin';
import { useToast } from '@/hooks/use-toast';

type HealthStatus = {
  api: { status: 'Operacional' | 'Indisponível', responseTime: number };
  database: { status: 'Conectado' | 'Não Conectado', latency: number };
  ai_services: { status: 'Operacional' | 'Não Configurado' | 'Indisponível', latency: number };
  background_jobs: { status: 'Ocioso' | 'Ocupado', queue: number };
};

export default function AdminHealthPage() {
  const [status, setStatus] = React.useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchHealth = async () => {
      try {
        const healthData = await getSystemHealthAction();
        // @ts-ignore
        setStatus(healthData);
      } catch (error: any) {
        toast({ title: "Erro ao buscar saúde do sistema", description: error.message, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchHealth();
  }, [toast]);

  if (isLoading || !status) {
    return <div className="flex h-64 w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  const StatusBadge = ({ condition, text }: { condition: boolean, text: { ok: string, bad: string }}) => (
    <Badge variant={condition ? "secondary" : "destructive"} className={`gap-1.5 mb-2 ${condition ? 'text-green-400' : ''}`}>
      {condition ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
      {condition ? text.ok : text.bad}
    </Badge>
  );

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
                <StatusBadge condition={status.api.status === 'Operacional'} text={{ ok: 'Operacional', bad: 'Indisponível'}} />
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
                <StatusBadge condition={status.database.status === 'Conectado'} text={{ ok: 'Conectado', bad: 'Não Conectado'}} />
                <p className="text-2xl font-bold">{status.database.latency} ms</p>
                <p className="text-xs text-muted-foreground">Latência da consulta</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Serviços de IA</CardTitle>
                <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                 <StatusBadge condition={status.ai_services.status === 'Operacional'} text={{ ok: 'Operacional', bad: status.ai_services.status }} />
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
                 <StatusBadge condition={status.background_jobs.status === 'Ocioso'} text={{ ok: 'Ocioso', bad: 'Ocupado' }} />
                <p className="text-2xl font-bold">{status.background_jobs.queue}</p>
                <p className="text-xs text-muted-foreground">Trabalhos na fila (simulado)</p>
            </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Latência da API (Últimos 5 minutos)</CardTitle>
          <CardDescription>Esta funcionalidade ainda não está implementada.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <p>Nenhum dado de latência disponível.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
