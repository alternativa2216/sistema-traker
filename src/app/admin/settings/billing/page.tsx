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
import { getSettingsAction, saveSettingsAction } from '@/app/actions/settings';

const defaultSettings = {
    billingEnabled: true,
    paymentGatewayPublicKey: '',
    paymentGatewaySecretKey: '',
    freePlanFeatures: [
        "1 Projeto",
        "10.000 visualizações de página/mês",
        "Análises Básicas",
        "Retenção de dados por 7 dias",
    ].join('\n'),
    proPlanPrice: '29',
    proPlanFeatures: [
        "10 Projetos",
        "200.000 visualizações de página/mês",
        "Suíte de Segurança e Cloaker",
        "Todas as Ferramentas de IA",
        "Análise de Funil e Tempo Real",
        "Retenção de dados por 1 ano",
    ].join('\n'),
};

type SettingsKeys = keyof typeof defaultSettings;

export default function BillingSettingsPage() {
    const { toast } = useToast();
    const [settings, setSettings] = React.useState(defaultSettings);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const settingsKeys = Object.keys(defaultSettings);
                const fetchedSettings = await getSettingsAction(settingsKeys);
                
                const newSettings: Record<string, any> = {};
                for (const key of settingsKeys) {
                    newSettings[key] = fetchedSettings[key] ?? defaultSettings[key as SettingsKeys];
                }
                setSettings(newSettings as typeof defaultSettings);

            } catch (error: any) {
                toast({ title: "Erro ao carregar configurações", description: error.message, variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, [toast]);
    
    const handleInputChange = (key: SettingsKeys, value: string | boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveSettingsAction(settings);
            toast({
                title: "Configurações Salvas",
                description: "Suas configurações de faturamento e planos foram atualizadas."
            });
        } catch (error: any) {
            toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };
    
    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Faturamento e Planos</h1>
                <p className="text-muted-foreground">Gerencie sua integração de pagamento e os detalhes dos seus planos de assinatura.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Gateway de Pagamento</CardTitle>
                    <CardDescription>Conecte sua conta do gateway de pagamento para processar as assinaturas.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="gateway-enabled" className="text-base">Ativar Gateway de Pagamento</Label>
                            <p className="text-sm text-muted-foreground">Desative para impedir novas assinaturas e pagamentos.</p>
                        </div>
                        <Switch id="gateway-enabled" checked={settings.billingEnabled} onCheckedChange={(val) => handleInputChange('billingEnabled', val)} />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="public-key">Chave Pública (Public Key)</Label>
                            <Input id="public-key" value={settings.paymentGatewayPublicKey} onChange={(e) => handleInputChange('paymentGatewayPublicKey', e.target.value)} type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="secret-key">Chave Secreta (Secret Key)</Label>
                            <Input id="secret-key" value={settings.paymentGatewaySecretKey} onChange={(e) => handleInputChange('paymentGatewaySecretKey', e.target.value)} type="password" />
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
                                value={settings.freePlanFeatures}
                                onChange={(e) => handleInputChange('freePlanFeatures', e.target.value)}
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
                                value={settings.proPlanPrice}
                                onChange={(e) => handleInputChange('proPlanPrice', e.target.value)}
                                placeholder="29"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pro-features">Recursos (um por linha)</Label>
                            <Textarea
                                id="pro-features"
                                value={settings.proPlanFeatures}
                                onChange={(e) => handleInputChange('proPlanFeatures', e.target.value)}
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
