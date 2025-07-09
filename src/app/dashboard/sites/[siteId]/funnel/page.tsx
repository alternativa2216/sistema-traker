'use client'

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MousePointerClick, Percent, ScrollText, Users, Eye, ShoppingCart, CreditCard, ArrowDown } from "lucide-react";

const funnelSteps = [
  { name: 'Visitantes na Home', count: '10,250', icon: Users },
  { name: 'Vir. Página de Preços', count: '4,870', conversion: 47.5, icon: Eye },
  { name: 'Iniciaram Checkout', count: '1,120', conversion: 23.0, icon: ShoppingCart },
  { name: 'Compra Concluída', count: '850', conversion: 75.9, icon: CreditCard },
]

export default function FunnelPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Análise do Funil de Vendas</CardTitle>
          <CardDescription>Visualize a jornada do seu usuário e identifique onde eles abandonam o processo.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-4 p-4 overflow-x-auto">
            {funnelSteps.map((step, index) => {
              const Icon = step.icon;
              return (
              <React.Fragment key={step.name}>
                <div className="flex flex-col items-center text-center w-48 shrink-0">
                    <div className="bg-muted rounded-full p-4 mb-2 border">
                        <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <p className="font-semibold leading-tight">{step.name}</p>
                    <p className="text-3xl font-bold font-headline">{step.count}</p>
                </div>
                
                {index < funnelSteps.length - 1 && (
                    <div className="flex flex-col items-center text-center text-muted-foreground my-2 lg:my-0 lg:mx-2 shrink-0">
                      <ArrowRight className="h-8 w-8 text-border hidden lg:block" />
                      <ArrowDown className="h-8 w-8 text-border lg:hidden" />
                      <div className="bg-primary/10 text-primary font-bold rounded-full px-3 py-1 text-sm mt-2 whitespace-nowrap">
                          {funnelSteps[index + 1].conversion}% Conversão
                      </div>
                    </div>
                  )}
              </React.Fragment>
            )})}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Recursos Avançados (Em Breve)</CardTitle>
          <CardDescription>Estamos trabalhando para trazer ainda mais detalhes para sua análise de funil.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                <MousePointerClick className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Análise de Cliques</h3>
                <p className="text-xs text-muted-foreground">Identifique quais botões e links recebem mais atenção dos usuários.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                <ScrollText className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Profundidade de Rolagem</h3>
                <p className="text-xs text-muted-foreground">Descubra até onde os visitantes rolam em suas páginas mais importantes.</p>
            </div>
             <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                <Percent className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Criação de Funis Customizados</h3>
                <p className="text-xs text-muted-foreground">Defina suas próprias etapas de funil para análises mais específicas.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
