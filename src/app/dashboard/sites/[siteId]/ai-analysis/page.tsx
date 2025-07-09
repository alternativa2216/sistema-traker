import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AiChat } from "@/components/dashboard/ai-chat";

export default function AiAnalysisPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Análise com IA</CardTitle>
                <CardDescription>
                    Converse com seus dados. Pergunte ao nosso analista de IA qualquer coisa sobre os dados deste projeto para obter insights instantâneos.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AiChat />
            </CardContent>
        </Card>
    );
}
