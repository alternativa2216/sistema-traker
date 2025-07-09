'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpRight, Eye, MousePointerClick, PlusCircle, Sparkles, LogOut, Loader2, Target, Users, Network, AlertTriangle, Lightbulb, TrendingUp, Copy, Megaphone } from "lucide-react";
import Link from "next/link";
import { analyzeProjectDataAction } from "../actions/ai";
import { useToast } from "@/hooks/use-toast";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { addProjectAction, getProjectsAction } from "../actions/projects";
import { cn } from "@/lib/utils";

// This data will be fetched from the database
const initialAlerts: any[] = [];
// This component now fetches its own data
const UserAlert = ({ alert }: { alert: any }) => {
    const alertConfig = {
        info: {
            icon: Megaphone,
            className: 'border-yellow-500/50',
            titleClassName: 'text-yellow-400',
            iconClassName: 'text-yellow-500',
        },
        promo: {
            icon: Sparkles,
            className: 'border-primary/50',
            titleClassName: 'text-primary',
            iconClassName: 'text-primary',
        },
        critical: {
            icon: AlertTriangle,
            variant: 'destructive' as "destructive" | "default" | null | undefined,
        },
    };
    // @ts-ignore
    const config = alertConfig[alert.type] || alertConfig.info;
    const Icon = config.icon;

    return (
        <Alert variant={config.variant} className={config.className}>
           <div className="flex w-full items-center justify-between gap-4">
              <div className="flex items-center">
                 <Icon className={`h-4 w-4 ${config.iconClassName}`} />
                 <div className="ml-4">
                   <AlertTitle className={config.titleClassName}>{alert.title}</AlertTitle>
                   <AlertDescription>
                     {alert.description}
                   </AlertDescription>
                 </div>
              </div>
              {alert.cta && (
                 <Button asChild>
                    <Link href={alert.cta.href}>{alert.cta.text}</Link>
                 </Button>
              )}
           </div>
        </Alert>
    )
}

const emptyData = {
    totalVisits: "0",
    newUsers: "0",
    conversionRate: "0%",
    avgBounceRate: "0%",
    topVisitedPages: [],
    topExitPages: [],
    trafficSources: []
};

