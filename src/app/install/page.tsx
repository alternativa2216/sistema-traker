'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Database, CheckCircle, AlertTriangle } from 'lucide-react';
import { installDatabaseAction } from '@/app/actions/install';
import { Logo } from '@/components/shared/logo';

export default function InstallPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

  const handleInstall = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await installDatabaseAction();
      setResult(res);
      toast({
        title: "Sucesso!",
        description: res.message,
      });
    } catch (error: any) {
      const errorMessage = error.message || "Ocorreu um erro desconhecido.";
      setResult({ success: false, message: errorMessage });
      toast({
        title: "Erro na Instalação",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
               <Database className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">Instalação do Banco de Dados</CardTitle>
            <CardDescription>
              Clique no botão abaixo para criar todas as tabelas necessárias para o Tracklytics funcionar.
              Este processo é seguro e só criará tabelas se elas ainda não existirem.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result && (
              <div
                className={`p-4 rounded-md text-sm flex items-start gap-3 ${
                  result.success ? 'bg-green-500/10 text-green-300' : 'bg-destructive/10 text-destructive'
                }`}
              >
                {result.success ? (
                  <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                )}
                <p>{result.message}</p>
              </div>
            )}
            <div className="mt-6 flex justify-center">
              <Button onClick={handleInstall} disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Instalando...
                  </>
                ) : (
                  'Instalar Banco de Dados'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
