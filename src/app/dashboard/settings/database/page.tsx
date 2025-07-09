import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

export default function DatabaseSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Configuração do Banco de Dados</h1>
        <p className="text-muted-foreground">Conecte seu banco de dados para armazenar e analisar seus dados.</p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Selecione seu Banco de Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="mysql">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="mysql">MySQL</TabsTrigger>
              <TabsTrigger value="sqlserver" disabled>SQLServer</TabsTrigger>
              <TabsTrigger value="mongodb" disabled>MongoDB</TabsTrigger>
              <TabsTrigger value="redis" disabled>Redis</TabsTrigger>
              <TabsTrigger value="pgsql" disabled>PgSQL</TabsTrigger>
            </TabsList>
            <TabsContent value="mysql" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Credenciais do MySQL</CardTitle>
                  <CardDescription>
                    Forneça os detalhes de conexão para seu banco de dados MySQL. As informações são armazenadas de forma segura.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="host">Host</Label>
                      <Input id="host" placeholder="127.0.0.1" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="port">Porta</Label>
                      <Input id="port" placeholder="3306" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="database">Nome do Banco de Dados</Label>
                    <Input id="database" placeholder="tracklytics_db" />
                  </div>
                   <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="user">Usuário</Label>
                      <Input id="user" placeholder="root" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input id="password" type="password" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="auto-backup" className="text-base">Backup Automático do Banco de Dados</Label>
                        <p className="text-sm text-muted-foreground">
                            Após adicionar um banco de dados, você pode ativar o backup automático para garantir a segurança dos dados.
                        </p>
                    </div>
                    <Switch id="auto-backup" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Testar Conexão</Button>
                    <Button>Salvar</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
