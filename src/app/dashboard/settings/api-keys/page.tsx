import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, KeyRound, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ApiKeysSettingsPage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold font-headline">Chaves de API</h1>
        <p className="text-muted-foreground">Gerencie chaves de API para integrar o Tracklytics com outros serviços.</p>
      </div>
      
      <Alert>
        <KeyRound className="h-4 w-4" />
        <AlertTitle>Funcionalidade em Breve</AlertTitle>
        <AlertDescription>
          O gerenciamento de chaves de API é uma funcionalidade dos planos Pro e Empresarial que estará disponível em breve.
        </AlertDescription>
      </Alert>

      <Card className="opacity-50 pointer-events-none">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-headline">Suas Chaves de API</CardTitle>
              <CardDescription>Use estas chaves para acesso programático à sua conta.</CardDescription>
            </div>
            <Button disabled>
              <Plus className="mr-2 h-4 w-4" />
              Gerar Nova Chave
            </Button>
          </div>
        </CardHeader>
        <CardContent>
           <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Label</TableHead>
                    <TableHead>Chave</TableHead>
                    <TableHead>Criada em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Chave para Script de BI</TableCell>
                    <TableCell className="font-mono">trk_...a4b2</TableCell>
                    <TableCell>2 dias atrás</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" disabled>
                          <Trash2 className="h-4 w-4" />
                       </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
