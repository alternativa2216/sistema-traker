'use client'

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { getSettingsAction, saveSettingsAction } from '@/app/actions/settings';
import { Loader2 } from 'lucide-react';

const defaultContent = {
    homeHeadline: 'Analytics que Transforma Dados em Decisões de Alto Impacto',
    homeSubheadline: 'O Tracklytics é a única plataforma de web analytics que combina rastreamento completo, insights proativos com IA, uma suíte de segurança avançada e ferramentas visuais para você dominar sua estratégia digital.',
    dashboardImageUrl: 'https://placehold.co/1200x600.png',
    registerImageUrl: 'https://placehold.co/1200x1800.png',
    registerBenefits: [
        "Análise de Funil Visual para identificar gargalos",
        "Insights e Alertas Proativos com Inteligência Artificial",
        "Suíte de Segurança completa com Cloaker e Filtros",
        "Analytics em Tempo Real e Ferramentas para Ads",
    ].join('\n'),
};

type ContentKeys = keyof typeof defaultContent;

export default function ContentManagementPage() {
    const { toast } = useToast();
    const [content, setContent] = React.useState(defaultContent);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            try {
                const settingsKeys = Object.keys(defaultContent);
                const fetchedSettings = await getSettingsAction(settingsKeys);
                
                // Merge fetched settings with defaults, ensuring all keys are present
                const newContent: Record<string, any> = {};
                for (const key of settingsKeys) {
                    newContent[key] = fetchedSettings[key] ?? defaultContent[key as ContentKeys];
                }
                setContent(newContent as typeof defaultContent);

            } catch (error: any) {
                toast({ title: "Erro ao carregar conteúdo", description: error.message, variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchContent();
    }, [toast]);

    const handleInputChange = (key: ContentKeys, value: string) => {
        setContent(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            // Prepare data for saving: values are stringified JSON.
            const dataToSave: Record<string, string> = {};
            for (const key in content) {
                 dataToSave[key] = content[key as ContentKeys];
            }
            await saveSettingsAction(dataToSave);
            toast({
                title: "Salvo com sucesso!",
                description: "O conteúdo das páginas públicas foi atualizado.",
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
                <h1 className="text-3xl font-bold font-headline">Gerenciamento de Conteúdo</h1>
                <p className="text-muted-foreground">Edite os textos e imagens das páginas públicas do seu site. Os dados são salvos no banco de dados.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Página Inicial</CardTitle>
                    <CardDescription>Controle o conteúdo da sua principal landing page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="home-headline">Título Principal</Label>
                        <Textarea id="home-headline" value={content.homeHeadline} onChange={(e) => handleInputChange('homeHeadline', e.target.value)} rows={3} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="home-subheadline">Subtítulo</Label>
                        <Textarea id="home-subheadline" value={content.homeSubheadline} onChange={(e) => handleInputChange('homeSubheadline', e.target.value)} rows={4} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="dashboard-image">URL da Imagem do Dashboard</Label>
                        <Input id="dashboard-image" value={content.dashboardImageUrl} onChange={(e) => handleInputChange('dashboardImageUrl', e.target.value)} />
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
                        <Input id="register-image" value={content.registerImageUrl} onChange={(e) => handleInputChange('registerImageUrl', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="register-benefits">Lista de Benefícios</Label>
                        <Textarea id="register-benefits" value={content.registerBenefits} onChange={(e) => handleInputChange('registerBenefits', e.target.value)} rows={5} />
                         <p className="text-xs text-muted-foreground">Coloque um benefício por linha.</p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Alterações
                </Button>
            </div>
        </div>
    );
}
