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

const mockThreats: any[] = [];

interface RuleCondition {
  type: 'País' | 'Dispositivo' | 'S.O.';
  value: string;
}

interface Rule {
  id: string;
  conditions: RuleCondition[];
  redirectUrl: string;
}

const initialRules: Rule[] = [];


export default function CloakerPage() {
  const { toast } = useToast();
  const params = useParams() as { siteId: string };

  // General Cloaker Settings
  const [blockRightClick, setBlockRightClick] = React.useState(false);
  const [blockDevTools, setBlockDevTools] = React.useState(false);
  const [redirectOnInspectUrl, setRedirectOnInspectUrl] = React.useState('https://google.com');

  // Device Redirect
  const [redirectMobileEnabled, setRedirectMobileEnabled] = React.useState(false);
  const [mobileRedirectUrl, setMobileRedirectUrl] = React.useState('');
  const [redirectDesktopEnabled, setRedirectDesktopEnabled] = React.useState(false);
  const [desktopRedirectUrl, setDesktopRedirectUrl] = React.useState('');

  // Traffic Filters
  const [antiBotFilter, setAntiBotFilter] = React.useState(true);
  const [antiSpyFilter, setAntiSpyFilter] = React.useState(true);
  const [antiEmulatorFilter, setAntiEmulatorFilter] = React.useState(false);
  const [antiClonerFilter, setAntiClonerFilter] = React.useState(true);
  const [fingerprintDetection, setFingerprintDetection] = React.useState(false);
  
  // Advanced Filters State
  const [utmFilterEnabled, setUtmFilterEnabled] = React.useState(false);
  const [utmSource, setUtmSource] = React.useState('');
  const [geoFilterEnabled, setGeoFilterEnabled] = React.useState(false);
  const [geoFilterAction, setGeoFilterAction] = React.useState('block');
  const [geoLocations, setGeoLocations] = React.useState('');
  const [osFilterEnabled, setOsFilterEnabled] = React.useState(false);
  const [osFilterAction, setOsFilterAction] = React.useState('block');
  const [selectedOs, setSelectedOs] = React.useState<Record<string, boolean>>({});
  const [ipFilterEnabled, setIpFilterEnabled] = React.useState(false);
  const [ipFilterAction, setIpFilterAction] = React.useState('block');
  const [ipList, setIpList] = React.useState('');
  const [referrerFilterEnabled, setReferrerFilterEnabled] = React.useState(false);
  const [referrerFilterAction, setReferrerFilterAction] = React.useState('allow');
  const [referrerList, setReferrerList] = React.useState('');
  const [userAgentFilterEnabled, setUserAgentFilterEnabled] = React.useState(false);
  const [userAgentFilterAction, setUserAgentFilterAction] = React.useState('block');
  const [userAgentList, setUserAgentList] = React.useState('');
  const [ispFilterEnabled, setIspFilterEnabled] = React.useState(false);
  const [ispFilterAction, setIspFilterAction] = React.useState('block');
  const [ispList, setIspList] = React.useState('');
  const [timeFilterEnabled, setTimeFilterEnabled] = React.useState(false);
  const [selectedDays, setSelectedDays] = React.useState<Record<string, boolean>>({});
  const [startTime, setStartTime] = React.useState('09:00');
  const [endTime, setEndTime] = React.useState('18:00');

  // Advanced Rules
  const [rules, setRules] = React.useState<Rule[]>(initialRules);
  const [currentPage, setCurrentPage] = React.useState(1);
  const RULES_PER_PAGE = 5;
  const totalPages = Math.ceil(rules.length / RULES_PER_PAGE);
  const paginatedRules = rules.slice((currentPage - 1) * RULES_PER_PAGE, currentPage * RULES_PER_PAGE);
  
  const [isAddRuleDialogOpen, setIsAddRuleDialogOpen] = React.useState(false);
  const [newRuleCountry, setNewRuleCountry] = React.useState('');
  const [newRuleDevice, setNewRuleDevice] = React.useState('');
  const [newRuleOs, setNewRuleOs] = React.useState('');
  const [newRuleRedirectUrl, setNewRuleRedirectUrl] = React.useState('');
  
  const handleDeleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
    toast({
        title: "Regra Removida",
        description: "A regra de redirecionamento foi removida.",
    });
  };

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
          setRules(prev => [newRule, ...prev]);
          setNewRuleCountry('');
          setNewRuleDevice('');
          setNewRuleOs('');
          setNewRuleRedirectUrl('');
          setIsAddRuleDialogOpen(false);
          toast({
              title: "Regra Adicionada",
              description: "A nova regra de redirecionamento foi salva.",
          });
      } else {
          toast({
              title: "Erro",
              description: "Preencha pelo menos uma condição e a URL de redirecionamento.",
              variant: "destructive",
          });
      }
  };

  const handleSaveSettings = () => {
    // In a real app, this would collect all state and send it to the backend.
    toast({
      title: "Configurações Salvas!",
      description: "Suas configurações do cloaker foram salvas e serão aplicadas em tempo real."
    });
  };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Configurações Gerais do Cloaker</CardTitle>
                <CardDescription>
                    Proteja seu conteúdo e impeça a inspeção manual do seu site.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="block-right-click" className="text-base">Bloquear Clique Direito</Label>
                        <p className="text-sm text-muted-foreground">Desativa o menu de contexto do navegador para impedir a cópia fácil de conteúdo.</p>
                    </div>
                    <Switch id="block-right-click" checked={blockRightClick} onCheckedChange={setBlockRightClick} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="block-f12" className="text-base">Bloquear Ferramentas de Desenvolvedor</Label>
                        <p className="text-sm text-muted-foreground">Impede o acesso às ferramentas de inspeção do navegador (F12, Inspencionar Elemento).</p>
                    </div>
                    <Switch id="block-f12" checked={blockDevTools} onCheckedChange={setBlockDevTools} />
                </div>
                 <div className="flex items-start sm:items-center justify-between rounded-lg border p-4 flex-col sm:flex-row gap-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="redirect-url" className="text-base">Redirecionar ao Inspecionar</Label>
                        <p className="text-sm text-muted-foreground">
                            Se um usuário abrir as ferramentas de desenvolvedor, ele será redirecionado para esta URL.
                        </p>
                    </div>
                    <Input id="redirect-url" value={redirectOnInspectUrl} onChange={(e) => setRedirectOnInspectUrl(e.target.value)} placeholder="https://google.com" className="w-full sm:max-w-xs" />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <ShieldAlert className="h-6 w-6 text-destructive" />
                    <CardTitle className="font-headline">Monitoramento de Ameaças Ativas</CardTitle>
                </div>
                <CardDescription>
                    Nossa IA monitora e bloqueia automaticamente atividades suspeitas em tempo real para proteger seu site.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-center text-muted-foreground p-8">
                  Nenhuma ameaça ativa detectada. Vá para os <Link href={`/dashboard/sites/${params.siteId}/security-logs`} className="text-primary hover:underline">Logs de Segurança</Link> para ver o histórico.
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Redirecionamento por Dispositivo</CardTitle>
                <CardDescription>Redirecione os visitantes para URLs diferentes com base no dispositivo que eles estão usando.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-4 rounded-lg border p-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                          <MonitorSmartphone className="h-6 w-6 text-primary mt-1 hidden sm:block" />
                          <div className="space-y-0.5">
                              <Label htmlFor="mobile-redirect-switch" className="text-base font-semibold">Redirecionamento Mobile</Label>
                              <p className="text-sm text-muted-foreground">Ative para redirecionar usuários de dispositivos móveis.</p>
                          </div>
                        </div>
                        <Switch id="mobile-redirect-switch" checked={redirectMobileEnabled} onCheckedChange={setRedirectMobileEnabled} />
                    </div>
                    {redirectMobileEnabled && (
                        <div className="pt-4 border-t mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="mobile-url">URL Mobile</Label>
                                <Input id="mobile-url" value={mobileRedirectUrl} onChange={(e) => setMobileRedirectUrl(e.target.value)} placeholder="https://seusite.com/lp-mobile" />
                            </div>
                        </div>
                    )}
                </div>
                 <div className="space-y-4 rounded-lg border p-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                          <Laptop className="h-6 w-6 text-primary mt-1 hidden sm:block" />
                          <div className="space-y-0.5">
                              <Label htmlFor="desktop-redirect-switch" className="text-base font-semibold">Redirecionamento Desktop</Label>
                              <p className="text-sm text-muted-foreground">Ative para redirecionar usuários de computadores.</p>
                          </div>
                        </div>
                        <Switch id="desktop-redirect-switch" checked={redirectDesktopEnabled} onCheckedChange={setRedirectDesktopEnabled} />
                    </div>
                    {redirectDesktopEnabled && (
                        <div className="pt-4 border-t mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="desktop-url">URL Desktop</Label>
                                <Input id="desktop-url" value={desktopRedirectUrl} onChange={(e) => setDesktopRedirectUrl(e.target.value)} placeholder="https://seusite.com/lp-desktop" />
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="font-headline">Regras de Redirecionamento Avançado</CardTitle>
                        <CardDescription>
                           Crie regras complexas para redirecionar o tráfego com base em múltiplas condições.
                        </CardDescription>
                    </div>
                    <Dialog open={isAddRuleDialogOpen} onOpenChange={setIsAddRuleDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Regra
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[480px]">
                            <DialogHeader>
                                <DialogTitle>Adicionar Nova Regra</DialogTitle>
                                <DialogDescription>
                                    Defina as condições e a URL de redirecionamento. A regra será aplicada se TODAS as condições forem atendidas. Deixe um campo em branco se não quiser usá-lo como condição.
                                </DialogDescription>
                            </DialogHeader>
                            <form id="add-rule-form" onSubmit={handleAddRule} className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="country" className="text-right">País</Label>
                                    <Input id="country" value={newRuleCountry} onChange={(e) => setNewRuleCountry(e.target.value)} className="col-span-3" placeholder="Ex: Brasil, Portugal"/>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="device" className="text-right">Dispositivo</Label>
                                    <Input id="device" value={newRuleDevice} onChange={(e) => setNewRuleDevice(e.target.value)} className="col-span-3" placeholder="Ex: Mobile, Desktop"/>
                                </div>
                                 <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="os" className="text-right">S.O.</Label>
                                    <Input id="os" value={newRuleOs} onChange={(e) => setNewRuleOs(e.target.value)} className="col-span-3" placeholder="Ex: Windows, iOS"/>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="redirectUrl" className="text-right">URL de Redirec.</Label>
                                    <Input id="redirectUrl" value={newRuleRedirectUrl} onChange={(e) => setNewRuleRedirectUrl(e.target.value)} className="col-span-3" placeholder="/nova-oferta" required/>
                                </div>
                            </form>
                            <DialogFooter>
                                <Button type="submit" form="add-rule-form">Salvar Regra</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Condições</TableHead>
                                <TableHead>URL de Redirecionamento</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedRules.length > 0 ? paginatedRules.map(rule => (
                                <TableRow key={rule.id}>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {rule.conditions.map(condition => (
                                                <Badge key={condition.value} variant="secondary">{condition.type}: {condition.value}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono">{rule.redirectUrl}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">Nenhuma regra de redirecionamento criada.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                 </div>
            </CardContent>
            {totalPages > 1 && (
                <CardFooter className="flex items-center justify-end gap-2 pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Próxima
                    </Button>
                </CardFooter>
            )}
        </Card>
        
        <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <ListFilter className="h-6 w-6 text-primary" />
                <CardTitle className="font-headline">Filtros de Tráfego</CardTitle>
              </div>
              <CardDescription>
                Controle quem pode ver seu site com base em vários critérios. As configurações salvas aqui serão aplicadas a este site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 {/* Simple Filters */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="bot-filter" className="text-base">Filtro Anti-Bot</Label>
                            <p className="text-sm text-muted-foreground">Bloqueia bots conhecidos e tráfego automatizado.</p>
                        </div>
                        <Switch id="bot-filter" checked={antiBotFilter} onCheckedChange={setAntiBotFilter} />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="spy-filter" className="text-base">Filtro Anti-Spy</Label>
                            <p className="text-sm text-muted-foreground">Protege contra ferramentas de espionagem de anúncios e concorrentes.</p>
                        </div>
                        <Switch id="spy-filter" checked={antiSpyFilter} onCheckedChange={setAntiSpyFilter} />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="emulator-filter" className="text-base">Filtro Anti-Emulador</Label>
                            <p className="text-sm text-muted-foreground">Bloqueia o acesso de emuladores.</p>
                        </div>
                        <Switch id="emulator-filter" checked={antiEmulatorFilter} onCheckedChange={setAntiEmulatorFilter} />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="cloner-filter" className="text-base">Filtro Anti-Clonagem</Label>
                            <p className="text-sm text-muted-foreground">Bloqueia User-Agents de ferramentas de clonagem.</p>
                        </div>
                        <Switch id="cloner-filter" checked={antiClonerFilter} onCheckedChange={setAntiClonerFilter} />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="fingerprint-filter" className="text-base">Detecção por Impressão Digital</Label>
                            <p className="text-sm text-muted-foreground">Bloqueia o acesso com base em uma análise avançada do navegador.</p>
                        </div>
                        <Switch id="fingerprint-filter" checked={fingerprintDetection} onCheckedChange={setFingerprintDetection} />
                    </div>
                </div>
                
                <Separator />

                 {/* UTM Filter */}
                <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-start gap-4">
                          <Link2 className="h-6 w-6 text-primary mt-1 hidden sm:block" />
                          <div className="space-y-0.5">
                              <Label htmlFor="utm-filter-switch" className="text-base font-semibold">Filtro por UTM</Label>
                              <p className="text-sm text-muted-foreground">Bloquear acessos que não contenham um `utm_source` específico.</p>
                          </div>
                        </div>
                        <Switch id="utm-filter-switch" checked={utmFilterEnabled} onCheckedChange={setUtmFilterEnabled} />
                    </div>
                    {utmFilterEnabled && (
                        <div className="pt-4 border-t mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="utm-source">Exigir `utm_source`</Label>
                                <Input id="utm-source" value={utmSource} onChange={(e) => setUtmSource(e.target.value)} placeholder="facebook" />
                                <p className="text-xs text-muted-foreground">O visitante só terá acesso se a URL contiver `?utm_source=valor_inserido`.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Geo Filter Section */}
                <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                          <Globe className="h-6 w-6 text-primary mt-1 hidden sm:block" />
                          <div className="space-y-0.5">
                              <Label htmlFor="geo-filter-switch" className="text-base font-semibold">
                                  Filtro por Geolocalização
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                  Restrinja o acesso com base no país ou cidade do visitante.
                              </p>
                          </div>
                        </div>
                        <Switch
                            id="geo-filter-switch"
                            checked={geoFilterEnabled}
                            onCheckedChange={setGeoFilterEnabled}
                        />
                    </div>
                    {geoFilterEnabled && (
                        <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="geo-action">Ação</Label>
                                <Select value={geoFilterAction} onValueChange={setGeoFilterAction}>
                                    <SelectTrigger id="geo-action">
                                        <SelectValue placeholder="Selecione a ação" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="block">Bloquear Locais</SelectItem>
                                        <SelectItem value="allow">Permitir Apenas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="geo-locations">Lista de Países ou Cidades</Label>
                                <Input
                                    id="geo-locations"
                                    value={geoLocations} onChange={(e) => setGeoLocations(e.target.value)}
                                    placeholder="Ex: Brasil, Lisboa, Estados Unidos"
                                />
                                 <p className="text-xs text-muted-foreground">Use a vírgula para separar os locais.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* OS Filter Section */}
                <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-start gap-4">
                          <Laptop className="h-6 w-6 text-primary mt-1 hidden sm:block" />
                           <div className="space-y-0.5">
                               <Label htmlFor="os-filter-switch" className="text-base font-semibold">
                                   Filtro por Sistema Operacional
                               </Label>
                               <p className="text-sm text-muted-foreground">
                                   Filtre visitantes com base no sistema operacional.
                               </p>
                           </div>
                       </div>
                        <Switch
                            id="os-filter-switch"
                            checked={osFilterEnabled}
                            onCheckedChange={setOsFilterEnabled}
                        />
                    </div>
                    {osFilterEnabled && (
                        <div className="space-y-4 pt-4 border-t mt-4">
                            <div className="w-full max-w-xs space-y-2">
                                <Label htmlFor="os-action">Ação</Label>
                                <Select value={osFilterAction} onValueChange={setOsFilterAction}>
                                    <SelectTrigger id="os-action">
                                        <SelectValue placeholder="Selecione a ação" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="block">Bloquear Selecionados</SelectItem>
                                        <SelectItem value="allow">Permitir Apenas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Selecione os Sistemas Operacionais</Label>
                                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-2">
                                    {osOptions.map((os) => (
                                        <div key={os.id} className="flex items-center space-x-2">
                                            <Checkbox id={`os-${os.id}`} checked={selectedOs[os.id]} onCheckedChange={checked => setSelectedOs(prev => ({...prev, [os.id]: !!checked}))} />
                                            <Label htmlFor={`os-${os.id}`} className="font-normal">{os.label}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* IP Filter */}
                <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-start gap-4">
                          <ServerOff className="h-6 w-6 text-primary mt-1 hidden sm:block" />
                          <div className="space-y-0.5">
                              <Label htmlFor="ip-filter-switch" className="text-base font-semibold">Filtro de IP</Label>
                              <p className="text-sm text-muted-foreground">Bloqueie ou permita endereços de IP específicos.</p>
                          </div>
                        </div>
                        <Switch id="ip-filter-switch" checked={ipFilterEnabled} onCheckedChange={setIpFilterEnabled} />
                    </div>
                    {ipFilterEnabled && (
                        <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="ip-action">Ação</Label>
                                <Select value={ipFilterAction} onValueChange={setIpFilterAction}>
                                    <SelectTrigger id="ip-action"><SelectValue placeholder="Selecione a ação" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="block">Bloquear IPs da Lista</SelectItem>
                                        <SelectItem value="allow">Permitir Apenas IPs da Lista</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="ip-list">Lista de IPs</Label>
                                <Textarea id="ip-list" value={ipList} onChange={e => setIpList(e.target.value)} placeholder="Um IP por linha. Ex: 192.168.1.1\n10.0.0.0/8" rows={4} />
                                <p className="text-xs text-muted-foreground">Você pode usar IPs individuais ou intervalos (CIDR).</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Referrer Filter */}
                <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-start gap-4">
                          <ArrowLeftRight className="h-6 w-6 text-primary mt-1 hidden sm:block" />
                          <div className="space-y-0.5">
                              <Label htmlFor="referrer-filter-switch" className="text-base font-semibold">Filtro por Referrer</Label>
                              <p className="text-sm text-muted-foreground">Controle o acesso com base no site de origem do visitante.</p>
                          </div>
                        </div>
                        <Switch id="referrer-filter-switch" checked={referrerFilterEnabled} onCheckedChange={setReferrerFilterEnabled} />
                    </div>
                    {referrerFilterEnabled && (
                        <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="referrer-action">Ação</Label>
                                <Select value={referrerFilterAction} onValueChange={setReferrerFilterAction}>
                                    <SelectTrigger id="referrer-action"><SelectValue placeholder="Selecione a ação" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="block">Bloquear Referrers</SelectItem>
                                        <SelectItem value="allow">Permitir Apenas Referrers</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="referrer-list">Lista de Referrers (Domínios)</Label>
                                <Textarea id="referrer-list" value={referrerList} onChange={e => setReferrerList(e.target.value)} placeholder="Um domínio por linha. Ex: facebook.com\ngoogle.com" rows={4} />
                                <p className="text-xs text-muted-foreground">Insira apenas o domínio, sem https://.</p>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* User-Agent Filter */}
                <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-start gap-4">
                          <Fingerprint className="h-6 w-6 text-primary mt-1 hidden sm:block" />
                          <div className="space-y-0.5">
                              <Label htmlFor="user-agent-filter-switch" className="text-base font-semibold">Filtro por User-Agent</Label>
                              <p className="text-sm text-muted-foreground">Filtre por tipo de navegador, sistema ou bot específico.</p>
                          </div>
                        </div>
                        <Switch id="user-agent-filter-switch" checked={userAgentFilterEnabled} onCheckedChange={setUserAgentFilterEnabled} />
                    </div>
                    {userAgentFilterEnabled && (
                        <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="user-agent-action">Ação</Label>
                                <Select value={userAgentFilterAction} onValueChange={setUserAgentFilterAction}>
                                    <SelectTrigger id="user-agent-action"><SelectValue placeholder="Selecione a ação" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="block">Bloquear User-Agents</SelectItem>
                                        <SelectItem value="allow">Permitir Apenas User-Agents</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="user-agent-list">Lista de User-Agents</Label>
                                <Textarea id="user-agent-list" value={userAgentList} onChange={e => setUserAgentList(e.target.value)} placeholder="Uma string ou palavra-chave por linha. Ex: GoogleBot\nAhrefsBot" rows={4} />
                                <p className="text-xs text-muted-foreground">A correspondência é parcial (contém a string).</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ISP Filter */}
                <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-start gap-4">
                          <WifiOff className="h-6 w-6 text-primary mt-1 hidden sm:block" />
                          <div className="space-y-0.5">
                              <Label htmlFor="isp-filter-switch" className="text-base font-semibold">Filtro por Provedor de Internet (ISP)</Label>
                              <p className="text-sm text-muted-foreground">Bloqueie tráfego de data centers e provedores conhecidos por bots.</p>
                          </div>
                        </div>
                        <Switch id="isp-filter-switch" checked={ispFilterEnabled} onCheckedChange={setIspFilterEnabled} />
                    </div>
                    {ispFilterEnabled && (
                        <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="isp-action">Ação</Label>
                                <Select value={ispFilterAction} onValueChange={setIspFilterAction}>
                                    <SelectTrigger id="isp-action"><SelectValue placeholder="Selecione a ação" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="block">Bloquear ISPs</SelectItem>
                                        <SelectItem value="allow">Permitir Apenas ISPs</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="isp-list">Lista de ISPs</Label>
                                <Textarea id="isp-list" value={ispList} onChange={e => setIspList(e.target.value)} placeholder="Um nome de provedor por linha. Ex: Google Cloud\nOVH SAS" rows={4} />
                                <p className="text-xs text-muted-foreground">A correspondência é parcial (contém o nome).</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Time Filter */}
                <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-start gap-4">
                          <Clock className="h-6 w-6 text-primary mt-1 hidden sm:block" />
                          <div className="space-y-0.5">
                              <Label htmlFor="time-filter-switch" className="text-base font-semibold">Filtro por Horário (Agendamento)</Label>
                              <p className="text-sm text-muted-foreground">Defina quando sua página principal ficará ativa.</p>
                          </div>
                        </div>
                        <Switch id="time-filter-switch" checked={timeFilterEnabled} onCheckedChange={setTimeFilterEnabled} />
                    </div>
                    {timeFilterEnabled && (
                        <div className="space-y-6 pt-4 border-t mt-4">
                            <div>
                                <Label>Dias da Semana Ativos</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 pt-2">
                                    {dayOptions.map((day) => (
                                        <div key={day.id} className="flex items-center space-x-2">
                                            <Checkbox id={`day-${day.id}`} checked={selectedDays[day.id]} onCheckedChange={checked => setSelectedDays(prev => ({...prev, [day.id]: !!checked}))} />
                                            <Label htmlFor={`day-${day.id}`} className="font-normal">{day.label}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start-time">Horário de Início</Label>
                                    <Input id="start-time" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end-time">Horário de Fim</Label>
                                    <Input id="end-time" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </CardContent>
        </Card>

        <div className="flex justify-end">
            <Button onClick={handleSaveSettings}>Salvar Configurações do Cloaker</Button>
        </div>
    </div>
  );
}
