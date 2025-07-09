'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Eye, MousePointerClick, PlusCircle, Sparkles, LogOut, Loader2, Target, Users, Network } from "lucide-react";
import Link from "next/link";
import { analyzeProjectDataAction } from "../actions/ai";
import { useToast } from "@/hooks/use-toast";
import { OverviewChart } from "@/components/dashboard/overview-chart";


// --- Mock Data ---
// In a real app, this would come from an API call to your database
const MOCK_SITES = [
    { id: "site-1", name: "meu-ecommerce.com" },
    { id: "site-2", name: "meu-blog-pessoal.dev" },
    { id: "site-3", name: "agencia-criativa.co" },
];

const MOCK_DATA = {
    all: {
        totalVisits: "44,107",
        newUsers: "+1,245",
        conversionRate: "5.72%",
        avgBounceRate: "41.5%",
        topVisitedPages: [
            { path: "/home", visits: "15,203" },
            { path: "/pricing", visits: "9,834" },
            { path: "/features", visits: "7,120" },
            { path: "/blog/post-1", visits: "5,432" },
            { path: "/contato", visits: "3,987" },
        ],
        topExitPages: [
            { path: "/carrinho", exits: "4,321" },
            { path: "/checkout/step-2", exits: "3,102" },
            { path: "/blog/post-3", exits: "2,543" },
            { path: "/suporte", exits: "1,987" },
            { path: "/pricing", exits: "1,234" },
        ],
        trafficSources: [
            { source: "Google", visits: "18,234" },
            { source: "Direct", visits: "11,987" },
            { source: "Facebook", visits: "7,543" },
            { source: "ProductHunt", visits: "4,321" },
            { source: "Outros", visits: "2,022" },
        ]
    },
    "site-1": {
        totalVisits: "12,402",
        newUsers: "+450",
        conversionRate: "8.2%",
        avgBounceRate: "35.2%",
        topVisitedPages: [
            { path: "/produto-a", visits: "5,201" },
            { path: "/promocoes", visits: "3,123" },
            { path: "/home", visits: "2,100" },
            { path: "/categoria/eletronicos", visits: "1,543" },
            { path: "/carrinho", visits: "987" },
        ],
        topExitPages: [
            { path: "/carrinho", exits: "1,203" },
            { path: "/checkout/pagamento", exits: "982" },
            { path: "/produto-a", exits: "734" },
            { path: "/login", exits: "543" },
            { path: "/promocoes", exits: "321" },
        ],
        trafficSources: [
            { source: "Google", visits: "6,234" },
            { source: "Facebook", visits: "3,543" },
            { source: "Direct", visits: "1,987" },
            { source: "Outros", visits: "638" },
        ]
    },
    "site-2": {
        totalVisits: "8,923",
        newUsers: "+820",
        conversionRate: "2.1%",
        avgBounceRate: "55.8%",
        topVisitedPages: [
            { path: "/post/ia-em-2024", visits: "4,321" },
            { path: "/home", visits: "2,100" },
            { path: "/sobre", visits: "1,500" },
            { path: "/contato", visits: "900" },
            { path: "/projetos", visits: "450" },
        ],
        topExitPages: [
            { path: "/post/ia-em-2024", exits: "2,100" },
            { path: "/home", exits: "1,500" },
            { path: "/contato", exits: "800" },
            { path: "/sobre", exits: "650" },
            { path: "/projetos", exits: "320" },
        ],
         trafficSources: [
            { source: "Direct", visits: "4,234" },
            { source: "Google", visits: "3,987" },
            { source: "Twitter", visits: "543" },
            { source: "Outros", visits: "159" },
        ]
    },
    "site-3": {
        totalVisits: "21,832",
        newUsers: "+980",
        conversionRate: "11.3%",
        avgBounceRate: "28.1%",
        topVisitedPages: [
            { path: "/portfolio", visits: "9,800" },
            { path: "/servicos/design", visits: "6,543" },
            { path: "/home", visits: "3,210" },
            { path: "/contato", visits: "1,500" },
            { path: "/blog", visits: "990" },
        ],
        topExitPages:
            [
                { path: "/contato", exits: "2,100" },
                { path: "/servicos/design", exits: "1,800" },
                { path: "/portfolio", exits: "1,200" },
                { path: "/home", exits: "950" },
                { path: "/blog", exits: "780" },
            ],
        trafficSources: [
            { source: "ProductHunt", visits: "10,234" },
            { source: "Google", visits: "7,543" },
            { source: "Direct", visits: "3,123" },
            { source: "Outros", visits: "932" },
        ]
    }
}
// --- End Mock Data ---


