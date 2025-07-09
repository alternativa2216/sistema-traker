'use client'

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Bot, Shield, Filter } from 'lucide-react';

const initialFeatures = [
    { id: 'cloaker', name: 'Suíte de Segurança (Cloaker)', icon: Shield, free: false, pro: true },
    { id: 'funnel_analysis', name: 'Análise de Funil', icon: Filter, free: false, pro: true },
    { id: 'ai_analysis', name: 'Chat com IA', icon: Bot, free: false, pro: true },
    { id: 'facebook_tools', name: 'Ferramentas de Facebook Ads', icon: Bot, free: false, pro: true },
    { id: 'swot_analysis', name: 'Análise SWOT com IA', icon: Bot, free: true, pro: true },
];

type Feature = typeof initialFeatures[0];

export default function AdminFeatureFlagsPage() {
    const { toast } = useToast();
    const [features, setFeatures] = React.useState<Feature[]>(initialFeatures);
    
    const handleToggle = (featureId: string, plan: 'free' | 'pro') => {
        setFeatures(prev =>
            prev.map(f =>
                f.id === featureId ? { ...f, [plan]: !f[plan] } : f
            )
        );
    };

    const handleSaveChanges = () => {
        // In a real app, this would save the state to your database
        toast({
            title: "Salvo com sucesso!",
            description: "As flags de funcionalidades foram atualizadas.",
        });
    };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Flags de Funcionalidades</h1>
        <p className="text-muted-foreground">Controle a disponibilidade de funcionalidades em diferentes planos.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Controle de Acesso por Plano</CardTitle>
          <CardDescription>Habilite ou desabilite funcionalidades para os planos Grátis e Pro. As mudanças são aplicadas em tempo real.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Funcionalidade</TableHead>
                        <TableHead className="text-center">Plano Grátis</TableHead>
                        <TableHead className="text-center">Plano Pro</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                             <TableRow key={feature.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Icon className="h-5 w-5 text-muted-foreground" />
                                        <span className="font-medium">{feature.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Switch
                                        checked={feature.free}
                                        onCheckedChange={() => handleToggle(feature.id, 'free')}
                                        aria-label={`Toggle ${feature.name} for Free plan`}
                                    />
                                </TableCell>
                                <TableCell className="text-center">
                                     <Switch
                                        checked={feature.pro}
                                        onCheckedChange={() => handleToggle(feature.id, 'pro')}
                                        aria-label={`Toggle ${feature.name} for Pro plan`}
                                    />
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleSaveChanges}>Salvar Alterações</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
