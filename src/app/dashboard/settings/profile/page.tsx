import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold font-headline">Perfil</h1>
        <p className="text-muted-foreground">Gerencie os detalhes do seu perfil e senha.</p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Informações Pessoais</CardTitle>
          <CardDescription>Atualize seu nome e endereço de e-mail.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" defaultValue="Usuário de Amostra" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Endereço de E-mail</Label>
            <Input id="email" type="email" defaultValue="usuario@amostra.com" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Salvar Informações</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Senha</CardTitle>
          <CardDescription>Altere sua senha. Recomendamos usar um gerenciador de senhas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
            <Label htmlFor="current-password">Senha Atual</Label>
            <Input id="current-password" type="password" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="new-password">Nova Senha</Label>
            <Input id="new-password" type="password" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
            <Input id="confirm-password" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Alterar Senha</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
