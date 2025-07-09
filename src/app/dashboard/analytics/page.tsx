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
          <h1 className="text-3xl font-bold font-headline">Detailed Analytics</h1>
          <p className="text-muted-foreground">Dive deep into your project's data.</p>
        </div>
        
        <Tabs defaultValue="ai_analysis" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ai_analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="real_time" disabled>Real-Time</TabsTrigger>
            <TabsTrigger value="heatmaps" disabled>Heatmaps</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Analytics Overview</CardTitle>
                <CardDescription>
                  A detailed summary of your project's performance. This section is under construction.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Detailed charts and tables will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai_analysis">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Converse with Your Data</CardTitle>
                    <CardDescription>
                    Ask our AI analyst anything about this project's data to get instant insights.
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
  