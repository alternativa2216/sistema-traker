import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Faturamento</h1>
        <p className="text-muted-foreground">Gerencie sua assinatura e veja o histórico de pagamentos.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Em Construção</CardTitle>
          <CardDescription>Esta página está em desenvolvimento. Volte em breve para gerenciar seus detalhes de faturamento.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Seu plano atual, faturas e métodos de pagamento aparecerão aqui.</p>
        </CardContent>
      </Card>
    </div>
  );
}
