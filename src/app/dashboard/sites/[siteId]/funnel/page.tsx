'use client'

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ChevronDown, MousePointerClick, Percent, ScrollText, Users } from "lucide-react";

const funnelSteps = [
  { name: 'Visitantes na Home', count: '10,250', icon: Users },
  { name: 'Visualizaram Página de Preços', count: '4,870', conversion: 47.5 },
  { name: 'Iniciaram o Checkout', count: '1,120', conversion: 23.0 },
  { name: 'Compra Concluída', count: '850', conversion: 75.9 },
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
          <div className="flex flex-col items-center gap-2">
            {funnelSteps.map((step, index) => (
              <React.Fragment key={step.name}>
                <div className="w-full max-w-lg">
                  <Card className="text-center shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <step.icon className="h-5 w-5" />
                        <span className="font-medium">{step.name}</span>
                      </div>
                      <CardTitle className="text-4xl font-bold font-headline">{step.count}</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
                {index < funnelSteps.length - 1 && (
                  <div className="flex flex-col items-center text-center text-muted-foreground">
                    <ChevronDown className="h-8 w-8 my-1 text-border" />
                    <div className="bg-primary/10 text-primary font-bold rounded-full px-3 py-1 text-sm">
                        {funnelSteps[index + 1].conversion}% de Conversão
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
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
