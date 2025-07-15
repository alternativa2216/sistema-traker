
'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Bot, Code, Copy, Eye, Loader2, LogOut, MousePointerClick, Network, Target, TrendingDown, Users } from 'lucide-react';
import { VisitsOverTimeChart } from '@/components/dashboard/site-analytics/visits-over-time-chart';
import { TrafficSourceChart } from '@/components/dashboard/site-analytics/traffic-source-chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getAnalyticsForProjectAction } from '@/app/actions/analytics';
import type { AnalyticsData } from '@/app/actions/analytics';


const MetricCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

export default function SiteAnalyticsPage() {
    const params = useParams() as { siteId: string };
    const [timeRange, setTimeRange] = useState('7d');
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    const trackingScript = `<script async src="${typeof window !== 'undefined' ? window.location.origin : ''}/track.js?id=${params.siteId}"></script>`;

    useEffect(() => {
        async function fetchData() {
            if (!params.siteId) {
                toast({ title: "Erro", description: "ID do projeto não encontrado.", variant: "destructive" });
                router.push('/dashboard');
                return;
            };
            setIsLoading(true);
            try {
                const data = await getAnalyticsForProjectAction({ projectId: params.siteId, range: timeRange as any });
                setAnalyticsData(data);
            } catch (error: any) {
                toast({ title: "Erro ao buscar dados", description: error.message, variant: 'destructive' });
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [params.siteId, timeRange, toast, router]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(trackingScript);
        toast({
            title: "Copiado!",
            description: "O script de rastreamento foi copiado para sua área de transferência.",
        });
    };
    
    const PageTable = ({ title, data, icon: Icon }: { title: string; data: { path: string; visits: number }[], icon: React.ElementType }) => (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="font-headline text-lg">{title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Página</TableHead>
                            <TableHead className="text-right">Visitas</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data && data.length > 0 ? (
                            data.map((page) => (
                                <TableRow key={page.path}>
                                    <TableCell className="truncate max-w-[200px]">{page.path}</TableCell>
                                    <TableCell className="text-right">{page.visits.toLocaleString('pt-BR')}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={2} className="h-24 text-center">Nenhum dado.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <Tabs onValueChange={setTimeRange} defaultValue={timeRange}>
                    <TabsList>
                        <TabsTrigger value="today">Hoje</TabsTrigger>
                        <TabsTrigger value="yesterday">Ontem</TabsTrigger>
                        <TabsTrigger value="7d">7 Dias</TabsTrigger>
                        <TabsTrigger value="30d">30 Dias</TabsTrigger>
                        <TabsTrigger value="all">Total</TabsTrigger>
                    </TabsList>
                </Tabs>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <Code className="mr-2 h-4 w-4" />
                            Ver Script de Rastreamento
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                        <DialogHeader className="text-center space-y-4">
                            <DialogTitle className="font-headline text-2xl">Script de Rastreamento</DialogTitle>
                            <DialogDescription>
                                Copie e cole este script no final da tag <code>&lt;head&gt;</code> de todas as páginas que você deseja rastrear.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="bg-muted p-4 rounded-md font-mono text-sm text-foreground break-all text-center">
                            {trackingScript}
                        </div>
                        <Button onClick={copyToClipboard} className="w-full">
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar Script
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => <Card key={i} className="h-36 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></Card>)}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <MetricCard title="Visitantes Únicos" icon={Users} value={analyticsData?.summary.visitors.toLocaleString('pt-BR') ?? '0'} />
                    <MetricCard title="Total de Visitas" icon={Eye} value={analyticsData?.summary.sessions.toLocaleString('pt-BR') ?? '0'} />
                    <MetricCard title="Taxa de Rejeição" icon={TrendingDown} value={`${analyticsData?.summary.bounceRate.toFixed(1) ?? '0.0'}%`} />
                    <MetricCard title="Duração da Sessão" icon={LogOut} value={analyticsData?.summary.sessionDuration ?? '0m 0s'} />
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-headline">Visitas ao Longo do Tempo</CardTitle>
                        <CardDescription>Visualização do tráfego do site no período selecionado.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <VisitsOverTimeChart data={analyticsData?.timeSeries ?? []} isLoading={isLoading}/>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Fontes de Tráfego</CardTitle>
                        <CardDescription>De onde vêm seus visitantes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TrafficSourceChart data={analyticsData?.sources ?? []} isLoading={isLoading}/>
                    </CardContent>
                </Card>
            </div>
            
             <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                <PageTable title="Páginas Mais Visitadas" data={analyticsData?.topPages ?? []} icon={MousePointerClick} />
                <PageTable title="Páginas com Maior Saída" data={analyticsData?.exitPages ?? []} icon={Target} />
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-primary" />
                            <CardTitle className="font-headline text-lg">Dicas da IA para Melhorias</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-3">
                       <p>Nenhuma dica disponível. Aguardando mais dados para análise.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

    
