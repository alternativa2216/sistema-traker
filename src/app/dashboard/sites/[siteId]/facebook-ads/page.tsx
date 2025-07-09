'use client'

import * as React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, CheckCircle, DollarSign, Image as ImageIcon, LayoutDashboard, Loader2, MousePointerClick, PenSquare, Target, Upload, Users } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateAdCopyAction, suggestAdAudienceAction, analyzeAdCreativeAction } from '@/app/actions/ai';
import type { GenerateAdCopyOutput } from '@/ai/flows/generate-ad-copy';
import type { SuggestAdAudienceOutput } from '@/ai/flows/suggest-ad-audience';
import type { AnalyzeAdCreativeOutput } from '@/ai/flows/analyze-ad-creative';
import Image from 'next/image';
import { CampaignPerformanceChart } from '@/components/dashboard/facebook/campaign-performance-chart';
import { cn } from '@/lib/utils';

const mockCampaigns = [
  { id: 'C001', name: 'Promoção de Verão - Vendas', status: 'Ativa', spent: 'R$ 2.500,00', conversions: 120, roas: '4.8x' },
  { id: 'C002', name: 'Leads Qualificados - Ebook Grátis', status: 'Ativa', spent: 'R$ 1.200,00', conversions: 450, roas: 'N/A' },
  { id: 'C003', name: 'Remarketing - Carrinho Abandonado', status: 'Pausada', spent: 'R$ 850,00', conversions: 45, roas: '6.2x' },
  { id: 'C004', name: 'Reconhecimento de Marca - Institucional', status: 'Finalizada', spent: 'R$ 3.000,00', conversions: 2, roas: 'N/A' },
];

const MetricCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

