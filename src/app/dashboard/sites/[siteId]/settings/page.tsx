import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Facebook } from "lucide-react";

export default function SiteSettingsPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Configurações Gerais</CardTitle>
            <CardDescription>Gerencie as informações básicas do seu site.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Nome do Site</Label>
              <Input id="site-name" defaultValue="meu-ecommerce.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-url">URL do Site</Label>
              <Input id="site-url" defaultValue="https://meu-ecommerce.com" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Salvar Alterações</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
                <Facebook className="h-5 w-5 text-primary"/>
                <CardTitle className="font-headline">Integrações de Marketing</CardTitle>
            </div>
            <CardDescription>Conecte suas ferramentas de marketing para uma análise completa.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fb-pixel">ID do Pixel do Facebook</Label>
              <Input id="fb-pixel" placeholder="Cole seu ID do Pixel aqui" />
              <p className="text-xs text-muted-foreground">
                Isso nos permitirá rastrear conversões e criar públicos para suas campanhas no Facebook Ads.
              </p>
            </div>
          </CardContent>
           <CardFooter>
            <Button>Salvar Integrações</Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="border-destructive">
         <CardHeader>
          <CardTitle className="font-headline text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Zona de Perigo
          </CardTitle>
          <CardDescription>
            Ações permanentes e destrutivas. Tenha muito cuidado aqui.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
                <div>
                    <h4 className="font-semibold">Excluir este site</h4>
                    <p className="text-sm text-muted-foreground">
                        Esta ação não pode ser desfeita. Todos os dados de análise serão perdidos permanentemente.
                    </p>
                </div>
                <Button variant="destructive">Excluir Site</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
