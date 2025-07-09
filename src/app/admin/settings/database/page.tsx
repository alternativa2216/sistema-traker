import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Database, Wrench } from "lucide-react";

export default function DatabaseSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Configuração do Banco de Dados</h1>
        <p className="text-muted-foreground">Status e gerenciamento da conexão com o banco de dados.</p>
      </div>

      <Card>
        <CardHeader>
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Gerenciamento do Banco de Dados</CardTitle>
            </div>
        </CardHeader>
        <CardContent>
          <CardDescription>
            A configuração inicial do banco de dados agora é feita através da página de instalação.
            Esta página serve para confirmar que as credenciais do ambiente estão funcionando.
            As credenciais devem ser definidas nas variáveis de ambiente do seu servidor (ex: .env.local).
          </CardDescription>

          <div className="mt-6 border-t pt-6">
             <Button asChild>
                <Link href="/install">
                  <Wrench className="mr-2 h-4 w-4"/>
                  Ir para a Página de Instalação/Reparo
                </Link>
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
