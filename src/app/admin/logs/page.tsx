import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminLogsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Logs do Sistema</h1>
        <p className="text-muted-foreground">Visualize logs de aplicação e do sistema.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Em Construção</CardTitle>
          <CardDescription>Esta página está em desenvolvimento. Em breve você terá acesso a um visualizador de logs para depuração e monitoramento da atividade da plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Um feed ao vivo dos logs do sistema aparecerá aqui.</p>
        </CardContent>
      </Card>
    </div>
  );
}
