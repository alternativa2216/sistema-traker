import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
  import { AiChat } from "@/components/dashboard/ai-chat"
  
  export default function AnalyticsPage() {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-headline">Análises Detalhadas</h1>
          <p className="text-muted-foreground">Mergulhe fundo nos dados do seu projeto.</p>
        </div>
        
        <Tabs defaultValue="ai_analysis" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="ai_analysis">Análise com IA</TabsTrigger>
            <TabsTrigger value="real_time" disabled>Tempo Real</TabsTrigger>
            <TabsTrigger value="heatmaps" disabled>Mapas de Calor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Visão Geral das Análises</CardTitle>
                <CardDescription>
                  Um resumo detalhado do desempenho do seu projeto. Esta seção está em construção.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Gráficos e tabelas detalhados serão exibidos aqui.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai_analysis">
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
        </Tabs>
      </div>
    )
  }
  
