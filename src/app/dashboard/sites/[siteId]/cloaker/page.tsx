'use client'

import * as React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ListFilter, ServerOff, ArrowLeftRight, Fingerprint, WifiOff, Clock, ShieldAlert, Link2, Plus, Pencil, Trash2, Globe, Laptop, MonitorSmartphone, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { saveCloakerSettingsAction, getCloakerSettingsAction } from '@/app/actions/projects';

const osOptions = [
    { id: 'windows', label: 'Windows' },
    { id: 'macos', label: 'macOS' },
    { id: 'linux', label: 'Linux' },
    { id: 'android', label: 'Android' },
    { id: 'ios', label: 'iOS' },
];

const dayOptions = [
  { id: 'sun', label: 'Domingo' },
  { id: 'mon', label: 'Segunda' },
  { id: 'tue', label: 'Terça' },
  { id: 'wed', label: 'Quarta' },
  { id: 'thu', label: 'Quinta' },
  { id: 'fri', label: 'Sexta' },
  { id: 'sat', label: 'Sábado' },
];

interface RuleCondition {
  type: 'País' | 'Dispositivo' | 'S.O.';
  value: string;
}

interface Rule {
  id: string;
  conditions: RuleCondition[];
  redirectUrl: string;
}

const defaultState = {
    blockRightClick: false,
    blockDevTools: false,
    redirectOnInspectUrl: 'https://google.com',
    redirectMobileEnabled: false,
    mobileRedirectUrl: '',
    redirectDesktopEnabled: false,
    desktopRedirectUrl: '',
    antiBotFilter: true,
    antiSpyFilter: true,
    antiEmulatorFilter: false,
    antiClonerFilter: true,
    fingerprintDetection: false,
    utmFilterEnabled: false,
    utmSource: '',
    geoFilterEnabled: false,
    geoFilterAction: 'block',
    geoLocations: '',
    osFilterEnabled: false,
    osFilterAction: 'block',
    selectedOs: {} as Record<string, boolean>,
    ipFilterEnabled: false,
    ipFilterAction: 'block',
    ipList: '',
    referrerFilterEnabled: false,
    referrerFilterAction: 'allow',
    referrerList: '',
    userAgentFilterEnabled: false,
    userAgentFilterAction: 'block',
    userAgentList: '',
    ispFilterEnabled: false,
    ispFilterAction: 'block',
    ispList: '',
    timeFilterEnabled: false,
    selectedDays: {} as Record<string, boolean>,
    startTime: '09:00',
    endTime: '18:00',
    rules: [] as Rule[],
};

type CloakerState = typeof defaultState;

