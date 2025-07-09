import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ProjectsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Projetos</h1>
        <p className="text-muted-foreground">Gerencie todos os seus sites rastreados.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Em Construção</CardTitle>
          <CardDescription>Esta página está em desenvolvimento. Em breve você poderá adicionar, editar e gerenciar seus projetos aqui.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Uma lista dos seus projetos aparecerá aqui.</p>
        </CardContent>
      </Card>
    </div>
  );
}
