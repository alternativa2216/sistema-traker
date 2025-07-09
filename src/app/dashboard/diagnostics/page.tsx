import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DiagnosticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Diagnósticos</h1>
        <p className="text-muted-foreground">Monitore a saúde do seu site e rastreie erros.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Em Construção</CardTitle>
          <CardDescription>Esta página está em desenvolvimento. Em breve, você poderá rastrear erros de Javascript e outras métricas de saúde do site.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Um registro de erros do site e problemas de desempenho será exibido aqui.</p>
        </CardContent>
      </Card>
    </div>
  );
}
