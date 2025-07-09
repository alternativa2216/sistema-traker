import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminHealthPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Saúde do Sistema</h1>
        <p className="text-muted-foreground">Monitore a saúde técnica da plataforma.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Em Construção</CardTitle>
          <CardDescription>Esta página está em desenvolvimento. Em breve, você poderá monitorar conexões de banco de dados, tempos de resposta de API e outras métricas críticas do sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Gráficos de saúde do sistema e indicadores de status aparecerão aqui.</p>
        </CardContent>
      </Card>
    </div>
  );
}
