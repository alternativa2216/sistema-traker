import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Globe, Settings, BarChart } from "lucide-react";
import Link from "next/link";

const MOCK_SITES = [
    { id: "site-1", name: "meu-ecommerce.com", url: "https://meu-ecommerce.com" },
    { id: "site-2", name: "meu-blog-pessoal.dev", url: "https://meu-blog-pessoal.dev" },
    { id: "site-3", name: "agencia-criativa.co", url: "https://agencia-criativa.co" },
];

export default function MySitesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Meus Sites</h1>
          <p className="text-muted-foreground">Gerencie todos os seus sites cadastrados.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Novo Site
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_SITES.map((site) => (
          <Card key={site.id} className="flex flex-col">
            <CardHeader className="flex-1">
              <div className="flex items-center gap-3">
                <Globe className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle className="font-headline text-lg">{site.name}</CardTitle>
                  <CardDescription>{site.url}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex justify-end gap-2">
                <Button variant="outline" size="sm" asChild>
                   <Link href={`/dashboard/settings`}>
                       <Settings className="mr-2 h-4 w-4" />
                       Configurar
                   </Link>
                </Button>
                <Button size="sm" asChild>
                   <Link href={`/dashboard`}>
                       <BarChart className="mr-2 h-4 w-4" />
                       Ver Analytics
                   </Link>
                </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
