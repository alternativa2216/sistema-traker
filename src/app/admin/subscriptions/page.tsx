import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminSubscriptionsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Gerenciamento de Assinaturas</h1>
        <p className="text-muted-foreground">Visualize e gerencie todas as assinaturas ativas.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Em Construção</CardTitle>
          <CardDescription>Esta página está em desenvolvimento. Em breve você poderá ver todas as assinaturas ativas, em teste e canceladas.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Uma tabela de todas as assinaturas aparecerá aqui.</p>
        </CardContent>
      </Card>
    </div>
  );
}
