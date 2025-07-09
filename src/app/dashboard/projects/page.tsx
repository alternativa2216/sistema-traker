'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { PlusCircle, Globe, BarChart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProjectsAction } from "@/app/actions/projects";

type Project = {
  id: string;
  name: string;
  url: string;
}

export default function MySitesPage() {
  const [sites, setSites] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSites() {
      setIsLoading(true);
      const fetchedSites = await getProjectsAction();
      setSites(fetchedSites);
      setIsLoading(false);
    }
    fetchSites();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Meus Sites</h1>
          <p className="text-muted-foreground">Gerencie todos os seus sites cadastrados.</p>
        </div>
        <Button asChild>
           <Link href="/dashboard">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Novo Site
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : sites.length === 0 ? (
        <Card className="text-center p-12">
          <CardTitle className="font-headline">Nenhum site encontrado</CardTitle>
          <CardDescription className="mt-2 mb-6">
            Adicione seu primeiro site no painel principal para começar.
          </CardDescription>
          <Button asChild>
            <Link href="/dashboard">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Primeiro Site
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
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
      )}
    </div>
  );
}
