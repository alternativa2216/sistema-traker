'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Database, CheckCircle, AlertTriangle, Play, ShieldCheck } from 'lucide-react';
import { installDatabaseAction, testDbConnectionAction } from '@/app/actions/install';
import { Logo } from '@/components/shared/logo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function InstallPage() {
  const [isTesting, setIsTesting] = React.useState(false);
  const [isInstalling, setIsInstalling] = React.useState(false);
  
  const [testResult, setTestResult] = React.useState<{ success: boolean; message: string } | null>(null);
  const [installResult, setInstallResult] = React.useState<{ success: boolean; message: string } | null>(null);

  const { toast } = useToast();

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    setInstallResult(null);
    try {
      const res = await testDbConnectionAction();
      setTestResult(res);
      toast({
        title: "Sucesso!",
        description: res.message,
      });
    } catch (error: any) {
      const errorMessage = error.message || "Ocorreu um erro desconhecido.";
      setTestResult({ success: false, message: errorMessage });
      toast({
        title: "Erro de Conexão",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleInstall = async () => {
    setIsInstalling(true);
    setInstallResult(null);
    try {
      const res = await installDatabaseAction();
      setInstallResult(res);
      toast({
        title: "Sucesso!",
        description: res.message,
      });
    } catch (error: any) {
      const errorMessage = error.message || "Ocorreu um erro desconhecido.";
      setInstallResult({ success: false, message: errorMessage });
      toast({
        title: "Erro na Instalação",
        description: errorMessage,
        variant: "destructive",
      });
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
              Este assistente irá ajudá-lo a verificar sua conexão com o banco de dados e instalar as tabelas necessárias.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Step 1: Test Connection */}
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">1</div>
                    <CardTitle className="font-headline">Testar Conexão</CardTitle>
                </div>
                <CardDescription className="pl-11">
                    Primeiro, certifique-se de que suas credenciais no arquivo <code>.env</code> estão corretas. Em seguida, clique no botão para testar a conexão.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-11">
                <Button onClick={handleTestConnection} disabled={isTesting}>
                    {isTesting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Testando...
                        </>
                    ) : (
                        <>
                            <Play className="mr-2 h-4 w-4" />
                            Testar Conexão com Banco de Dados
                        </>
                    )}
                </Button>
                {testResult && (
                    <Alert variant={testResult.success ? "default" : "destructive"} className={`mt-4 ${testResult.success ? 'border-green-500/50' : ''}`}>
                         {testResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                        <AlertTitle>{testResult.success ? "Conexão Bem-Sucedida" : "Falha na Conexão"}</AlertTitle>
                        <AlertDescription>{testResult.message}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>

        {/* Step 2: Install Database */}
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">2</div>
                    <CardTitle className="font-headline">Instalar Tabelas</CardTitle>
                </div>
                <CardDescription className="pl-11">
                    Após uma conexão bem-sucedida, clique aqui para criar as tabelas do sistema. Este processo é seguro e não substituirá tabelas existentes.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-11">
                <Button onClick={handleInstall} disabled={isInstalling || !testResult?.success}>
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
                 {installResult && (
                    <Alert variant={installResult.success ? "default" : "destructive"} className={`mt-4 ${installResult.success ? 'border-green-500/50' : ''}`}>
                        {installResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                        <AlertTitle>{installResult.success ? "Instalação Concluída" : "Falha na Instalação"}</AlertTitle>
                        <AlertDescription>{installResult.message}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
