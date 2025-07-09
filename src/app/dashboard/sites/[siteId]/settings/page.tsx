'use client'

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Facebook, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { getProjectByIdAction, updateProjectAction, deleteProjectAction } from '@/app/actions/projects';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SiteSettingsPage() {
  const params = useParams() as { siteId: string };
  const router = useRouter();
  const { toast } = useToast();
  
  const [name, setName] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [fbPixelId, setFbPixelId] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    async function fetchProject() {
      setIsLoading(true);
      try {
        const project = await getProjectByIdAction(params.siteId);
        setName(project.name);
        setUrl(project.url);
        setFbPixelId(project.fb_pixel_id || '');
      } catch (error: any) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchProject();
  }, [params.siteId, toast]);
  
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await updateProjectAction({ id: params.siteId, name, url, fbPixelId });
      toast({ title: "Sucesso!", description: "As configurações do site foram salvas." });
    } catch (error: any) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProjectAction(params.siteId);
      toast({ title: "Site Excluído", description: "O site foi excluído com sucesso." });
      router.push('/dashboard/projects');
    } catch (error: any) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

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
              <Input id="site-name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-url">URL do Site</Label>
              <Input id="site-url" value={url} onChange={e => setUrl(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
              Salvar Alterações
            </Button>
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
              <Input id="fb-pixel" value={fbPixelId} onChange={e => setFbPixelId(e.target.value)} placeholder="Cole seu ID do Pixel aqui" />
              <p className="text-xs text-muted-foreground">
                Isso nos permitirá rastrear conversões e criar públicos para suas campanhas no Facebook Ads.
              </p>
            </div>
          </CardContent>
           <CardFooter>
            <Button onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
              Salvar Integrações
            </Button>
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isDeleting}>
                      {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                      Excluir Site
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá permanentemente
                        o site <span className='font-bold'>{name}</span> e todos os seus dados.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                         Sim, excluir este site
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
