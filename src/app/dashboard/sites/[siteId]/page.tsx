'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, Bot, Copy, Eye, LogOut, MousePointerClick, TrendingDown, Users, Target, Network, Code, Loader2 } from 'lucide-react';
import { VisitsOverTimeChart } from '@/components/dashboard/site-analytics/visits-over-time-chart';
import { TrafficSourceChart } from '@/components/dashboard/site-analytics/traffic-source-chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const emptyStats = {
    visitors: "0", sessions: "0", bounceRate: "0%", sessionDuration: "0m 0s"
};

const emptyPages = {
    top: [],
    bottom: []
};

const MetricCard = ({ title, value, change, changeType }: { title: string, value: string, change?: string, changeType?: 'increase' | 'decrease' }) => (
    <Card>
        <CardHeader className="pb-2">
            <CardDescription>{title}</CardDescription>
            <CardTitle className="text-4xl font-bold font-headline">{value}</CardTitle>
        </CardHeader>
        <CardContent>
            {change && (
                <div className={`text-xs flex items-center ${changeType === 'decrease' ? 'text-red-500' : 'text-green-500'}`}>
                    {changeType === 'increase' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    <span>{change} em relação a ontem</span>
                </div>
            )}
        </CardContent>
    </Card>
);

export default function SiteAnalyticsPage() {
    const params = useParams() as { siteId: string };
    const [timeRange, setTimeRange] = useState('7d');
    const [stats, setStats] = useState(emptyStats);
    const [pages, setPages] = useState<{top: any[], bottom: any[]}>(emptyPages);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const trackingScript = `<script async src="https://tracklytics.ai/track.js?id=${params.siteId}"></script>`;

    useEffect(() => {
        setIsLoading(true);
        // In a real app, you would fetch data from your API here
        // based on `params.siteId` and `timeRange`.
        // e.g. fetch(`/api/sites/${params.siteId}/stats?range=${timeRange}`).then(...)
        setTimeout(() => {
            setStats(emptyStats);
            setPages(emptyPages);
            setIsLoading(false);
        }, 500); // Simulate network delay
    }, [params.siteId, timeRange]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(trackingScript);
        toast({
            title: "Copiado!",
            description: "O script de rastreamento foi copiado para sua área de transferência.",
        });
    };
    
    const PageTable = ({ title, data, icon: Icon }: { title: string; data: { path: string; visits: string }[], icon: React.ElementType }) => (
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
                        {data.length > 0 ? (
                            data.map((page) => (
                                <TableRow key={page.path}>
                                    <TableCell>{page.path}</TableCell>
                                    <TableCell className="text-right">{page.visits}</TableCell>
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
                    <MetricCard title="Visitantes" value={stats.visitors} />
                    <MetricCard title="Sessões" value={stats.sessions} />
                    <MetricCard title="Taxa de Rejeição" value={stats.bounceRate} />
                    <MetricCard title="Duração da Sessão" value={stats.sessionDuration} />
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-headline">Visitas ao Longo do Tempo</CardTitle>
                        <CardDescription>Visualização do tráfego do site no período selecionado.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <VisitsOverTimeChart />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Fontes de Tráfego</CardTitle>
                        <CardDescription>De onde vêm seus visitantes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TrafficSourceChart />
                    </CardContent>
                </Card>
            </div>
            
             <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                <PageTable title="Páginas Mais Visitadas" data={pages.top} icon={MousePointerClick} />
                <PageTable title="Páginas Menos Visitadas" data={pages.bottom} icon={TrendingDown} />
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
