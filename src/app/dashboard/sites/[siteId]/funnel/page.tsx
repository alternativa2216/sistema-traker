'use client'

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDown, Filter, Users, Eye, ShoppingCart, CreditCard, TrendingUp, UserX, Route } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

const funnelData = {
  stages: [
    { name: 'Visitantes Totais', count: '25,840', icon: Users },
    { name: 'Visualizaram um Produto', count: '13,120', conversion: 50.8, icon: Eye },
    { name: 'Adicionaram ao Carrinho', count: '6,480', conversion: 49.4, icon: ShoppingCart },
    { name: 'Compra Concluída', count: '2,890', conversion: 44.6, icon: CreditCard },
  ],
  trendData: [
    { name: 'Semana 1', conversion: 10.5 },
    { name: 'Semana 2', conversion: 11.2 },
    { name: 'Semana 3', conversion: 11.1 },
    { name: 'Semana 4', conversion: 11.8 },
  ],
  dropOffs: [
    { session: 'xyz-123', lastStep: 'Visualizaram um Produto', lastPage: '/produto-a' },
    { session: 'abc-456', lastStep: 'Adicionaram ao Carrinho', lastPage: '/carrinho' },
    { session: 'def-789', lastStep: 'Visualizaram um Produto', lastPage: '/produto-b' },
  ],
};


export default function FunnelPage() {
  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Análise do Funil de Conversão</CardTitle>
                <CardDescription>Visualize a jornada do seu usuário e identifique gargalos de conversão.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="max-w-2xl mx-auto">
                    <div className="relative flex flex-col items-center">
                        {funnelData.stages.map((stage, index) => {
                            const Icon = stage.icon;
                            const isLastStage = index === funnelData.stages.length - 1;
                            
                            const baseWidth = 100;
                            const widthDecrement = 15;
                            const width = baseWidth - (index * widthDecrement);

                            return (
                                <React.Fragment key={stage.name}>
                                    <div
                                        className="bg-primary/10 border-x-2 border-t-2 border-primary/20 p-6 text-center shadow-inner"
                                        style={{ width: `${width}%` }}
                                    >
                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                            <div className="bg-background rounded-full p-3 border-2 border-primary/20">
                                                <Icon className="h-8 w-8 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-semibold text-foreground">{stage.name}</p>
                                                <p className="text-4xl font-bold font-headline text-foreground">{stage.count}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {!isLastStage && (
                                        <div 
                                            className="flex flex-col items-center justify-center h-24 bg-gradient-to-b from-primary/10 to-transparent"
                                            style={{ width: `${width - (widthDecrement / 2)}%` }}
                                        >
                                            <ArrowDown className="h-6 w-6 text-muted-foreground" />
                                            <Badge variant="secondary" className="mt-2 text-base">
                                                {funnelData.stages[index + 1].conversion}%
                                            </Badge>
                                            <p className="text-xs text-muted-foreground mt-1">Conversão</p>
                                        </div>
                                    )}

                                    {isLastStage && (
                                        <div 
                                            className="border-x-2 border-b-2 border-primary/20"
                                            style={{ width: `${width}%` }}
                                        ></div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
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
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Todas as Fontes" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as Fontes</SelectItem>
                                <SelectItem value="google">Google</SelectItem>
                                <SelectItem value="facebook">Facebook</SelectItem>
                                <SelectItem value="direct">Direto</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Dispositivo</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Todos os Dispositivos" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os Dispositivos</SelectItem>
                                <SelectItem value="desktop">Desktop</SelectItem>
                                <SelectItem value="mobile">Mobile</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>País</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Todos os Países" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os Países</SelectItem>
                                <SelectItem value="br">Brasil</SelectItem>
                                <SelectItem value="us">Estados Unidos</SelectItem>
                                <SelectItem value="pt">Portugal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="flex items-end">
                        <Button className="w-full">Aplicar Filtros</Button>
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
                    <CardContent>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={funnelData.trendData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis unit="%" />
                                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                                    <Line type="monotone" dataKey="conversion" stroke="hsl(var(--primary))" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
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
                                {funnelData.dropOffs.map(item => (
                                    <TableRow key={item.session}>
                                        <TableCell className="font-mono">{item.session}</TableCell>
                                        <TableCell>{item.lastStep}</TableCell>
                                        <TableCell>{item.lastPage}</TableCell>
                                    </TableRow>
                                ))}
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