const AdGenerator = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [description, setDescription] = React.useState('');
    const [result, setResult] = React.useState<GenerateAdCopyOutput | null>(null);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) return;
        setIsLoading(true);
        setResult(null);
        try {
            const res = await generateAdCopyAction({ productDescription: description });
            setResult(res);
        } catch (error) {
            toast({ title: 'Erro', description: 'Não foi possível gerar o anúncio.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Gerador de Anúncios com IA</CardTitle>
                <CardDescription>Descreva seu produto ou serviço e a IA criará um texto de anúncio otimizado para você.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="ad-description">Descrição do Produto/Serviço</Label>
                        <Textarea 
                            id="ad-description" 
                            placeholder="Ex: Tênis de corrida ultraleve com tecnologia de amortecimento para longas distâncias. Ideal para maratonistas." 
                            rows={4} 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isLoading || !description.trim()}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PenSquare className="mr-2 h-4 w-4" />}
                        Gerar Anúncio
                    </Button>
                </CardFooter>
            </form>
            {result && (
                <CardContent>
                    <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                        <h4 className="font-semibold">Resultado Gerado:</h4>
                        <div className="space-y-1">
                            <Label>Título</Label>
                            <p className="text-sm text-foreground">{result.headline}</p>
                        </div>
                        <div className="space-y-1">
                            <Label>Texto Principal</Label>
                            <p className="text-sm text-foreground">{result.primaryText}</p>
                        </div>
                        <div className="space-y-1">
                            <Label>Chamada para Ação (CTA)</Label>
                            <p className="text-sm text-foreground">{result.cta}</p>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
};

const AudienceBuilder = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [profile, setProfile] = React.useState('');
    const [result, setResult] = React.useState<SuggestAdAudienceOutput | null>(null);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile.trim()) return;
        setIsLoading(true);
        setResult(null);
        try {
            const res = await suggestAdAudienceAction({ customerProfile: profile });
            setResult(res);
        } catch (error) {
            toast({ title: 'Erro', description: 'Não foi possível gerar o público.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Gerador de Públicos com IA</CardTitle>
                <CardDescription>Descreva seu cliente ideal e a IA sugerirá uma segmentação detalhada para o Facebook Ads.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="audience-description">Descrição do Cliente Ideal</Label>
                        <Textarea 
                            id="audience-description" 
                            placeholder="Ex: Homens e mulheres, 25-45 anos, interessados em corrida, maratonas, vida saudável e tecnologia esportiva. Moram em grandes cidades." 
                            rows={4} 
                            value={profile}
                            onChange={(e) => setProfile(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isLoading || !profile.trim()}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
                        Sugerir Público
                    </Button>
                </CardFooter>
            </form>
            {result && (
                <CardContent>
                    <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                        <h4 className="font-semibold">Sugestão de Público:</h4>
                        <div className="space-y-2">
                            <Label>Dados Demográficos</Label>
                            <p className="text-sm text-foreground">{result.demographics}</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Interesses</Label>
                            <div className="flex flex-wrap gap-2">
                                {result.interests.map(item => <Badge key={item} variant="secondary">{item}</Badge>)}
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label>Comportamentos</Label>
                            <div className="flex flex-wrap gap-2">
                                {result.behaviors.map(item => <Badge key={item} variant="secondary">{item}</Badge>)}
                            </div>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
};

const CreativeAnalyzer = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [result, setResult] = React.useState<AnalyzeAdCreativeOutput | null>(null);
    const { toast } = useToast();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setResult(null);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleAnalyze = async () => {
        if (!imagePreview) return;
        setIsLoading(true);
        setResult(null);
        try {
            const res = await analyzeAdCreativeAction({ imageDataUri: imagePreview });
            setResult(res);
        } catch (error) {
            toast({ title: 'Erro', description: 'Não foi possível analisar o criativo.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Análise de Criativos com IA</CardTitle>
                <CardDescription>Faça o upload de uma imagem e a IA fornecerá uma nota e sugestões de melhoria.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="creative-upload">Imagem do Anúncio</Label>
                    <Input id="creative-upload" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4"/>
                        Selecionar Imagem
                    </Button>
                </div>
                {imagePreview && (
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/3">
                            <Image src={imagePreview} alt="Preview do criativo" width={300} height={300} className="rounded-lg object-contain border" />
                        </div>
                        <div className="w-full md:w-2/3 space-y-4">
                           <Button onClick={handleAnalyze} disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                                Analisar Criativo
                            </Button>
                            {result && (
                                <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                                     <h4 className="font-semibold">Análise da IA:</h4>
                                     <div className="flex items-baseline gap-2">
                                         <span className="text-2xl font-bold">{result.score}</span>
                                         <span className="text-sm text-muted-foreground">/ 100</span>
                                     </div>
                                     <div className="space-y-1">
                                         <Label>Feedback</Label>
                                         <p className="text-sm text-foreground">{result.feedback}</p>
                                     </div>
                                     <div className="space-y-2">
                                         <Label>Sugestões</Label>
                                         <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                                             {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                         </ul>
                                     </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default function FacebookAdsPage() {
  return (
    <div className="space-y-6">
        <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="overview"><LayoutDashboard className="mr-2" /> Visão Geral</TabsTrigger>
                <TabsTrigger value="ad_generator"><PenSquare className="mr-2" /> Gerador de Anúncios</TabsTrigger>
                <TabsTrigger value="audience_builder"><Users className="mr-2" /> Gerador de Públicos</TabsTrigger>
                <TabsTrigger value="creative_analyzer"><ImageIcon className="mr-2" /> Análise de Criativos</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <MetricCard title="Gasto Total" value="R$ 7.550,00" icon={DollarSign} />
                    <MetricCard title="ROAS (Vendas)" value="5.1x" icon={Target} />
                    <MetricCard title="CTR Médio" value="2.34%" icon={MousePointerClick} />
                    <MetricCard title="Conversões (Total)" value="577" icon={CheckCircle} />
                </div>
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    <CampaignPerformanceChart />
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Desempenho das Campanhas</CardTitle>
                            <CardDescription>Resumo de suas campanhas ativas e pausadas.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Campanha</TableHead>
                                            <TableHead>Gasto</TableHead>
                                            <TableHead className='text-right'>Conversões</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockCampaigns.map((campaign) => (
                                            <TableRow key={campaign.id}>
                                                <TableCell className="font-medium">
                                                    <div className='flex items-center gap-2'>
                                                        <span className={cn('w-2 h-2 rounded-full', campaign.status === 'Ativa' ? 'bg-green-500' : campaign.status === 'Pausada' ? 'bg-yellow-500' : 'bg-gray-500')} />
                                                        {campaign.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{campaign.spent}</TableCell>
                                                <TableCell className='text-right'>{campaign.conversions}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="ad_generator" className="mt-4">
                <AdGenerator />
            </TabsContent>

            <TabsContent value="audience_builder" className="mt-4">
                <AudienceBuilder />
            </TabsContent>

            <TabsContent value="creative_analyzer" className="mt-4">
                <CreativeAnalyzer />
            </TabsContent>
        </Tabs>
    </div>
  );
}
