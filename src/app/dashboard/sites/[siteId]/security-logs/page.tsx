'use client'

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ShieldAlert, Fingerprint, Globe, ServerOff, Loader2 } from "lucide-react";
import * as React from 'react';
import { getSecurityLogsForProjectAction } from "@/app/actions/projects";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";

// In a real app, this data would be fetched from the database
const reasonToIconMap: { [key: string]: React.ElementType } = {
  'Bot de SEO': Fingerprint,
  'Tentativa de Invasão': ShieldAlert,
  'Filtro de IP': ServerOff,
  'Filtro Geográfico': Globe,
  'default': ShieldAlert,
};


export default function SecurityLogsPage() {
  const [logs, setLogs] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();
  const params = useParams() as { siteId: string };

  React.useEffect(() => {
    async function fetchLogs() {
        setIsLoading(true);
        try {
            const result = await getSecurityLogsForProjectAction(params.siteId);
            setLogs(result);
        } catch (error: any) {
            toast({ title: "Erro ao carregar logs", description: error.message, variant: "destructive"});
        } finally {
            setIsLoading(false);
        }
    }
    fetchLogs();
  }, [params.siteId, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Logs de Segurança</CardTitle>
        <CardDescription>
          Visualize um histórico detalhado de todas as tentativas de acesso que foram bloqueadas pelo cloaker.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data e Hora</TableHead>
                <TableHead>Endereço IP</TableHead>
                <TableHead>País</TableHead>
                <TableHead>Motivo do Bloqueio</TableHead>
                <TableHead>User-Agent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                  <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                          <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                      </TableCell>
                  </TableRow>
              ) : logs.length > 0 ? logs.map((log, index) => {
                  const Icon = reasonToIconMap[log.reason] || reasonToIconMap.default;
                  return (
                    <TableRow key={index} className={cn(log.is_critical && 'bg-destructive/10 hover:bg-destructive/20')}>
                        <TableCell className="text-muted-foreground whitespace-nowrap">{new Date(log.created_at).toLocaleString('pt-BR')}</TableCell>
                        <TableCell className="font-mono">{log.ip_address}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <span title={log.country_name}>{log.country_code}</span> 
                                <span className="hidden sm:inline">{log.country_name}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant={log.is_critical ? "destructive" : "secondary"} className="gap-1.5">
                                <Icon className="h-3 w-3" />
                                {log.reason}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-xs max-w-[200px] truncate">{log.user_agent}</TableCell>
                    </TableRow>
                )
              }) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">Nenhum evento de segurança registrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
