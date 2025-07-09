import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminUsersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Gerenciamento de Usuários</h1>
        <p className="text-muted-foreground">Visualize, edite e gerencie todos os usuários da plataforma.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Em Construção</CardTitle>
          <CardDescription>Esta página está em desenvolvimento. Em breve, você poderá gerenciar todos os usuários, alterar seus planos e se passar por eles para fins de suporte.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Uma tabela de todos os usuários registrados aparecerá aqui.</p>
        </CardContent>
      </Card>
    </div>
  );
}
