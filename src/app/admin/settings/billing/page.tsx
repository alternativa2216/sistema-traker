'use client'

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function BillingSettingsPage() {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = React.useState(false);

    // Gateway State
    const [gatewayEnabled, setGatewayEnabled] = React.useState(true);
    const [publicKey, setPublicKey] = React.useState('pk_live_...');
    const [secretKey, setSecretKey] = React.useState('sk_live_...');
    
    // Plans State
    const [freePlanFeatures, setFreePlanFeatures] = React.useState([
        "1 Projeto",
        "10.000 visualizações de página/mês",
        "Análises Básicas",
        "Retenção de dados por 7 dias",
    ].join('\n'));

    const [proPlanPrice, setProPlanPrice] = React.useState('29');
    const [proPlanFeatures, setProPlanFeatures] = React.useState([
        "10 Projetos",
        "200.000 visualizações de página/mês",
        "Suíte de Segurança e Cloaker",
        "Todas as Ferramentas de IA",
        "Análise de Funil e Tempo Real",
        "Retenção de dados por 1 ano",
    ].join('\n'));

    const handleSave = () => {
        setIsSaving(true);
        // In a real app, this would make API calls to securely save the credentials and plan info
        setTimeout(() => {
            toast({
                title: "Configurações Salvas",
                description: "Suas configurações de faturamento e planos foram atualizadas."
            });
            setIsSaving(false);
        }, 1500);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Faturamento e Planos</h1>
                <p className="text-muted-foreground">Gerencie sua integração de pagamento e os detalhes dos seus planos de assinatura.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Gateway de Pagamento (Nova Era)</CardTitle>
                    <CardDescription>Conecte sua conta do gateway de pagamento para processar as assinaturas.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="gateway-enabled" className="text-base">Ativar Gateway de Pagamento</Label>
                            <p className="text-sm text-muted-foreground">Desative para impedir novas assinaturas e pagamentos.</p>
                        </div>
                        <Switch id="gateway-enabled" checked={gatewayEnabled} onCheckedChange={setGatewayEnabled} />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="public-key">Chave Pública (Public Key)</Label>
                            <Input id="public-key" value={publicKey} onChange={(e) => setPublicKey(e.target.value)} type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="secret-key">Chave Secreta (Secret Key)</Label>
                            <Input id="secret-key" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} type="password" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Plano Grátis</CardTitle>
                        <CardDescription>Configure os recursos disponíveis para usuários gratuitos.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="free-features">Recursos (um por linha)</Label>
                            <Textarea
                                id="free-features"
                                value={freePlanFeatures}
                                onChange={(e) => setFreePlanFeatures(e.target.value)}
                                rows={6}
                            />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                     <CardHeader>
                        <CardTitle className="font-headline">Plano Pro</CardTitle>
                        <CardDescription>Defina o preço e os recursos do seu principal plano pago.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="pro-price">Preço (em R$)</Label>
                            <Input 
                                id="pro-price"
                                type="number"
                                value={proPlanPrice}
                                onChange={(e) => setProPlanPrice(e.target.value)}
                                placeholder="29"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pro-features">Recursos (um por linha)</Label>
                            <Textarea
                                id="pro-features"
                                value={proPlanFeatures}
                                onChange={(e) => setProPlanFeatures(e.target.value)}
                                rows={6}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Todas as Configurações
                </Button>
            </div>
        </div>
    );
}
