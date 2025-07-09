'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, Bot, Copy, Eye, LogOut, MousePointerClick, TrendingDown, Users, Target, Network, Code } from 'lucide-react';
import { VisitsOverTimeChart } from '@/components/dashboard/site-analytics/visits-over-time-chart';
import { TrafficSourceChart } from '@/components/dashboard/site-analytics/traffic-source-chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Mock data, in a real app this would be fetched based on siteId and date range
const MOCK_SITE_DETAILS = {
    id: "site-1",
    name: "meu-ecommerce.com",
    stats: {
        today: { visitors: "1.2k", sessions: "1.5k", bounceRate: "25.4%", sessionDuration: "3m 12s" },
        yesterday: { visitors: "1.1k", sessions: "1.4k", bounceRate: "26.1%", sessionDuration: "3m 05s" },
        '7d': { visitors: "8.9k", sessions: "10.2k", bounceRate: "28.9%", sessionDuration: "2m 54s" },
        '30d': { visitors: "35.6k", sessions: "41.8k", bounceRate: "30.1%", sessionDuration: "2m 48s" },
        all: { visitors: "128k", sessions: "155k", bounceRate: "32.5%", sessionDuration: "2m 40s" },
    },
    pages: {
        top: [
            { path: "/produto-a", visits: "5,201" },
            { path: "/promocoes", visits: "3,123" },
            { path: "/home", visits: "2,100" },
        ],
        bottom: [
            { path: "/termos-de-servico", visits: "5" },
            { path: "/politica-de-privacidade", visits: "12" },
            { path: "/faq", visits: "25" },
        ]
    }
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

export default function SiteAnalyticsPage({ params }: { params: { siteId: string } }) {
    const [timeRange, setTimeRange] = useState('7d');
    const { toast } = useToast();
    // @ts-ignore
    const data = MOCK_SITE_DETAILS.stats[timeRange];
    const trackingScript = `<script async src="https://tracklytics.ai/track.js?id=${params.siteId}"></script>`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(trackingScript);
        toast({
            title: "Copiado!",
            description: "O script de rastreamento foi copiado para sua área de transferência.",
        });
    };

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

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard title="Visitantes" value={data.visitors} change="5.2%" changeType="increase" />
                <MetricCard title="Sessões" value={data.sessions} change="8.1%" changeType="increase" />
                <MetricCard title="Taxa de Rejeição" value={data.bounceRate} change="2.5%" changeType="decrease" />
                <MetricCard title="Duração da Sessão" value={data.sessionDuration} change="1.2%" changeType="increase" />
            </div>

            {/* Charts and Map */}
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
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <MousePointerClick className="h-5 w-5 text-primary" />
                            <CardTitle className="font-headline text-lg">Páginas Mais Visitadas</CardTitle>
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
                                {MOCK_SITE_DETAILS.pages.top.map((page) => (
                                    <TableRow key={page.path}>
                                        <TableCell>{page.path}</TableCell>
                                        <TableCell className="text-right">{page.visits}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <TrendingDown className="h-5 w-5 text-primary" />
                            <CardTitle className="font-headline text-lg">Páginas Menos Visitadas</CardTitle>
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
                                {MOCK_SITE_DETAILS.pages.bottom.map((page) => (
                                    <TableRow key={page.path}>
                                        <TableCell>{page.path}</TableCell>
                                        <TableCell className="text-right">{page.visits}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-primary" />
                            <CardTitle className="font-headline text-lg">Dicas da IA para Melhorias</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-3">
                       <p><strong>Otimize o Título da Página Inicial:</strong> O título atual pode não ser cativante o suficiente. Tente algo como "Soluções Criativas para Marcas Inovadoras" para atrair mais a atenção.</p>
                       <p><strong>Adicione um CTA na Seção de Serviços:</strong> A página de serviços não tem uma chamada para ação clara. Adicione um botão "Solicite um Orçamento" para guiar os usuários.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
