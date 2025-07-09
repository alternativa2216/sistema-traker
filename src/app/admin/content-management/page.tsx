'use client'

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

export default function ContentManagementPage() {
    const { toast } = useToast();

    // Mock state for home page content
    const [homeHeadline, setHomeHeadline] = React.useState('Analytics que Transforma Dados em Decisões de Alto Impacto');
    const [homeSubheadline, setHomeSubheadline] = React.useState('O Tracklytics é a única plataforma de web analytics que combina rastreamento completo, insights proativos com IA, uma suíte de segurança avançada e ferramentas visuais para você dominar sua estratégia digital.');
    const [dashboardImageUrl, setDashboardImageUrl] = React.useState('https://placehold.co/1200x600.png');

    // Mock state for register page content
    const [registerImageUrl, setRegisterImageUrl] = React.useState('https://placehold.co/1200x1800.png');
    const [registerBenefits, setRegisterBenefits] = React.useState([
        "Análise de Funil Visual para identificar gargalos",
        "Insights e Alertas Proativos com Inteligência Artificial",
        "Suíte de Segurança completa com Cloaker e Filtros",
        "Analytics em Tempo Real e Ferramentas para Ads",
    ].join('\n'));

    const handleSaveChanges = () => {
        // In a real application, this would trigger an API call to save the data to a database.
        toast({
            title: "Salvo com sucesso!",
            description: "O conteúdo das páginas públicas foi atualizado.",
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Gerenciamento de Conteúdo</h1>
                <p className="text-muted-foreground">Edite os textos e imagens das páginas públicas do seu site.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Página Inicial</CardTitle>
                    <CardDescription>Controle o conteúdo da sua principal landing page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="home-headline">Título Principal</Label>
                        <Input id="home-headline" value={homeHeadline} onChange={(e) => setHomeHeadline(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="home-subheadline">Subtítulo</Label>
                        <Textarea id="home-subheadline" value={homeSubheadline} onChange={(e) => setHomeSubheadline(e.target.value)} rows={4} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="dashboard-image">URL da Imagem do Dashboard</Label>
                        <Input id="dashboard-image" value={dashboardImageUrl} onChange={(e) => setDashboardImageUrl(e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Página de Registro</CardTitle>
                    <CardDescription>Edite a imagem de fundo e a lista de benefícios.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label htmlFor="register-image">URL da Imagem de Fundo</Label>
                        <Input id="register-image" value={registerImageUrl} onChange={(e) => setRegisterImageUrl(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="register-benefits">Lista de Benefícios</Label>
                        <Textarea id="register-benefits" value={registerBenefits} onChange={(e) => setRegisterBenefits(e.target.value)} rows={5} />
                         <p className="text-xs text-muted-foreground">Coloque um benefício por linha.</p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSaveChanges}>Salvar Alterações</Button>
            </div>
        </div>
    );
}
