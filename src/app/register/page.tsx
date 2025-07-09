'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/logo";
import Link from "next/link";
import Image from "next/image";
import { Check, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { signUpUser } from '../actions/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const benefits = [
    "Análise de Funil Visual para identificar gargalos",
    "Insights e Alertas Proativos com Inteligência Artificial",
    "Suíte de Segurança completa com Cloaker e Filtros",
    "Analytics em Tempo Real e Ferramentas para Ads",
];

const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if Firebase Admin credentials are set (inferred from auth actions).
  // A more direct way could be a dedicated server action `isFirebaseAdminConfigured()`
  const [isFirebaseAdminConfigured, setIsFirebaseAdminConfigured] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await signUpUser(values);
      toast({
        title: "Conta Criada com Sucesso!",
        description: "Você será redirecionado para a página de login.",
      });
      router.push('/login');
    } catch (error: any) {
      if (error.message.includes("Firebase Admin SDK has not been initialized")) {
        setIsFirebaseAdminConfigured(false);
      }
      toast({
        title: 'Erro ao Criar Conta',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="hidden lg:flex lg:flex-col items-center justify-center bg-muted p-8 text-center relative">
        <Image
          src="https://placehold.co/1200x1800.png"
          alt="Abstract background"
          layout="fill"
          objectFit="cover"
          className="opacity-20"
          data-ai-hint="abstract tech"
        />
        <div className="relative z-10 w-full max-w-md">
            <div className="mb-8">
              <Logo />
            </div>
            <h2 className="text-3xl font-bold font-headline mb-4">
              Comece a transformar dados em decisões
            </h2>
            <p className="text-muted-foreground mb-8">
              Junte-se a centenas de profissionais que confiam no Tracklytics para otimizar suas estratégias digitais.
            </p>
            <ul className="space-y-4 text-left">
                {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center">
                            <Check className="h-4 w-4" />
                        </div>
                        <span className="text-muted-foreground">{benefit}</span>
                    </li>
                ))}
            </ul>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-6">
           <div className="lg:hidden mb-8 text-center">
              <div className="flex justify-center">
                <Logo />
              </div>
            </div>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Crie sua Conta</CardTitle>
              <CardDescription>Comece seu teste gratuito de 14 dias do plano Pro. Não é necessário cartão de crédito.</CardDescription>
            </CardHeader>
             {!isFirebaseAdminConfigured && (
                 <CardContent>
                    <Alert variant="destructive">
                        <AlertTitle>Configuração do Servidor Ausente</AlertTitle>
                        <AlertDescription>
                            O sistema não consegue criar usuários. O administrador precisa configurar as credenciais do Firebase Admin no arquivo <code>.env</code> do servidor.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            )}
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input id="name" type="text" placeholder="John Doe" required {...form.register('name')} />
                        {form.formState.errors.name && <p className="text-sm font-medium text-destructive">{form.formState.errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john.doe@example.com" required {...form.register('email')} />
                        {form.formState.errors.email && <p className="text-sm font-medium text-destructive">{form.formState.errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" type="password" required {...form.register('password')} />
                        {form.formState.errors.password && <p className="text-sm font-medium text-destructive">{form.formState.errors.password.message}</p>}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={isLoading || !isFirebaseAdminConfigured}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Criar Conta e Começar o Teste
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">
                        Já tem uma conta?{" "}
                        <Link href="/login" className="font-medium text-primary hover:underline">
                        Login
                        </Link>
                    </p>
                </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
