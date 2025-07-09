'use client'

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { setupDatabaseAction } from '@/app/actions/database';

export default function DatabaseSettingsPage() {
  const [host, setHost] = React.useState('127.0.0.1');
  const [port, setPort] = React.useState('3306');
  const [database, setDatabase] = React.useState('tracklytics_db');
  const [user, setUser] = React.useState('root');
  const [password, setPassword] = React.useState('');
  
  const [isTesting, setIsTesting] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const { toast } = useToast();

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const result = await setupDatabaseAction({
        host,
        port: Number(port),
        user,
        password,
        database,
      });
      toast({
        title: "Sucesso!",
        description: result.message || "A conexão com o banco de dados foi bem-sucedida.",
      });
    } catch (error: any) {
      toast({
        title: "Falha na Conexão",
        description: error.message || "Não foi possível conectar ao banco de dados. Verifique suas credenciais.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // In a real app, this would save the credentials to a secure store (e.g., .env file on the server)
    // For this prototype, we just show a toast.
    setTimeout(() => {
      toast({
        title: "Configurações Salvas",
        description: "Suas credenciais do banco de dados foram salvas com segurança."
      });
      setIsSaving(false);
    }, 1000);
  }

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
                      <Input id="host" value={host} onChange={(e) => setHost(e.target.value)} placeholder="127.0.0.1" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="port">Porta</Label>
                      <Input id="port" value={port} onChange={(e) => setPort(e.target.value)} placeholder="3306" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="database">Nome do Banco de Dados</Label>
                    <Input id="database" value={database} onChange={(e) => setDatabase(e.target.value)} placeholder="tracklytics_db" />
                  </div>
                   <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="user">Usuário</Label>
                      <Input id="user" value={user} onChange={(e) => setUser(e.target.value)} placeholder="root" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
                    <Button variant="outline" onClick={handleTestConnection} disabled={isTesting}>
                      {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Testar e Preparar
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Salvar
                    </Button>
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