import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Configurações da Plataforma</h1>
        <p className="text-muted-foreground">Configure as configurações globais para o Tracklytics.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Em Construção</CardTitle>
          <CardDescription>Esta página está em desenvolvimento. Esta área poderosa permitirá que você configure preços, chaves de API (gateways de pagamento, serviços de IA) и outras funcionalidades centrais da plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Formulários para gerenciar as configurações da plataforma estarão disponíveis aqui.</p>
        </CardContent>
      </Card>
    </div>
  );
}
