import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { PlusCircle, Globe, BarChart } from "lucide-react";
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
              <div className="flex items-start gap-3">
                <Globe className="h-8 w-8 text-primary mt-1" />
                <div>
                  <CardTitle className="font-headline text-lg">{site.name}</CardTitle>
                  <CardDescription>{site.url}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardFooter>
                <Button className="w-full" asChild>
                   <Link href={`/dashboard/sites/${site.id}`}>
                       <BarChart className="mr-2 h-4 w-4" />
                       Ver Analytics
                   </Link>
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