export default function DashboardPage() {
    const [sites, setSites] = useState<any[]>([]);
    const [selectedSiteId, setSelectedSiteId] = useState('all');
    const [displayData, setDisplayData] = useState(emptyData);
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const { toast } = useToast();

    // State for Add Site Dialog
    const [isAddSiteDialogOpen, setIsAddSiteDialogOpen] = useState(false);
    const [isAddingSite, setIsAddingSite] = useState(false);
    const [dialogStep, setDialogStep] = useState('form'); 
    const [newSiteName, setNewSiteName] = useState('');
    const [newSiteUrl, setNewSiteUrl] = useState('');
    const [generatedScript, setGeneratedScript] = useState('');

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const fetchedSites = await getProjectsAction();
            setSites(fetchedSites);
            // Here you would also fetch stats for the selected site
            // For now, we'll just show empty data
            // const stats = await getStatsForSite(selectedSiteId);
            // setDisplayData(stats);
            setIsLoading(false);
        }
        fetchData();
    }, []);

    useEffect(() => {
        // This effect would re-fetch data when the selected site changes
        // For now, it just resets the data to empty
        setDisplayData(emptyData);
        setAiAnalysis(null);
        if (selectedSiteId !== 'all') {
            // handleAiAnalysis(selectedSiteId, {}); // Pass empty data for now
        }
    }, [selectedSiteId]);

    const handleAddSiteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSiteName.trim() || !newSiteUrl.trim()) {
            toast({
                title: "Campos obrigatórios",
                description: "Por favor, preencha o nome e a URL do site.",
                variant: "destructive",
            });
            return;
        }
        setIsAddingSite(true);
        try {
            const result = await addProjectAction({ name: newSiteName, url: newSiteUrl });
            if (result.success) {
                const newProject = result.project;
                setSites(prev => [newProject, ...prev]);
                const script = `<script async src="https://tracklytics.ai/track.js?id=${newProject.id}"></script>`;
                setGeneratedScript(script);
                setDialogStep('success');
            }
        } catch (error: any) {
            toast({ title: "Erro ao Adicionar Site", description: error.message, variant: "destructive" });
        } finally {
            setIsAddingSite(false);
        }
    };

    const copyScriptToClipboard = () => {
        navigator.clipboard.writeText(generatedScript);
        toast({
            title: "Copiado!",
            description: "O script de rastreamento foi copiado para sua área de transferência.",
        });
    };

    useEffect(() => {
        if (!isAddSiteDialogOpen) {
            setTimeout(() => {
                setDialogStep('form');
                setNewSiteName('');
                setNewSiteUrl('');
                setGeneratedScript('');
            }, 300); 
        }
    }, [isAddSiteDialogOpen]);


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
                            {data.length > 0 ? data.map((item) => (
                                <TableRow key={item.path}>
                                    <TableCell className="font-medium">{item.path}</TableCell>
                                    <TableCell className="text-right">{item[Object.keys(item)[1]]}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="h-24 text-center">Nenhum dado.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )
    };


    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }
    
    return (
        <div className="space-y-8">
             <div className="space-y-4 mb-6">
                {initialAlerts.map(alert => (
                    <UserAlert key={alert.id} alert={alert} />
                ))}
            </div>
            
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h1 className="text-3xl font-bold font-headline">
                        {selectedSiteId === 'all' ? 'Painel Geral' : sites.find(s => s.id === selectedSiteId)?.name}
                    </h1>
                    <p className="text-muted-foreground">
                        {selectedSiteId === 'all' ? 'Uma visão geral de todos os seus projetos.' : 'Análise detalhada do site selecionado.'}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Select onValueChange={setSelectedSiteId} defaultValue="all" disabled={sites.length === 0}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Selecione um site" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os Sites</SelectItem>
                            {sites.map(site => (
                                <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Dialog open={isAddSiteDialogOpen} onOpenChange={setIsAddSiteDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Adicionar Site
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            {dialogStep === 'form' ? (
                                <>
                                    <DialogHeader>
                                        <DialogTitle className="font-headline">Adicionar Novo Site</DialogTitle>
                                        <DialogDescription>
                                            Insira os detalhes do seu novo site para começar o rastreamento.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form id="add-site-form" onSubmit={handleAddSiteSubmit}>
                                        <div className="grid gap-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="site-name">Nome do Site</Label>
                                                <Input id="site-name" value={newSiteName} onChange={(e) => setNewSiteName(e.target.value)} placeholder="Meu Novo Projeto" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="site-url">URL do Site</Label>
                                                <Input id="site-url" value={newSiteUrl} onChange={(e) => setNewSiteUrl(e.target.value)} placeholder="https://meuprojeto.com" required />
                                            </div>
                                        </div>
                                    </form>
                                    <DialogFooter>
                                        <Button type="submit" form="add-site-form" disabled={isAddingSite}>
                                            {isAddingSite && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Adicionar e Gerar Script
                                        </Button>
                                    </DialogFooter>
                                </>
                            ) : (
                                <>
                                    <DialogHeader>
                                        <DialogTitle className="font-headline">Site Adicionado com Sucesso!</DialogTitle>
                                        <DialogDescription>
                                           Copie e cole este script na tag <code>&lt;head&gt;</code> do seu site para começar.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="bg-muted p-4 rounded-md font-mono text-sm text-foreground break-all">
                                        {generatedScript}
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={copyScriptToClipboard} className="w-full">
                                            <Copy className="mr-2 h-4 w-4" />
                                            Copiar Script
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {sites.length === 0 ? (
                <Card className="flex flex-col items-center justify-center text-center p-12">
                    <CardTitle className="font-headline">Bem-vindo ao Tracklytics!</CardTitle>
                    <CardDescription className="mt-2 mb-6">Parece que você ainda não tem nenhum site. Adicione seu primeiro site para começar.</CardDescription>
                    <Button onClick={() => setIsAddSiteDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar seu Primeiro Site
                    </Button>
                </Card>
            ) : (
                <>
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
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Novos Usuários</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{displayData.newUsers}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                                <Target className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{displayData.conversionRate}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Taxa de Rejeição Média</CardTitle>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{displayData.avgBounceRate}</div>
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
                                        {displayData.trafficSources.length > 0 ? displayData.trafficSources.map((source) => (
                                            <TableRow key={source.source}>
                                                <TableCell className="font-medium">{source.source}</TableCell>
                                                <TableCell className="text-right">{source.visits}</TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={2} className="h-24 text-center">Nenhum dado.</TableCell>
                                            </TableRow>
                                        )}
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
                                {!aiAnalysis && !isAiLoading && <p>Nenhuma análise de IA disponível para este site ainda.</p>}
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}
