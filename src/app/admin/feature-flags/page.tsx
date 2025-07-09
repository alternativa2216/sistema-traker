import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminFeatureFlagsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Flags de Funcionalidades</h1>
        <p className="text-muted-foreground">Controle a disponibilidade de funcionalidades em diferentes planos.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Em Construção</CardTitle>
          <CardDescription>Esta página está em desenvolvimento. Aqui você poderá habilitar ou desabilitar funcionalidades específicas para os planos Grátis e Pro, dando-lhe controle total sobre sua estratégia de monetização.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Uma lista de funcionalidades alternáveis aparecerá aqui.</p>
        </CardContent>
      </Card>
    </div>
  );
}
