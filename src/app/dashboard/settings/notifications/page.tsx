import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const NotificationSetting = ({ id, label, description, defaultChecked = false }: { id: string, label: string, description: string, defaultChecked?: boolean }) => (
    <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
            <Label htmlFor={id} className="text-base">{label}</Label>
            <p className="text-sm text-muted-foreground">
                {description}
            </p>
        </div>
        <Switch id={id} defaultChecked={defaultChecked} />
    </div>
);


export default function NotificationSettingsPage() {
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
            <NotificationSetting 
                id="weekly-report"
                label="Relatório Semanal de Desempenho"
                description="Receba um resumo do desempenho do seu site toda segunda-feira."
                defaultChecked={true}
            />
            <NotificationSetting 
                id="security-alerts"
                label="Alertas Críticos de Segurança"
                description="Seja notificado imediatamente sobre atividades suspeitas ou bloqueios importantes."
                defaultChecked={true}
            />
             <NotificationSetting 
                id="ai-insights"
                label="Novos Insights da IA"
                description="Receba um e-mail quando nossa IA encontrar novas oportunidades de otimização."
            />
             <NotificationSetting 
                id="product-updates"
                label="Atualizações do Produto"
                description="Fique por dentro de novas funcionalidades e melhorias na plataforma."
            />
        </CardContent>
        <CardFooter>
            <Button>Salvar Preferências</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
