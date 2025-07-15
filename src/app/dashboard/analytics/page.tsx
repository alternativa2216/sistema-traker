
'use client';
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
import { useParams } from "next/navigation";
  
  export default function AnalyticsPage() {
    const params = useParams() as { siteId?: string };

    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-headline">Análises Detalhadas</h1>
          <p className="text-muted-foreground">Mergulhe fundo nos dados do seu projeto.</p>
        </div>
        
        <Tabs defaultValue="ai_analysis" className="w-full">
          <TabsList>
            <TabsTrigger value="ai_analysis">Análise com IA</TabsTrigger>
            <TabsTrigger value="heatmaps" disabled>Mapas de Calor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai_analysis">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Converse com Seus Dados</CardTitle>
                    <CardDescription>
                    Pergunte ao nosso analista de IA qualquer coisa sobre os dados deste projeto para obter insights instantâneos.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AiChat projectId={params.siteId}/>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

    