'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/logo";
import Link from "next/link";
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
});

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    // In a real app, you would call an action here to send a reset email.
    // For now, we just show a success message.
    setTimeout(() => {
        setIsSubmitted(true);
        setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
            <div className="flex justify-center">
             <Logo />
            </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Redefinir Senha</CardTitle>
            <CardDescription>
              {isSubmitted 
                ? "Verifique seu e-mail para continuar."
                : "Digite seu e-mail e enviaremos um link para redefinir sua senha."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
               <Alert>
                  <AlertTitle>Funcionalidade em Desenvolvimento</AlertTitle>
                  <AlertDescription>
                    O envio de e-mails para redefinição de senha ainda não está ativo. Por favor, contate o suporte para assistência.
                  </AlertDescription>
                </Alert>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john.doe@example.com" 
                    required 
                    {...form.register('email')}
                  />
                  {form.formState.errors.email && <p className="text-sm font-medium text-destructive">{form.formState.errors.email.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enviar Link de Redefinição
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/login" className="text-sm font-medium text-primary hover:underline w-full text-center">
                Voltar para o Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
