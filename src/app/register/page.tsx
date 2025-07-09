import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/logo";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";

const benefits = [
    "Análise de Funil Visual para identificar gargalos",
    "Insights e Alertas Proativos com Inteligência Artificial",
    "Suíte de Segurança completa com Cloaker e Filtros",
    "Analytics em Tempo Real e Ferramentas para Ads",
];

export default function RegisterPage() {
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
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" type="text" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" asChild>
                <Link href="/dashboard">Criar Conta e Começar o Teste</Link>
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Já tem uma conta?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Login
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
