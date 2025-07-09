import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminSecurityPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Segurança</h1>
        <p className="text-muted-foreground">Monitore eventos e logs relacionados à segurança.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Em Construção</CardTitle>
          <CardDescription>Esta página está em desenvolvimento. Aqui você poderá visualizar sessões de login ativas, auditar ações importantes e monitorar atividades suspeitas.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Logs de segurança e ferramentas de gerenciamento de sessão aparecerão aqui.</p>
        </CardContent>
      </Card>
    </div>
  );
}
