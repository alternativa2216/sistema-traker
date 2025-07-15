
'use client'

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, MousePointerClick, PlusCircle, Sparkles, LogOut, Loader2, Target, Users, Network, AlertTriangle, Lightbulb, TrendingUp, Copy, Megaphone, X, Code } from "lucide-react";
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
import { addProjectAction, getProjectsAction, getNotificationsForUserAction, markNotificationAsReadAction } from "../actions/projects";
import { cn } from "@/lib/utils";
import type { AnalyticsData } from "../actions/analytics";
import { getAnalyticsForProjectAction } from "../actions/analytics";


const UserAlert = ({ alert, onDismiss }: { alert: any, onDismiss: (id: number) => void }) => {
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
        <Alert variant={config.variant} className={cn("relative pr-10", config.className)}>
           <div className="flex w-full items-start justify-between gap-4">
              <div className="flex items-start">
                 <Icon className={`h-4 w-4 mt-1 ${config.iconClassName}`} />
                 <div className="ml-4">
                   <AlertTitle className={config.titleClassName}>{alert.title}</AlertTitle>
                   <AlertDescription>
                     {alert.description}
                   </AlertDescription>
                 </div>
              </div>
              {alert.cta && alert.cta.href && (
                 <Button asChild size="sm" className="shrink-0">
                    <Link href={alert.cta.href}>{alert.cta.text || 'Clique aqui'}</Link>
                 </Button>
              )}
           </div>
            <button 
                onClick={() => onDismiss(alert.id)} 
                className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground"
                aria-label="Dispensar aviso"
            >
                <X className="h-4 w-4" />
            </button>
        </Alert>
    )
}

