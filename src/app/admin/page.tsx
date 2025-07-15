'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Users, TrendingUp, TrendingDown, Database, Cpu, CheckCircle, Link as LinkIcon, Plus, Globe, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getAdminDashboardStatsAction } from "@/app/actions/admin";
import { useToast } from "@/hooks/use-toast";


type Stats = {
    mrr: number;
    activeSubscribers: number;
    newTrials: number;
    churnRate: number;
    totalUsers: number;
    totalProjects: number;
    recentUsers: any[];
    recentProjects: any[];
    topProjects: any[];
    avgVisits: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      try {
        const result = await getAdminDashboardStatsAction();
        setStats(result);
      } catch (error: any) {
        toast({
          title: "Erro ao carregar dados",
          description: error.message,
          variant: "destructive"
        })
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, [toast]);

  if (isLoading) {
    return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (!stats) {
    return <div className="text-center">Não foi possível carregar as estatísticas. Tente novamente mais tarde.</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Painel do Administrador</h1>
        <p className="text-muted-foreground">Seu negócio em resumo.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Recorrente Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R${stats.mrr.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Nenhum dado ainda</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinantes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscribers}</div>
            <p className="text-xs text-muted-foreground">Nenhum dado ainda</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Testes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newTrials}</div>
            <p className="text-xs text-muted-foreground">Nenhum dado ainda</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Churn</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.churnRate}%</div>
            <p className="text-xs text-muted-foreground">Nenhum dado ainda</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Atividade Recente</CardTitle>
                    <CardDescription>O que aconteceu na plataforma nas últimas 24 horas.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><Plus className="h-4 w-4"/>Novos Usuários</h3>
                         <Table>
                            <TableBody>
                                {stats.recentUsers.length > 0 ? stats.recentUsers.map(user => (
                                    <TableRow key={user.email}>
                                        <TableCell>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-xs text-muted-foreground">{user.email}</div>
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground">
                                           {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell className="h-24 text-center" colSpan={2}>Nenhum usuário recente.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                         </Table>
                    </div>
                     <div>
                        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><Globe className="h-4 w-4"/>Novos Sites</h3>
                         <Table>
                            <TableBody>
                                {stats.recentProjects.length > 0 ? stats.recentProjects.map(project => (
                                    <TableRow key={project.name}>
                                        <TableCell>
                                            <div className="font-medium">{project.name}</div>
                                            <div className="text-xs text-muted-foreground">por {project.user_name}</div>
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground">
                                           {new Date(project.created_at).toLocaleDateString('pt-BR')}
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell className="h-24 text-center" colSpan={2}>Nenhum site recente.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                         </Table>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Estatísticas da Plataforma</CardTitle>
                    <CardDescription>Métricas globais de todos os sites.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sites Mais Visitados</TableHead>
                                <TableHead className="text-right">Visitas (Últimos 7 dias)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.topProjects.length > 0 ? stats.topProjects.map(project => (
                                <TableRow key={project.name}>
                                    <TableCell className="font-medium">{project.name}</TableCell>
                                    <TableCell className="text-right">{project.visits}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell className="h-24 text-center" colSpan={2}>Nenhum dado disponível.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                     </Table>
                     <div className="mt-4 pt-4 border-t flex justify-around text-center">
                        <div>
                            <p className="text-sm text-muted-foreground">Total de Sites</p>
                            <p className="text-2xl font-bold">{stats.totalProjects}</p>
                        </div>
                         <div>
                            <p className="text-sm text-muted-foreground">Média de Visitas / Site</p>
                            <p className="text-2xl font-bold">{stats.avgVisits}</p>
                        </div>
                     </div>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-1">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Status do Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <LinkIcon className="h-5 w-5 text-muted-foreground"/>
                           <span className="font-medium">API Principal</span>
                        </div>
                        <Badge variant="secondary" className="text-green-400 gap-1.5"><CheckCircle className="h-3 w-3" /> Operacional</Badge>
                    </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Database className="h-5 w-5 text-muted-foreground"/>
                           <span className="font-medium">Banco de Dados</span>
                        </div>
                        <Badge variant="secondary" className="text-green-400 gap-1.5"><CheckCircle className="h-3 w-3" /> Conectado</Badge>
                    </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Cpu className="h-5 w-5 text-muted-foreground"/>
                           <span className="font-medium">Serviços de IA</span>
                        </div>
                        <Badge variant="secondary" className="text-green-400 gap-1.5"><CheckCircle className="h-3 w-3" /> Operacional</Badge>
                    </div>
                     <div className="border-t pt-4 text-center">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/health">Ver Saúde Detalhada</Link>
                        </Button>
                     </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
