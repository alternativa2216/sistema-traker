'use client'

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { getCurrentUserAction, saveNotificationSettingsAction } from '@/app/actions/user';


const notificationOptions = [
    { id: 'weeklyReport', label: "Relatório Semanal de Desempenho", description: "Receba um resumo do desempenho do seu site toda segunda-feira.", defaultChecked: true },
    { id: 'securityAlerts', label: "Alertas Críticos de Segurança", description: "Seja notificado imediatamente sobre atividades suspeitas ou bloqueios importantes.", defaultChecked: true },
    { id: 'aiInsights', label: "Novos Insights da IA", description: "Receba um e-mail quando nossa IA encontrar novas oportunidades de otimização.", defaultChecked: false },
    { id: 'productUpdates', label: "Atualizações do Produto", description: "Fique por dentro de novas funcionalidades e melhorias na plataforma.", defaultChecked: false }
];

export default function NotificationSettingsPage() {
    const { toast } = useToast();
    const [settings, setSettings] = React.useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        async function fetchSettings() {
            setIsLoading(true);
            try {
                const user = await getCurrentUserAction();
                const initialSettings: Record<string, boolean> = {};
                notificationOptions.forEach(opt => {
                    initialSettings[opt.id] = user.notificationSettings[opt.id] ?? opt.defaultChecked;
                });
                setSettings(initialSettings);
            } catch (error: any) {
                toast({ title: "Erro ao carregar", description: error.message, variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        }
        fetchSettings();
    }, [toast]);

    const handleSettingChange = (id: string, value: boolean) => {
        setSettings(prev => ({ ...prev, [id]: value }));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            await saveNotificationSettingsAction(settings);
            toast({ title: "Sucesso!", description: "Suas preferências de notificação foram salvas." });
        } catch (error: any) {
            toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };
    
    if (isLoading) {
        return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold font-headline">Notificações</h1>
        <p className="text-muted-foreground">Escolha como e quando você recebe nossas notificações.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Notificações por E-mail</CardTitle>
          <CardDescription>Selecione quais e-mails você gostaria de receber.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           {notificationOptions.map(opt => (
             <div key={opt.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor={opt.id} className="text-base">{opt.label}</Label>
                    <p className="text-sm text-muted-foreground">{opt.description}</p>
                </div>
                <Switch 
                    id={opt.id} 
                    checked={settings[opt.id]} 
                    onCheckedChange={(val) => handleSettingChange(opt.id, val)}
                />
            </div>
           ))}
        </CardContent>
        <CardFooter>
            <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                Salvar Preferências
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
