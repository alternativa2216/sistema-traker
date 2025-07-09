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
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createSessionCookie } from '../actions/auth';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z.string().min(1, { message: 'A senha é obrigatória.' }),
});


export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    if (!auth) {
      toast({
        title: 'Erro de Configuração',
        description: 'A autenticação está desativada. Por favor, configure suas chaves de API do Firebase no ambiente.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const idToken = await userCredential.user.getIdToken();
      
      await createSessionCookie(idToken);
      
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      let message = 'Ocorreu um erro. Verifique suas credenciais.';
      if (error.code === 'auth/invalid-credential') {
        message = 'E-mail ou senha inválidos. Por favor, tente novamente.'
      }
      toast({
        title: 'Erro de Login',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
            <CardTitle className="font-headline text-2xl">Bem-vindo de volta</CardTitle>
            <CardDescription>Digite suas credenciais para acessar seu painel.</CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" required {...form.register('email')} />
                 {form.formState.errors.email && <p className="text-sm font-medium text-destructive">{form.formState.errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                  <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                      <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                          Esqueceu sua senha?
                      </Link>
                  </div>
                <Input id="password" type="password" required {...form.register('password')} />
                {form.formState.errors.password && <p className="text-sm font-medium text-destructive">{form.formState.errors.password.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Entrar
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Não tem uma conta?{" "}
                <Link href="/register" className="font-medium text-primary hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
