'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, Bot, Facebook, Globe, AlertCircle } from 'lucide-react';
import { AiChat } from '@/components/dashboard/ai-chat';
import { VisitsOverTimeChart } from '@/components/dashboard/site-analytics/visits-over-time-chart';
import { TrafficSourceChart } from '@/components/dashboard/site-analytics/traffic-source-chart';

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
    // @ts-ignore
    const data = MOCK_SITE_DETAILS.stats[timeRange];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline">{MOCK_SITE_DETAILS.name}</h1>
                    <p className="text-muted-foreground">Análise detalhada do seu site.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Tabs onValueChange={setTimeRange} defaultValue={timeRange}>
                        <TabsList>
                            <TabsTrigger value="today">Hoje</TabsTrigger>
                            <TabsTrigger value="yesterday">Ontem</TabsTrigger>
                            <TabsTrigger value="7d">7 Dias</TabsTrigger>
                            <TabsTrigger value="30d">30 Dias</TabsTrigger>
                            <TabsTrigger value="all">Total</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard title="Visitantes" value={data.visitors} change="5.2%" changeType="increase" />
                <MetricCard title="Novas Sessões" value={data.sessions} change="8.1%" changeType="increase" />
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
            
             <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-primary" />
                            <CardTitle className="font-headline text-lg">Dicas da IA para Melhorias</CardTitle>
                        </div>
                        <CardDescription>Recomendações geradas pelo Gemini para otimizar seu site.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-3">
                       <p><strong>Otimize o Título da Página Inicial:</strong> O título atual pode não ser cativante o suficiente. Tente algo como "Soluções Criativas para Marcas Inovadoras" para atrair mais a atenção.</p>
                       <p><strong>Adicione um CTA na Seção de Serviços:</strong> A página de serviços não tem uma chamada para ação clara. Adicione um botão "Solicite um Orçamento" para guiar os usuários.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            <CardTitle className="font-headline text-lg">Visitantes por Região</CardTitle>
                        </div>
                         <CardDescription>Distribuição geográfica dos seus visitantes.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-48 bg-muted/50 rounded-md">
                        <p className="text-muted-foreground">Mapa interativo em breve.</p>
                    </CardContent>
                </Card>
            </div>

            {/* AI Chat and Integrations */}
            <Tabs defaultValue="ai_chat" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ai_chat"><Bot className="mr-2 h-4 w-4" />Converse com a IA</TabsTrigger>
                    <TabsTrigger value="integrations"><Facebook className="mr-2 h-4 w-4" />Integração com Facebook</TabsTrigger>
                </TabsList>
                <TabsContent value="ai_chat">
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Converse com Seus Dados</CardTitle>
                            <CardDescription>
                            Pergunte ao nosso analista de IA qualquer coisa sobre os dados deste projeto para obter insights instantâneos.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AiChat />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="integrations">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Gerenciar Campanhas do Facebook</CardTitle>
                             <CardDescription>Conecte sua conta do Facebook Pixel para visualizar e gerenciar o desempenho de suas campanhas diretamente daqui.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg min-h-[40vh]">
                             <AlertCircle className="h-10 w-10 text-muted-foreground mb-4"/>
                            <h3 className="text-lg font-semibold mb-2">Em Breve</h3>
                            <p className="text-muted-foreground">A integração com o Facebook Pixel está em desenvolvimento para trazer seus dados de campanha para o Tracklytics.</p>
                            <Button variant="outline" className="mt-4" disabled>Conectar Facebook Pixel</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
