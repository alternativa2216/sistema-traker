'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { PlusCircle, Globe, BarChart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { getProjectsAction } from "@/app/actions/projects";
import { AddProjectDialog } from "@/components/dashboard/add-project-dialog";
import { useToast } from "@/hooks/use-toast";

type Project = {
  id: string;
  name: string;
  url: string;
}

export default function MySitesPage() {
  const [sites, setSites] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSites = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedSites = await getProjectsAction();
      setSites(fetchedSites);
    } catch (error: any) {
        toast({
            title: "Erro ao Carregar Sites",
            description: error.message || "Não foi possível buscar seus projetos.",
            variant: "destructive"
        })
    } finally {
        setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Meus Sites</h1>
          <p className="text-muted-foreground">Gerencie todos os seus sites cadastrados.</p>
        </div>
        <AddProjectDialog onProjectAdded={fetchSites} />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : sites.length === 0 ? (
        <Card className="text-center p-12">
          <CardTitle className="font-headline">Nenhum site encontrado</CardTitle>
          <CardDescription className="mt-2 mb-6">
            Adicione seu primeiro site para começar a coletar dados.
          </CardDescription>
          <AddProjectDialog onProjectAdded={fetchSites} />
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