export default function DashboardPage() {
    const [selectedSiteId, setSelectedSiteId] = useState('all');
    const [displayData, setDisplayData] = useState(MOCK_DATA.all);
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        // @ts-ignore
        const data = MOCK_DATA[selectedSiteId] || MOCK_DATA.all;
        setDisplayData(data);

        if (selectedSiteId !== 'all') {
            handleAiAnalysis(selectedSiteId, data);
        } else {
            setAiAnalysis(null);
        }
    }, [selectedSiteId]);

    const handleAiAnalysis = async (projectId: string, projectData: any) => {
        setIsAiLoading(true);
        setAiAnalysis(null);
        try {
            const response = await analyzeProjectDataAction({
                projectId,
                query: "O que posso melhorar no meu site para converter mais? Dê sugestões práticas e acionáveis.",
                data: JSON.stringify(projectData, null, 2),
            });
            setAiAnalysis(response.analysis);
        } catch (error) {
            console.error("AI Analysis failed:", error);
            toast({
                title: "Erro na Análise de IA",
                description: "Não foi possível obter os insights de IA. Tente novamente mais tarde.",
                variant: "destructive",
            });
            setAiAnalysis("Não foi possível carregar a análise de IA.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const TopPagesCard = ({ title, data, icon, unit }: { title: string, data: { path: string, [key: string]: string }[], icon: React.ElementType, unit: string }) => {
        const Icon = icon;
        return (
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
                                <TableHead className="text-right">{unit}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.path}>
                                    <TableCell className="font-medium">{item.path}</TableCell>
                                    <TableCell className="text-right">{item[Object.keys(item)[1]]}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )
    };


    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h1 className="text-3xl font-bold font-headline">
                        {selectedSiteId === 'all' ? 'Painel Geral' : MOCK_SITES.find(s => s.id === selectedSiteId)?.name}
                    </h1>
                    <p className="text-muted-foreground">
                        {selectedSiteId === 'all' ? 'Uma visão geral de todos os seus projetos.' : 'Análise detalhada do site selecionado.'}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Select onValueChange={setSelectedSiteId} defaultValue="all">
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Selecione um site" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os Sites</SelectItem>
                            {MOCK_SITES.map(site => (
                                <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Site
                    </Button>
                </div>
            </div>

            {selectedSiteId === 'all' && (
                <OverviewChart />
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Visitas</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{displayData.totalVisits}</div>
                        <p className="text-xs text-muted-foreground">+12.5% do último mês</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Novos Usuários</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{displayData.newUsers}</div>
                        <p className="text-xs text-muted-foreground">+8.2% do último mês</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{displayData.conversionRate}</div>
                        <p className="text-xs text-muted-foreground">+1.1% do último mês</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Rejeição Média</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{displayData.avgBounceRate}</div>
                        <p className="text-xs text-muted-foreground">-2.3% do último mês</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <TopPagesCard title="Top 5 Páginas Visitadas" data={displayData.topVisitedPages} icon={MousePointerClick} unit="Visitas" />
                <TopPagesCard title="Top 5 Páginas de Saída" data={displayData.topExitPages} icon={LogOut} unit="Saídas" />
                 <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Network className="h-5 w-5 text-primary" />
                            <CardTitle className="font-headline text-lg">Fontes de Tráfego</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fonte</TableHead>
                                    <TableHead className="text-right">Visitas</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayData.trafficSources.map((source) => (
                                    <TableRow key={source.source}>
                                        <TableCell className="font-medium">{source.source}</TableCell>
                                        <TableCell className="text-right">{source.visits}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {selectedSiteId !== 'all' && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <CardTitle className="font-headline text-lg">Análise de IA para Conversão</CardTitle>
                        </div>
                        <CardDescription>Recomendações geradas pelo Gemini para melhorar os resultados do seu site.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground min-h-[100px]">
                        {isAiLoading && <div className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Gerando insights...</div>}
                        {aiAnalysis && !isAiLoading && <p className="whitespace-pre-wrap">{aiAnalysis}</p>}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
