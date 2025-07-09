import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Relatórios de IA</h1>
        <p className="text-muted-foreground">Gere e visualize relatórios de desempenho completos.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Em Construção</CardTitle>
          <CardDescription>Esta página está em desenvolvimento. Em breve, você poderá gerar relatórios de desempenho detalhados e alimentados por IA.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Seus relatórios gerados serão listados aqui.</p>
        </CardContent>
      </Card>
    </div>
  );
}
