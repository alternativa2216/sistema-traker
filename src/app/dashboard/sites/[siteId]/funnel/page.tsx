'use client'

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDown, Filter, Users, Eye, ShoppingCart, CreditCard, TrendingUp, UserX, Route, PlusCircle, Trash2, GripVertical, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getFunnelStepsAction, saveFunnelStepsAction } from '@/app/actions/projects';

interface FunnelStep {
    id: number;
    name: string;
    url: string;
}

const stepIcons = [Users, Eye, ShoppingCart, CreditCard, TrendingUp, Route];


export default function FunnelPage() {
    const params = useParams() as { siteId: string };
    const { toast } = useToast();
    const [funnelSteps, setFunnelSteps] = React.useState<FunnelStep[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        async function fetchSteps() {
            setIsLoading(true);
            try {
                const steps = await getFunnelStepsAction(params.siteId);
                if (steps.length > 0) {
                    setFunnelSteps(steps);
                } else {
                    // Set default funnel if none exists
                    setFunnelSteps([
                        { id: 1, name: 'Visitantes da Home', url: '/' },
                        { id: 2, name: 'Visualizaram Produtos', url: '/produtos' },
                    ]);
                }
            } catch (error: any) {
                toast({ title: "Erro", description: error.message, variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        }
        fetchSteps();
    }, [params.siteId, toast]);

    const handleStepChange = (index: number, field: 'name' | 'url', value: string) => {
        const newSteps = [...funnelSteps];
        newSteps[index][field] = value;
        setFunnelSteps(newSteps);
    };

    const addStep = () => {
        setFunnelSteps([...funnelSteps, { id: Date.now(), name: '', url: '' }]);
    };

    const removeStep = (index: number) => {
        const newSteps = funnelSteps.filter((_, i) => i !== index);
        setFunnelSteps(newSteps);
    };
    
    const handleAddUnusedPage = (path: string) => {
        setFunnelSteps([...funnelSteps, { id: Date.now(), name: 'Nova Etapa', url: path }]);
        toast({
            title: "Etapa Adicionada!",
            description: `A página ${path} foi adicionada ao final do seu funil.`,
        });
    };

    const saveFunnel = async () => {
        setIsSaving(true);
        try {
            await saveFunnelStepsAction({ projectId: params.siteId, steps: funnelSteps });
            toast({
                title: "Funil Salvo!",
                description: "A configuração do seu funil foi salva com sucesso.",
            });
        } catch (error: any) {
            toast({ title: "Erro ao Salvar", description: error.message, variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    // Generate funnel data for visualization based on the builder
    const funnelDataForVisualization = {
        stages: funnelSteps.map((step, index, arr) => {
            const count = 0; // No real data yet
            let conversion = 0;
            if (index > 0) {
                conversion = 0;
            }
            return {
                name: step.name,
                count: count.toLocaleString('pt-BR'),
                conversion: conversion,
                icon: stepIcons[index] || Route,
            };
        }),
    };

  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Construtor de Funil</CardTitle>
                <CardDescription>
                    Defina as etapas do seu funil de conversão aqui. Dê um nome para cada etapa e especifique a URL correspondente. Os dados serão salvos no seu banco de dados.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? <div className='flex justify-center items-center h-24'><Loader2 className='h-6 w-6 animate-spin' /></div> : (
                    <div className="space-y-4">
                        {funnelSteps.map((step, index) => (
                            <div key={step.id} className="flex items-center gap-2 p-2 border rounded-lg bg-muted/50">
                                <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                                    <div className="space-y-1">
                                        <Label htmlFor={`step-name-${index}`}>Nome da Etapa</Label>
                                        <Input
                                            id={`step-name-${index}`}
                                            placeholder="Ex: Visualizou Produto"
                                            value={step.name}
                                            onChange={(e) => handleStepChange(index, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor={`step-url-${index}`}>URL da Página</Label>
                                        <Input
                                            id={`step-url-${index}`}
                                            placeholder="Ex: /produto/item-a"
                                            value={step.url}
                                            onChange={(e) => handleStepChange(index, 'url', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeStep(index)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
                 <div className="flex items-center gap-4 mt-4">
                    <Button variant="outline" onClick={addStep} disabled={isLoading}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Etapa
                    </Button>
                </div>
            </CardContent>
            <CardFooter>
                 <Button onClick={saveFunnel} disabled={isSaving || isLoading}>
                    {isSaving && <Loader2 className='mr-2 h-4 w-4 animate-spin'/>}
                    Salvar Funil
                </Button>
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Páginas Rastreadas Fora do Funil</CardTitle>
                <CardDescription>
                    Detectamos visitas em páginas com seu código de rastreamento que ainda não fazem parte do funil. Adicione-as com um clique.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Página</TableHead>
                            <TableHead>Visitas (Exemplo)</TableHead>
                            <TableHead className="text-right">Ação</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center">Nenhuma página não utilizada detectada.</TableCell>
                        </TableRow> 
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Pré-visualização da Análise do Funil</CardTitle>
                <CardDescription>Visualize a jornada do seu usuário com base nas etapas que você definiu acima.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? <div className='flex justify-center items-center h-48'><Loader2 className='h-8 w-8 animate-spin' /></div> :
                (
                     <div className="text-center text-muted-foreground p-8">
                        <p>Nenhum dado de funil para exibir. Configure suas etapas e aguarde os visitantes.</p>
                    </div>
                )}
            </CardContent>
        </Card>
        
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Filter className="h-6 w-6 text-primary" />
                        <CardTitle className="font-headline">Segmentação de Usuários</CardTitle>
                    </div>
                    <CardDescription>Filtre os dados do funil para análises mais profundas. Os dados serão atualizados dinamicamente.</CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label>Fonte de Tráfego</Label>
                        <Select disabled>
                            <SelectTrigger><SelectValue placeholder="Todas as Fontes" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as Fontes</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Dispositivo</Label>
                        <Select disabled>
                            <SelectTrigger><SelectValue placeholder="Todos os Dispositivos" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os Dispositivos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>País</Label>
                        <Select disabled>
                            <SelectTrigger><SelectValue placeholder="Todos os Países" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os Países</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="flex items-end">
                        <Button className="w-full" disabled>Aplicar Filtros</Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                         <div className="flex items-center gap-3">
                            <TrendingUp className="h-6 w-6 text-primary" />
                            <CardTitle className="font-headline">Análise de Tendência</CardTitle>
                        </div>
                        <CardDescription>Evolução da taxa de conversão geral ao longo do tempo.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground h-[250px] flex items-center justify-center">
                        <p>Nenhum dado de tendência disponível.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                         <div className="flex items-center gap-3">
                            <UserX className="h-6 w-6 text-primary" />
                            <CardTitle className="font-headline">Análise de Abandono</CardTitle>
                        </div>
                        <CardDescription>Sessões que saíram do funil antes de completar a compra.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sessão</TableHead>
                                    <TableHead>Última Etapa</TableHead>
                                    <TableHead>Última Página</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                               <TableRow>
                                   <TableCell colSpan={3} className="h-24 text-center">Nenhum abandono registrado.</TableCell>
                               </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Route className="h-6 w-6 text-primary" />
                        <CardTitle className="font-headline">Análise de Caminho</CardTitle>
                    </div>
                    <CardDescription>Em breve: visualize o caminho completo que os usuários percorreram antes de abandonar o funil.</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground p-8">
                   <p>Gráficos e visualizações de caminho aparecerão aqui.</p>
                </CardContent>
            </Card>

        </div>
    </div>
  )
}
