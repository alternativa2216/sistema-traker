'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Database, CheckCircle, AlertTriangle, Play, ShieldCheck, Save } from 'lucide-react';
import { installDatabaseAction, testDbConnectionAction, saveDbCredentialsAction } from '@/app/actions/install';
import { Logo } from '@/components/shared/logo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function InstallPage() {
    // Form state
    const [host, setHost] = React.useState('localhost');
    const [port, setPort] = React.useState('3306');
    const [user, setUser] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [database, setDatabase] = React.useState('');

    // Action states
    const [isTesting, setIsTesting] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const [isInstalling, setIsInstalling] = React.useState(false);

    // Result states
    const [testResult, setTestResult] = React.useState<{ success: boolean; message: string } | null>(null);
    const [connectionOk, setConnectionOk] = React.useState(false);
    
    const { toast } = useToast();

    const getCredentials = () => ({
        host,
        port: Number(port) || 3306,
        user,
        password,
        database,
    });

    const handleTestConnection = async () => {
        setIsTesting(true);
        setTestResult(null);
        setConnectionOk(false);
        try {
            const res = await testDbConnectionAction(getCredentials());
            setTestResult(res);
            if (res.success) {
                setConnectionOk(true);
                toast({ title: "Sucesso!", description: res.message });
            } else {
                 toast({ title: "Erro de Conexão", description: res.message, variant: "destructive" });
            }
        } catch (error: any) {
            const errorMessage = error.message || "Ocorreu um erro desconhecido.";
            setTestResult({ success: false, message: errorMessage });
            toast({ title: "Erro de Conexão", description: errorMessage, variant: "destructive" });
        } finally {
            setIsTesting(false);
        }
    };
    
    const handleSaveCredentials = async () => {
        setIsSaving(true);
        try {
            const res = await saveDbCredentialsAction(getCredentials());
            toast({ title: "Sucesso!", description: res.message });
        } catch (error: any) {
            toast({ title: "Erro ao Salvar", description: error.message, variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleInstall = async () => {
        setIsInstalling(true);
        try {
            const res = await installDatabaseAction(getCredentials());
            toast({ title: "Sucesso!", description: res.message });
        } catch (error: any) {
            toast({ title: "Erro na Instalação", description: error.message, variant: "destructive" });
        } finally {
            setIsInstalling(false);
        }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
               <Database className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">Instalação e Reparo</CardTitle>
            <CardDescription>
              Use este assistente para configurar e instalar o banco de dados da sua aplicação.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Step 1: Credentials */}
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">1</div>
                    <CardTitle className="font-headline">Credenciais do Banco de Dados</CardTitle>
                </div>
                <CardDescription className="pl-11">Insira as informações de conexão do seu banco de dados MySQL.</CardDescription>
            </CardHeader>
            <CardContent className="pl-11 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="host">Host</Label>
                        <Input id="host" value={host} onChange={(e) => setHost(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="port">Porta</Label>
                        <Input id="port" value={port} onChange={(e) => setPort(e.target.value)} />
                    </div>
                </div>
                 <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="database">Nome do Banco (Database)</Label>
                        <Input id="database" value={database} onChange={(e) => setDatabase(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="user">Usuário</Label>
                        <Input id="user" value={user} onChange={(e) => setUser(e.target.value)} />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
            </CardContent>
        </Card>

        {/* Step 2: Test and Save */}
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">2</div>
                    <CardTitle className="font-headline">Testar e Salvar</CardTitle>
                </div>
                <CardDescription className="pl-11">
                    Teste a conexão com as credenciais acima. Se funcionar, salve-as no arquivo <code>.env</code> para uso futuro.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-11">
                <div className="flex flex-wrap gap-4">
                    <Button onClick={handleTestConnection} disabled={isTesting}>
                        {isTesting ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Testando...</>
                        ) : (
                            <><Play className="mr-2 h-4 w-4" /> Testar Conexão</>
                        )}
                    </Button>
                     <Button onClick={handleSaveCredentials} disabled={isSaving || !connectionOk}>
                        {isSaving ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
                        ) : (
                            <><Save className="mr-2 h-4 w-4" /> Salvar Credenciais no .env</>
                        )}
                    </Button>
                </div>
                {testResult && (
                    <Alert variant={testResult.success ? "default" : "destructive"} className={`mt-4 ${testResult.success ? 'border-green-500/50' : ''}`}>
                         {testResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                        <AlertTitle>{testResult.success ? "Conexão Bem-Sucedida" : "Falha na Conexão"}</AlertTitle>
                        <AlertDescription>{testResult.message}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>

        {/* Step 3: Install */}
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">3</div>
                    <CardTitle className="font-headline">Instalar Tabelas</CardTitle>
                </div>
                <CardDescription className="pl-11">
                    Após uma conexão bem-sucedida, clique aqui para criar as tabelas do sistema. Este processo é seguro e não substituirá tabelas existentes.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-11">
                <Button onClick={handleInstall} disabled={isInstalling || !connectionOk}>
                    {isInstalling ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Instalando...
                        </>
                    ) : (
                        <>
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Instalar Banco de Dados
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
