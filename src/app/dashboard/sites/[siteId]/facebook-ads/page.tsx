import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Facebook } from "lucide-react";

export default function FacebookAdsPage() {
  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Integração com Facebook Ads</CardTitle>
          <CardDescription>
            Conecte sua conta do Facebook para visualizar e gerenciar o desempenho de suas campanhas diretamente do Tracklytics.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pixel-id">ID do seu Pixel do Facebook</Label>
              <Input id="pixel-id" placeholder="Cole seu ID do Pixel aqui" className="max-w-md" />
            </div>
            <Button disabled>
                <Facebook className="mr-2 h-4 w-4" />
                Conectar com Facebook
            </Button>
        </CardContent>
      </Card>
      
      <Card className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg min-h-[40vh]">
        <AlertCircle className="h-10 w-10 text-muted-foreground mb-4"/>
        <h3 className="text-lg font-semibold mb-2">Visualização de Campanhas (Em Breve)</h3>
        <p className="text-muted-foreground max-w-md">
            Após conectar sua conta, todas as suas campanhas ativas do Facebook Ads aparecerão aqui, com métricas de desempenho detalhadas.
        </p>
      </Card>
    </div>
  );
}
