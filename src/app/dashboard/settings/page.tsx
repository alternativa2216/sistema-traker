import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Configurações</h1>
        <p className="text-muted-foreground">Configure sua conta e preferências de rastreamento.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Em Construção</CardTitle>
          <CardDescription>Esta página está em desenvolvimento. Em breve, você poderá gerenciar seu perfil, senha e configurações específicas do projeto aqui, incluindo a recuperação do seu código de rastreamento.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>As configurações da conta e de rastreamento estarão disponíveis aqui.</p>
        </CardContent>
      </Card>
    </div>
  );
}
