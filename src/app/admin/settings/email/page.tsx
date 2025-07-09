'use client'

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Code } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { testSmtpConnectionAction } from '@/app/actions/email';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function EmailSettingsPage() {
  // SMTP Form State
  const [host, setHost] = React.useState('');
  const [port, setPort] = React.useState('587');
  const [secure, setSecure] = React.useState(false);
  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fromName, setFromName] = React.useState('Tracklytics');
  const [fromEmail, setFromEmail] = React.useState('nao-responda@tracklytics.com');
  const [testEmail, setTestEmail] = React.useState('');

  // Template State
  const [recoveryTemplate, setRecoveryTemplate] = React.useState('Olá {{userName}},\n\nPara redefinir sua senha, clique no link abaixo:\n{{resetLink}}\n\nSe você não solicitou isso, ignore este e-mail.\n\nAtenciosamente,\nEquipe Tracklytics');
  const [invoiceTemplate, setInvoiceTemplate] = React.useState('Olá {{userName}},\n\nSua fatura de {{month}} já está disponível para pagamento.\n\nAcesse seu painel para mais detalhes.\n\nAtenciosamente,\nEquipe Tracklytics');
  
  const [isTesting, setIsTesting] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const { toast } = useToast();

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const result = await testSmtpConnectionAction({
        host,
        port: Number(port),
        secure,
        user,
        pass: password,
        fromName,
        fromEmail,
        testEmail
      });
      toast({
        title: "Sucesso!",
        description: result.message,
      });
    } catch (error: any) {
      toast({
        title: "Falha na Conexão SMTP",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // In a real app, save credentials and templates securely
    setTimeout(() => {
      toast({
        title: "Configurações Salvas",
        description: "Suas configurações de e-mail foram salvas."
      });
      setIsSaving(false);
    }, 1000);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Configurações de E-mail</h1>
        <p className="text-muted-foreground">Configure seu servidor SMTP para o envio de e-mails transacionais.</p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Configuração do Servidor SMTP</CardTitle>
            <CardDescription>
                Forneça as credenciais do seu serviço de envio de e-mail (ex: Amazon SES, SendGrid, Mailgun).
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="host">Host</Label>
                    <Input id="host" value={host} onChange={(e) => setHost(e.target.value)} placeholder="smtp.example.com" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="port">Porta</Label>
                    <Input id="port" value={port} onChange={(e) => setPort(e.target.value)} placeholder="587" />
                </div>
            </div>
             <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="user">Usuário</Label>
                    <Input id="user" value={user} onChange={(e) => setUser(e.target.value)} placeholder="seu_usuario_smtp" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
            </div>
             <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="fromName">Nome do Remetente</Label>
                    <Input id="fromName" value={fromName} onChange={(e) => setFromName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="fromEmail">E-mail do Remetente</Label>
                    <Input id="fromEmail" type="email" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} />
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="secure-switch" checked={secure} onCheckedChange={setSecure} />
                <Label htmlFor="secure-switch">Usar conexão segura (TLS/SSL)</Label>
            </div>
            <div className="rounded-lg border p-4 space-y-4">
                <h3 className="font-semibold">Testar Configuração</h3>
                <div className="space-y-2">
                    <Label htmlFor="test-email">E-mail de Destino</Label>
                    <Input id="test-email" type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="seu-email@dominio.com" />
                </div>
                 <Button variant="outline" onClick={handleTestConnection} disabled={isTesting || !testEmail}>
                    {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Testar Envio
                </Button>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Layouts de E-mail</CardTitle>
          <CardDescription>Edite o conteúdo dos e-mails automáticos enviados pela plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
            <Alert>
                <Code className="h-4 w-4" />
                <AlertTitle>Placeholders Disponíveis</AlertTitle>
                <AlertDescription>
                    Use placeholders como <code>{{placeholder}}</code> para inserir dados dinâmicos no corpo do e-mail.
                </AlertDescription>
            </Alert>
            <Tabs defaultValue="recovery" className="mt-6">
                <TabsList>
                    <TabsTrigger value="recovery">Recuperação de Senha</TabsTrigger>
                    <TabsTrigger value="invoice">Aviso de Fatura</TabsTrigger>
                    <TabsTrigger value="welcome" disabled>Boas-vindas</TabsTrigger>
                </TabsList>
                <TabsContent value="recovery" className="mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="recovery-template">Corpo do E-mail</Label>
                        <Textarea 
                            id="recovery-template" 
                            value={recoveryTemplate}
                            onChange={(e) => setRecoveryTemplate(e.target.value)}
                            rows={8}
                        />
                        <p className="text-xs text-muted-foreground">Placeholders disponíveis: <code>{{userName}}</code>, <code>{{resetLink}}</code></p>
                    </div>
                </TabsContent>
                <TabsContent value="invoice" className="mt-4">
                     <div className="space-y-2">
                        <Label htmlFor="invoice-template">Corpo do E-mail</Label>
                        <Textarea 
                            id="invoice-template" 
                            value={invoiceTemplate}
                            onChange={(e) => setInvoiceTemplate(e.target.value)}
                            rows={8}
                        />
                        <p className="text-xs text-muted-foreground">Placeholders disponíveis: <code>{{userName}}</code>, <code>{{invoiceLink}}</code>, <code>{{month}}</code></p>
                    </div>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Todas as Configurações
        </Button>
      </div>
    </div>
  )
}
