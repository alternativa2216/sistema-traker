import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/logo";
import Link from "next/link";

export default function LoginPage() {
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
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" required />
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link href="#" className="text-sm font-medium text-primary hover:underline">
                        Esqueceu sua senha?
                    </Link>
                </div>
              <Input id="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" asChild>
                <Link href="/dashboard">Entrar</Link>
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Não tem uma conta?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Cadastre-se
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