export default function CloakerPage() {
  const { toast } = useToast();
  const params = useParams() as { siteId: string };
  const [state, setState] = React.useState<CloakerState>(defaultState);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isAddRuleDialogOpen, setIsAddRuleDialogOpen] = React.useState(false);

  React.useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      try {
        const settings = await getCloakerSettingsAction(params.siteId);
        setState(prev => ({...prev, ...settings}));
      } catch (error: any) {
        toast({ title: 'Erro ao carregar', description: error.message, variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, [params.siteId, toast]);

  const handleStateChange = (key: keyof CloakerState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };
  
  const handleCheckboxListChange = (key: 'selectedOs' | 'selectedDays', id: string, checked: boolean) => {
      setState(prev => ({
          ...prev,
          [key]: {
              ...prev[key],
              [id]: checked,
          }
      }));
  }

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await saveCloakerSettingsAction(params.siteId, state);
      toast({
        title: "Configurações Salvas!",
        description: "Suas configurações do cloaker foram salvas e serão aplicadas em tempo real."
      });
    } catch (error: any) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  // Advanced Rules state and handlers
  const [currentPage, setCurrentPage] = React.useState(1);
  const RULES_PER_PAGE = 5;
  const totalPages = Math.ceil(state.rules.length / RULES_PER_PAGE);
  const paginatedRules = state.rules.slice((currentPage - 1) * RULES_PER_PAGE, currentPage * RULES_PER_PAGE);
  
  const [newRuleCountry, setNewRuleCountry] = React.useState('');
  const [newRuleDevice, setNewRuleDevice] = React.useState('');
  const [newRuleOs, setNewRuleOs] = React.useState('');
  const [newRuleRedirectUrl, setNewRuleRedirectUrl] = React.useState('');
  
  const handleDeleteRule = (ruleId: string) => {
    handleStateChange('rules', state.rules.filter(rule => rule.id !== ruleId));
    toast({ title: "Regra Removida", description: "A regra de redirecionamento foi removida." });
  }

  const handleAddRule = (e: React.FormEvent) => {
      e.preventDefault();
      const conditions: RuleCondition[] = [];
      if (newRuleCountry.trim()) conditions.push({ type: 'País', value: newRuleCountry.trim() });
      if (newRuleDevice.trim()) conditions.push({ type: 'Dispositivo', value: newRuleDevice.trim() });
      if (newRuleOs.trim()) conditions.push({ type: 'S.O.', value: newRuleOs.trim() });
      
      if (conditions.length > 0 && newRuleRedirectUrl.trim()) {
          const newRule: Rule = {
              id: Date.now().toString(),
              conditions,
              redirectUrl: newRuleRedirectUrl.trim(),
          };
          handleStateChange('rules', [newRule, ...state.rules]);
          setNewRuleCountry(''); setNewRuleDevice(''); setNewRuleOs(''); setNewRuleRedirectUrl('');
          setIsAddRuleDialogOpen(false);
          toast({ title: "Regra Adicionada", description: "A nova regra de redirecionamento foi salva." });
      } else {
          toast({ title: "Erro", description: "Preencha pelo menos uma condição e a URL de redirecionamento.", variant: "destructive" });
      }
  };

  if (isLoading) {
    return <div className="flex h-64 w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Configurações Gerais do Cloaker</CardTitle>
                <CardDescription>Proteja seu conteúdo e impeça a inspeção manual do seu site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5"><Label htmlFor="block-right-click" className="text-base">Bloquear Clique Direito</Label><p className="text-sm text-muted-foreground">Desativa o menu de contexto do navegador para impedir a cópia fácil de conteúdo.</p></div>
                    <Switch id="block-right-click" checked={state.blockRightClick} onCheckedChange={(v) => handleStateChange('blockRightClick', v)} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5"><Label htmlFor="block-f12" className="text-base">Bloquear Ferramentas de Desenvolvedor</Label><p className="text-sm text-muted-foreground">Impede o acesso às ferramentas de inspeção do navegador (F12, Inspencionar Elemento).</p></div>
                    <Switch id="block-f12" checked={state.blockDevTools} onCheckedChange={(v) => handleStateChange('blockDevTools', v)} />
                </div>
                 <div className="flex items-start sm:items-center justify-between rounded-lg border p-4 flex-col sm:flex-row gap-4">
                    <div className="space-y-0.5"><Label htmlFor="redirect-url" className="text-base">Redirecionar ao Inspecionar</Label><p className="text-sm text-muted-foreground">Se um usuário abrir as ferramentas de desenvolvedor, ele será redirecionado para esta URL.</p></div>
                    <Input id="redirect-url" value={state.redirectOnInspectUrl} onChange={(e) => handleStateChange('redirectOnInspectUrl', e.target.value)} placeholder="https://google.com" className="w-full sm:max-w-xs" />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><div className="flex items-center gap-3"><ShieldAlert className="h-6 w-6 text-destructive" /><CardTitle className="font-headline">Monitoramento de Ameaças Ativas</CardTitle></div>
                <CardDescription>Nossa IA monitora e bloqueia automaticamente atividades suspeitas em tempo real para proteger seu site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4"><div className="text-center text-muted-foreground p-8">Nenhuma ameaça ativa detectada. Vá para os <Link href={`/dashboard/sites/${params.siteId}/security-logs`} className="text-primary hover:underline">Logs de Segurança</Link> para ver o histórico.</div></CardContent>
        </Card>
        
        <Card>
            <CardHeader><CardTitle className="font-headline">Redirecionamento por Dispositivo</CardTitle><CardDescription>Redirecione os visitantes para URLs diferentes com base no dispositivo que eles estão usando.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-4 rounded-lg border p-4">
                     <div className="flex items-center justify-between"><div className="flex items-start gap-4"><MonitorSmartphone className="h-6 w-6 text-primary mt-1 hidden sm:block" /><div className="space-y-0.5"><Label htmlFor="mobile-redirect-switch" className="text-base font-semibold">Redirecionamento Mobile</Label><p className="text-sm text-muted-foreground">Ative para redirecionar usuários de dispositivos móveis.</p></div></div><Switch id="mobile-redirect-switch" checked={state.redirectMobileEnabled} onCheckedChange={(v) => handleStateChange('redirectMobileEnabled', v)} /></div>
                    {state.redirectMobileEnabled && (<div className="pt-4 border-t mt-4"><div className="space-y-2"><Label htmlFor="mobile-url">URL Mobile</Label><Input id="mobile-url" value={state.mobileRedirectUrl} onChange={(e) => handleStateChange('mobileRedirectUrl', e.target.value)} placeholder="https://seusite.com/lp-mobile" /></div></div>)}
                </div>
                 <div className="space-y-4 rounded-lg border p-4">
                     <div className="flex items-center justify-between"><div className="flex items-start gap-4"><Laptop className="h-6 w-6 text-primary mt-1 hidden sm:block" /><div className="space-y-0.5"><Label htmlFor="desktop-redirect-switch" className="text-base font-semibold">Redirecionamento Desktop</Label><p className="text-sm text-muted-foreground">Ative para redirecionar usuários de computadores.</p></div></div><Switch id="desktop-redirect-switch" checked={state.redirectDesktopEnabled} onCheckedChange={(v) => handleStateChange('redirectDesktopEnabled', v)} /></div>
                    {state.redirectDesktopEnabled && (<div className="pt-4 border-t mt-4"><div className="space-y-2"><Label htmlFor="desktop-url">URL Desktop</Label><Input id="desktop-url" value={state.desktopRedirectUrl} onChange={(e) => handleStateChange('desktopRedirectUrl', e.target.value)} placeholder="https://seusite.com/lp-desktop" /></div></div>)}
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <div className="flex items-center justify-between"><div><CardTitle className="font-headline">Regras de Redirecionamento Avançado</CardTitle><CardDescription>Crie regras complexas para redirecionar o tráfego com base em múltiplas condições.</CardDescription></div>
                    <Dialog open={isAddRuleDialogOpen} onOpenChange={setIsAddRuleDialogOpen}><DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Adicionar Regra</Button></DialogTrigger>
                        <DialogContent className="sm:max-w-[480px]">
                            <DialogHeader><DialogTitle>Adicionar Nova Regra</DialogTitle><DialogDescription>Defina as condições e a URL de redirecionamento. A regra será aplicada se TODAS as condições forem atendidas. Deixe um campo em branco se não quiser usá-lo como condição.</DialogDescription></DialogHeader>
                            <form id="add-rule-form" onSubmit={handleAddRule} className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="country" className="text-right">País</Label><Input id="country" value={newRuleCountry} onChange={(e) => setNewRuleCountry(e.target.value)} className="col-span-3" placeholder="Ex: Brasil, Portugal"/></div>
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="device" className="text-right">Dispositivo</Label><Input id="device" value={newRuleDevice} onChange={(e) => setNewRuleDevice(e.target.value)} className="col-span-3" placeholder="Ex: Mobile, Desktop"/></div>
                                 <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="os" className="text-right">S.O.</Label><Input id="os" value={newRuleOs} onChange={(e) => setNewRuleOs(e.target.value)} className="col-span-3" placeholder="Ex: Windows, iOS"/></div>
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="redirectUrl" className="text-right">URL de Redirec.</Label><Input id="redirectUrl" value={newRuleRedirectUrl} onChange={(e) => setNewRuleRedirectUrl(e.target.value)} className="col-span-3" placeholder="/nova-oferta" required/></div>
                            </form>
                            <DialogFooter><Button type="submit" form="add-rule-form">Salvar Regra</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="rounded-lg border">
                    <Table><TableHeader><TableRow><TableHead>Condições</TableHead><TableHead>URL de Redirecionamento</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {paginatedRules.length > 0 ? paginatedRules.map(rule => (
                                <TableRow key={rule.id}>
                                    <TableCell><div className="flex flex-wrap gap-1">{rule.conditions.map(condition => (<Badge key={condition.value} variant="secondary">{condition.type}: {condition.value}</Badge>))}</div></TableCell>
                                    <TableCell className="font-mono">{rule.redirectUrl}</TableCell>
                                    <TableCell className="text-right"><Button variant="ghost" size="icon" disabled><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                                </TableRow>
                            )) : (<TableRow><TableCell colSpan={3} className="h-24 text-center">Nenhuma regra de redirecionamento criada.</TableCell></TableRow>)}
                        </TableBody>
                    </Table>
                 </div>
            </CardContent>
            {totalPages > 1 && (
                <CardFooter className="flex items-center justify-end gap-2 pt-4">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Anterior</Button>
                    <span className="text-sm text-muted-foreground">Página {currentPage} de {totalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Próxima</Button>
                </CardFooter>
            )}
        </Card>
        
        <Card>
            <CardHeader><div className="flex items-center gap-3"><ListFilter className="h-6 w-6 text-primary" /><CardTitle className="font-headline">Filtros de Tráfego</CardTitle></div><CardDescription>Controle quem pode ver seu site com base em vários critérios. As configurações salvas aqui serão aplicadas a este site.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between rounded-lg border p-4"><div className="space-y-0.5"><Label htmlFor="bot-filter" className="text-base">Filtro Anti-Bot</Label><p className="text-sm text-muted-foreground">Bloqueia bots conhecidos e tráfego automatizado.</p></div><Switch id="bot-filter" checked={state.antiBotFilter} onCheckedChange={v => handleStateChange('antiBotFilter', v)} /></div>
                    <div className="flex items-center justify-between rounded-lg border p-4"><div className="space-y-0.5"><Label htmlFor="spy-filter" className="text-base">Filtro Anti-Spy</Label><p className="text-sm text-muted-foreground">Protege contra ferramentas de espionagem de anúncios e concorrentes.</p></div><Switch id="spy-filter" checked={state.antiSpyFilter} onCheckedChange={v => handleStateChange('antiSpyFilter', v)} /></div>
                    <div className="flex items-center justify-between rounded-lg border p-4"><div className="space-y-0.5"><Label htmlFor="emulator-filter" className="text-base">Filtro Anti-Emulador</Label><p className="text-sm text-muted-foreground">Bloqueia o acesso de emuladores.</p></div><Switch id="emulator-filter" checked={state.antiEmulatorFilter} onCheckedChange={v => handleStateChange('antiEmulatorFilter', v)} /></div>
                    <div className="flex items-center justify-between rounded-lg border p-4"><div className="space-y-0.5"><Label htmlFor="cloner-filter" className="text-base">Filtro Anti-Clonagem</Label><p className="text-sm text-muted-foreground">Bloqueia User-Agents de ferramentas de clonagem.</p></div><Switch id="cloner-filter" checked={state.antiClonerFilter} onCheckedChange={v => handleStateChange('antiClonerFilter', v)} /></div>
                    <div className="flex items-center justify-between rounded-lg border p-4"><div className="space-y-0.5"><Label htmlFor="fingerprint-filter" className="text-base">Detecção por Impressão Digital</Label><p className="text-sm text-muted-foreground">Bloqueia o acesso com base em uma análise avançada do navegador.</p></div><Switch id="fingerprint-filter" checked={state.fingerprintDetection} onCheckedChange={v => handleStateChange('fingerprintDetection', v)} /></div>
                </div>
                <Separator />
                <div className="space-y-4 rounded-lg border p-4"><div className="flex items-center justify-between"><div className="flex items-start gap-4"><Link2 className="h-6 w-6 text-primary mt-1 hidden sm:block" /><div className="space-y-0.5"><Label htmlFor="utm-filter-switch" className="text-base font-semibold">Filtro por UTM</Label><p className="text-sm text-muted-foreground">Bloquear acessos que não contenham um `utm_source` específico.</p></div></div><Switch id="utm-filter-switch" checked={state.utmFilterEnabled} onCheckedChange={v => handleStateChange('utmFilterEnabled', v)} /></div>{state.utmFilterEnabled && (<div className="pt-4 border-t mt-4"><div className="space-y-2"><Label htmlFor="utm-source">Exigir `utm_source`</Label><Input id="utm-source" value={state.utmSource} onChange={e => handleStateChange('utmSource', e.target.value)} placeholder="facebook" /><p className="text-xs text-muted-foreground">O visitante só terá acesso se a URL contiver `?utm_source=valor_inserido`.</p></div></div>)}</div>
                <div className="space-y-4 rounded-lg border p-4"><div className="flex items-center justify-between"><div className="flex items-start gap-4"><Globe className="h-6 w-6 text-primary mt-1 hidden sm:block" /><div className="space-y-0.5"><Label htmlFor="geo-filter-switch" className="text-base font-semibold">Filtro por Geolocalização</Label><p className="text-sm text-muted-foreground">Restrinja o acesso com base no país ou cidade do visitante.</p></div></div><Switch id="geo-filter-switch" checked={state.geoFilterEnabled} onCheckedChange={v => handleStateChange('geoFilterEnabled', v)} /></div>{state.geoFilterEnabled && (<div className="grid sm:grid-cols-3 gap-4 pt-4 border-t mt-4"><div className="space-y-2"><Label htmlFor="geo-action">Ação</Label><Select value={state.geoFilterAction} onValueChange={v => handleStateChange('geoFilterAction', v)}><SelectTrigger id="geo-action"><SelectValue placeholder="Selecione a ação" /></SelectTrigger><SelectContent><SelectItem value="block">Bloquear Locais</SelectItem><SelectItem value="allow">Permitir Apenas</SelectItem></SelectContent></Select></div><div className="space-y-2 sm:col-span-2"><Label htmlFor="geo-locations">Lista de Países ou Cidades</Label><Input id="geo-locations" value={state.geoLocations} onChange={e => handleStateChange('geoLocations', e.target.value)} placeholder="Ex: Brasil, Lisboa, Estados Unidos" /><p className="text-xs text-muted-foreground">Use a vírgula para separar os locais.</p></div></div>)}</div>
                <div className="space-y-4 rounded-lg border p-4"><div className="flex items-center justify-between"><div className="flex items-start gap-4"><Laptop className="h-6 w-6 text-primary mt-1 hidden sm:block" /><div className="space-y-0.5"><Label htmlFor="os-filter-switch" className="text-base font-semibold">Filtro por Sistema Operacional</Label><p className="text-sm text-muted-foreground">Filtre visitantes com base no sistema operacional.</p></div></div><Switch id="os-filter-switch" checked={state.osFilterEnabled} onCheckedChange={v => handleStateChange('osFilterEnabled', v)} /></div>{state.osFilterEnabled && (<div className="space-y-4 pt-4 border-t mt-4"><div className="w-full max-w-xs space-y-2"><Label htmlFor="os-action">Ação</Label><Select value={state.osFilterAction} onValueChange={v => handleStateChange('osFilterAction', v)}><SelectTrigger id="os-action"><SelectValue placeholder="Selecione a ação" /></SelectTrigger><SelectContent><SelectItem value="block">Bloquear Selecionados</SelectItem><SelectItem value="allow">Permitir Apenas</SelectItem></SelectContent></Select></div><div><Label>Selecione os Sistemas Operacionais</Label><div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-2">{osOptions.map((os) => (<div key={os.id} className="flex items-center space-x-2"><Checkbox id={`os-${os.id}`} checked={state.selectedOs[os.id]} onCheckedChange={checked => handleCheckboxListChange('selectedOs', os.id, !!checked)} /><Label htmlFor={`os-${os.id}`} className="font-normal">{os.label}</Label></div>))}</div></div></div>)}</div>
                <div className="space-y-4 rounded-lg border p-4"><div className="flex items-center justify-between"><div className="flex items-start gap-4"><ServerOff className="h-6 w-6 text-primary mt-1 hidden sm:block" /><div className="space-y-0.5"><Label htmlFor="ip-filter-switch" className="text-base font-semibold">Filtro de IP</Label><p className="text-sm text-muted-foreground">Bloqueie ou permita endereços de IP específicos.</p></div></div><Switch id="ip-filter-switch" checked={state.ipFilterEnabled} onCheckedChange={v => handleStateChange('ipFilterEnabled', v)} /></div>{state.ipFilterEnabled && (<div className="grid sm:grid-cols-3 gap-4 pt-4 border-t mt-4"><div className="space-y-2"><Label htmlFor="ip-action">Ação</Label><Select value={state.ipFilterAction} onValueChange={v => handleStateChange('ipFilterAction', v)}><SelectTrigger id="ip-action"><SelectValue placeholder="Selecione a ação" /></SelectTrigger><SelectContent><SelectItem value="block">Bloquear IPs da Lista</SelectItem><SelectItem value="allow">Permitir Apenas IPs da Lista</SelectItem></SelectContent></Select></div><div className="space-y-2 sm:col-span-2"><Label htmlFor="ip-list">Lista de IPs</Label><Textarea id="ip-list" value={state.ipList} onChange={e => handleStateChange('ipList', e.target.value)} placeholder="Um IP por linha. Ex: 192.168.1.1\n10.0.0.0/8" rows={4} /><p className="text-xs text-muted-foreground">Você pode usar IPs individuais ou intervalos (CIDR).</p></div></div>)}</div>
                <div className="space-y-4 rounded-lg border p-4"><div className="flex items-center justify-between"><div className="flex items-start gap-4"><ArrowLeftRight className="h-6 w-6 text-primary mt-1 hidden sm:block" /><div className="space-y-0.5"><Label htmlFor="referrer-filter-switch" className="text-base font-semibold">Filtro por Referrer</Label><p className="text-sm text-muted-foreground">Controle o acesso com base no site de origem do visitante.</p></div></div><Switch id="referrer-filter-switch" checked={state.referrerFilterEnabled} onCheckedChange={v => handleStateChange('referrerFilterEnabled', v)} /></div>{state.referrerFilterEnabled && (<div className="grid sm:grid-cols-3 gap-4 pt-4 border-t mt-4"><div className="space-y-2"><Label htmlFor="referrer-action">Ação</Label><Select value={state.referrerFilterAction} onValueChange={v => handleStateChange('referrerFilterAction', v)}><SelectTrigger id="referrer-action"><SelectValue placeholder="Selecione a ação" /></SelectTrigger><SelectContent><SelectItem value="block">Bloquear Referrers</SelectItem><SelectItem value="allow">Permitir Apenas Referrers</SelectItem></SelectContent></Select></div><div className="space-y-2 sm:col-span-2"><Label htmlFor="referrer-list">Lista de Referrers (Domínios)</Label><Textarea id="referrer-list" value={state.referrerList} onChange={e => handleStateChange('referrerList', e.target.value)} placeholder="Um domínio por linha. Ex: facebook.com\ngoogle.com" rows={4} /><p className="text-xs text-muted-foreground">Insira apenas o domínio, sem https://.</p></div></div>)}</div>
                <div className="space-y-4 rounded-lg border p-4"><div className="flex items-center justify-between"><div className="flex items-start gap-4"><Fingerprint className="h-6 w-6 text-primary mt-1 hidden sm:block" /><div className="space-y-0.5"><Label htmlFor="user-agent-filter-switch" className="text-base font-semibold">Filtro por User-Agent</Label><p className="text-sm text-muted-foreground">Filtre por tipo de navegador, sistema ou bot específico.</p></div></div><Switch id="user-agent-filter-switch" checked={state.userAgentFilterEnabled} onCheckedChange={v => handleStateChange('userAgentFilterEnabled', v)} /></div>{state.userAgentFilterEnabled && (<div className="grid sm:grid-cols-3 gap-4 pt-4 border-t mt-4"><div className="space-y-2"><Label htmlFor="user-agent-action">Ação</Label><Select value={state.userAgentFilterAction} onValueChange={v => handleStateChange('userAgentFilterAction', v)}><SelectTrigger id="user-agent-action"><SelectValue placeholder="Selecione a ação" /></SelectTrigger><SelectContent><SelectItem value="block">Bloquear User-Agents</SelectItem><SelectItem value="allow">Permitir Apenas User-Agents</SelectItem></SelectContent></Select></div><div className="space-y-2 sm:col-span-2"><Label htmlFor="user-agent-list">Lista de User-Agents</Label><Textarea id="user-agent-list" value={state.userAgentList} onChange={e => handleStateChange('userAgentList', e.target.value)} placeholder="Uma string ou palavra-chave por linha. Ex: GoogleBot\nAhrefsBot" rows={4} /><p className="text-xs text-muted-foreground">A correspondência é parcial (contém a string).</p></div></div>)}</div>
                <div className="space-y-4 rounded-lg border p-4"><div className="flex items-center justify-between"><div className="flex items-start gap-4"><WifiOff className="h-6 w-6 text-primary mt-1 hidden sm:block" /><div className="space-y-0.5"><Label htmlFor="isp-filter-switch" className="text-base font-semibold">Filtro por Provedor de Internet (ISP)</Label><p className="text-sm text-muted-foreground">Bloqueie tráfego de data centers e provedores conhecidos por bots.</p></div></div><Switch id="isp-filter-switch" checked={state.ispFilterEnabled} onCheckedChange={v => handleStateChange('ispFilterEnabled', v)} /></div>{state.ispFilterEnabled && (<div className="grid sm:grid-cols-3 gap-4 pt-4 border-t mt-4"><div className="space-y-2"><Label htmlFor="isp-action">Ação</Label><Select value={state.ispFilterAction} onValueChange={v => handleStateChange('ispFilterAction', v)}><SelectTrigger id="isp-action"><SelectValue placeholder="Selecione a ação" /></SelectTrigger><SelectContent><SelectItem value="block">Bloquear ISPs</SelectItem><SelectItem value="allow">Permitir Apenas ISPs</SelectItem></SelectContent></Select></div><div className="space-y-2 sm:col-span-2"><Label htmlFor="isp-list">Lista de ISPs</Label><Textarea id="isp-list" value={state.ispList} onChange={e => handleStateChange('ispList', e.target.value)} placeholder="Um nome de provedor por linha. Ex: Google Cloud\nOVH SAS" rows={4} /><p className="text-xs text-muted-foreground">A correspondência é parcial (contém o nome).</p></div></div>)}</div>
                <div className="space-y-4 rounded-lg border p-4"><div className="flex items-center justify-between"><div className="flex items-start gap-4"><Clock className="h-6 w-6 text-primary mt-1 hidden sm:block" /><div className="space-y-0.5"><Label htmlFor="time-filter-switch" className="text-base font-semibold">Filtro por Horário (Agendamento)</Label><p className="text-sm text-muted-foreground">Defina quando sua página principal ficará ativa.</p></div></div><Switch id="time-filter-switch" checked={state.timeFilterEnabled} onCheckedChange={v => handleStateChange('timeFilterEnabled', v)} /></div>{state.timeFilterEnabled && (<div className="space-y-6 pt-4 border-t mt-4"><div><Label>Dias da Semana Ativos</Label><div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 pt-2">{dayOptions.map((day) => (<div key={day.id} className="flex items-center space-x-2"><Checkbox id={`day-${day.id}`} checked={state.selectedDays[day.id] ?? false} onCheckedChange={checked => handleCheckboxListChange('selectedDays', day.id, !!checked)} /><Label htmlFor={`day-${day.id}`} className="font-normal">{day.label}</Label></div>))}</div></div><div className="grid sm:grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="start-time">Horário de Início</Label><Input id="start-time" type="time" value={state.startTime} onChange={e => handleStateChange('startTime', e.target.value)} /></div><div className="space-y-2"><Label htmlFor="end-time">Horário de Fim</Label><Input id="end-time" type="time" value={state.endTime} onChange={e => handleStateChange('endTime', e.target.value)} /></div></div></div>)}</div>
            </CardContent>
        </Card>

        <div className="flex justify-end">
            <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Configurações do Cloaker
            </Button>
        </div>
    </div>
  );
}
