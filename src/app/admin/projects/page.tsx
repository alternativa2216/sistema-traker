import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminProjectsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Gerenciamento de Projetos</h1>
        <p className="text-muted-foreground">Supervisione todos os projetos criados na plataforma.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Em Construção</CardTitle>
          <CardDescription>Esta página está em desenvolvimento. Em breve você poderá visualizar e gerenciar todos os projetos de usuários a partir de um local centralizado.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Uma tabela de todos os projetos aparecerá aqui.</p>
        </CardContent>
      </Card>
    </div>
  );
}
