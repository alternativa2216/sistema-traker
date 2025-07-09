'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AiChat } from "@/components/dashboard/ai-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Lightbulb, Search, Sparkles } from "lucide-react";

export default function AiAnalysisPage() {
    return (
        <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                <TabsTrigger value="chat">Chat com IA</TabsTrigger>
                <TabsTrigger value="reports">Gerador de Relatórios</TabsTrigger>
                <TabsTrigger value="predictive">Análise Preditiva</TabsTrigger>
                <TabsTrigger value="ab_testing">Testes A/B</TabsTrigger>
                <TabsTrigger value="competitor">Análise Competitiva</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Converse com Seus Dados</CardTitle>
                        <CardDescription>
                            Pergunte ao nosso analista de IA qualquer coisa sobre os dados deste projeto para obter insights instantâneos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AiChat />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="reports" className="mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Gerador de Relatórios de IA</CardTitle>
                        <CardDescription>Crie relatórios detalhados e estruturados com um clique, baseados nos dados do seu site.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="report-type">Tipo de Relatório</Label>
                            <Select>
                                <SelectTrigger id="report-type" className="max-w-md">
                                    <SelectValue placeholder="Selecione o tipo de relatório" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="performance">Relatório de Desempenho Geral</SelectItem>
                                    <SelectItem value="conversion">Análise de Conversão Profunda</SelectItem>
                                    <SelectItem value="seo">Diagnóstico de SEO</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button disabled><FileText className="mr-2"/> Gerar Relatório</Button>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="predictive" className="mt-4">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Análise Preditiva</CardTitle>
                        <CardDescription>Faça perguntas sobre o futuro do seu site, e a IA usará os dados históricos para prever tendências.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 max-w-2xl">
                        <Label>Exemplos de Perguntas:</Label>
                        <div className="space-y-2 text-sm text-muted-foreground p-3 bg-muted rounded-md">
                            <p>• "Com base no tráfego dos últimos 3 meses, qual a previsão para o próximo?"</p>
                            <p>• "Se aumentarmos o tráfego do Instagram em 20%, qual o impacto esperado nas conversões?"</p>
                        </div>
                        <Textarea placeholder="Faça sua pergunta preditiva aqui..." />
                        <Button disabled><Sparkles className="mr-2" /> Obter Previsão</Button>
                    </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="ab_testing" className="mt-4">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Gerador de Hipóteses para Testes A/B</CardTitle>
                        <CardDescription>Receba sugestões de testes A/B prontas para implementar e otimizar suas conversões.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 max-w-2xl">
                        <div className="space-y-2">
                            <Label htmlFor="test-page">Página para Otimizar</Label>
                            <Input id="test-page" placeholder="Ex: /pricing ou /checkout"/>
                        </div>
                        <Button disabled><Lightbulb className="mr-2" /> Gerar Hipóteses</Button>
                        <div className="border-t pt-4 mt-4 space-y-3">
                             <h4 className="font-semibold">Sugestão de Teste (Exemplo):</h4>
                             <blockquote className="border-l-2 pl-6 italic">
                                <strong>Hipótese:</strong> Mudar o texto do botão 'Começar' para 'Começar Gratuitamente' na página inicial pode aumentar os cliques em até 15%, pois reduz a fricção e a incerteza do usuário sobre custos.
                             </blockquote>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="competitor" className="mt-4">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Análise Competitiva</CardTitle>
                        <CardDescription>Forneça a URL de um concorrente para obter uma análise estratégica de seus pontos fortes e fracos.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 max-w-2xl">
                         <div className="space-y-2">
                            <Label htmlFor="competitor-url">URL do Concorrente</Label>
                            <Input id="competitor-url" placeholder="https://concorrente.com" />
                        </div>
                        <Button disabled><Search className="mr-2" /> Analisar Concorrente</Button>
                        <div className="border-t pt-4 mt-4 space-y-3">
                             <h4 className="font-semibold">Resumo da Análise (Exemplo):</h4>
                             <blockquote className="border-l-2 pl-6 italic space-y-2">
                               <p><strong>Pontos Fortes do Concorrente:</strong> A proposta de valor é extremamente clara e visível no topo da página. Utilizam prova social (depoimentos de grandes empresas) de forma muito eficaz.</p>
                               <p><strong>Oportunidade para Você:</strong> O checkout do concorrente tem 4 passos. Se o seu tiver apenas 2, isso pode ser um grande diferencial. Destaque essa simplicidade na sua comunicação.</p>
                             </blockquote>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
