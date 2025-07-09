import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DatabaseSettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Configuração do Banco de Dados</h1>
        <p className="text-muted-foreground">Esta seção é para administradores.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Acesso Restrito</CardTitle>
          <CardDescription>A configuração do banco de dados é gerenciada pelo administrador da plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Nenhuma ação é necessária aqui.</p>
        </CardContent>
      </Card>
    </div>
  );
}