export default function DashboardPage() {
    const [sites, setSites] = useState<any[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);
    const { toast } = useToast();

    // State for Add Site Dialog
    const [isAddSiteDialogOpen, setIsAddSiteDialogOpen] = useState(false);
    const [isAddingSite, setIsAddingSite] = useState(false);
    const [dialogStep, setDialogStep] = useState('form'); 
    const [newSiteName, setNewSiteName] = useState('');
    const [newSiteUrl, setNewSiteUrl] = useState('');
    const [generatedScript, setGeneratedScript] = useState('');
    const [baseUrl, setBaseUrl] = useState('');

    useEffect(() => {
        setBaseUrl(window.location.origin);
    }, []);

    const fetchInitialData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [fetchedSites, fetchedAlerts] = await Promise.all([
                getProjectsAction(),
                getNotificationsForUserAction()
            ]);
            setSites(fetchedSites);
            setAlerts(fetchedAlerts);
            if (fetchedSites.length > 0) {
                setSelectedSiteId(fetchedSites[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            toast({
                title: "Erro ao Carregar Dados",
                description: "Não foi possível buscar seus projetos e notificações.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);


    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);
    
    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!selectedSiteId) {
                setAnalyticsData(null);
                return;
            }
            setIsAnalyticsLoading(true);
            try {
                const data = await getAnalyticsForProjectAction({ projectId: selectedSiteId, range: '7d' as any });
                setAnalyticsData(data);
            } catch (error: any) {
                toast({ title: 'Erro ao buscar analytics', description: error.message, variant: 'destructive' });
            } finally {
                setIsAnalyticsLoading(false);
            }
        };
        fetchAnalytics();
    }, [selectedSiteId, toast]);

    const handleDismissAlert = async (id: number) => {
        setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
        try {
            await markNotificationAsReadAction(id);
        } catch (error: any) {
            toast({ title: 'Erro', description: error.message, variant: 'destructive' });
            fetchInitialData();
        }
    };

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
                setSelectedSiteId(newProject.id); // Select the new site
                const script = `<script async src="${baseUrl}/track.js?id=${newProject.id}"></script>`;
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


    const TopPagesCard = ({ title, data, icon, unit }: { title: string, data: { path: string; visits: number }[] | undefined, icon: React.ElementType, unit: string }) => {
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
                            {data && data.length > 0 ? data.map((item) => (
                                <TableRow key={item.path}>
                                    <TableCell className="font-medium truncate max-w-[150px]">{item.path}</TableCell>
                                    <TableCell className="text-right">{item.visits.toLocaleString('pt-BR')}</TableCell>
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
                {alerts.map(alert => (
                    <UserAlert key={alert.id} alert={alert} onDismiss={handleDismissAlert} />
                ))}
            </div>
            
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h1 className="text-3xl font-bold font-headline">
                        {sites.length === 0 ? 'Painel Principal' : selectedSiteId ? sites.find(s => s.id === selectedSiteId)?.name : 'Painel Geral'}
                    </h1>
                    <p className="text-muted-foreground">
                        {sites.length === 0 ? 'Adicione um site para começar.' : 'Visão geral do desempenho do seu projeto nos últimos 7 dias.'}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Select onValueChange={setSelectedSiteId} value={selectedSiteId ?? ''} disabled={sites.length === 0}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Selecione um site" />
                        </SelectTrigger>
                        <SelectContent>
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
                isAnalyticsLoading ? (
                    <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
                ) : analyticsData ? (
                    <>
                        <OverviewChart data={analyticsData.timeSeries} />

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Visitantes Únicos</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent><div className="text-2xl font-bold">{analyticsData.summary.visitors.toLocaleString('pt-BR')}</div></CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total de Visitas</CardTitle>
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent><div className="text-2xl font-bold">{analyticsData.summary.sessions.toLocaleString('pt-BR')}</div></CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Taxa de Rejeição</CardTitle>
                                    <Target className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent><div className="text-2xl font-bold">{analyticsData.summary.bounceRate.toFixed(1)}%</div></CardContent>
                            </Card>
                           <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Duração da Sessão</CardTitle>
                                    <LogOut className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent><div className="text-2xl font-bold">{analyticsData.summary.sessionDuration}</div></CardContent>
                            </Card>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <TopPagesCard title="Top 5 Páginas Visitadas" data={analyticsData.topPages} icon={MousePointerClick} unit="Visitas" />
                            <TopPagesCard title="Top 5 Páginas de Saída" data={analyticsData.exitPages} icon={LogOut} unit="Saídas" />
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
                                                <TableHead className="text-right">Visitantes</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {analyticsData.sources.length > 0 ? analyticsData.sources.map((source) => (
                                                <TableRow key={source.source}>
                                                    <TableCell className="font-medium">{source.source}</TableCell>
                                                    <TableCell className="text-right">{source.visitors.toLocaleString('pt-BR')}</TableCell>
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
                    </>
                ) : (
                     <Card className="flex flex-col items-center justify-center text-center p-12">
                        <CardTitle className="font-headline">Aguardando Dados</CardTitle>
                        <CardDescription className="mt-2 mb-6 max-w-md">
                            Ainda não recebemos nenhuma visita para este site. Certifique-se de que o script de rastreamento foi instalado corretamente em todas as páginas.
                        </CardDescription>
                         <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline"><Code className="mr-2 h-4 w-4"/>Ver Script de Rastreamento</Button>
                            </DialogTrigger>
                             <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Script de Rastreamento</DialogTitle>
                                    <DialogDescription>
                                        Copie e cole este script na tag <code>&lt;head&gt;</code> do seu site.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="bg-muted p-4 rounded-md font-mono text-sm text-foreground break-all">
                                    {`<script async src="${baseUrl}/track.js?id=${selectedSiteId}"></script>`}
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => {
                                        navigator.clipboard.writeText(`<script async src="${baseUrl}/track.js?id=${selectedSiteId}"></script>`);
                                        toast({title: "Copiado!"});
                                    }}>
                                        <Copy className="mr-2 h-4 w-4" />Copiar
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </Card>
                )
            )}
        </div>
    );
}

    