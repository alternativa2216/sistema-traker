'use client'

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ListFilter, ServerOff, ArrowLeftRight, Fingerprint, WifiOff, Clock, ShieldAlert, Link2, Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const CloakerOption = ({ id, label, description, children }: { id: string, label: string, description: string, children?: React.ReactNode }) => (
    <div className="flex items-start sm:items-center justify-between rounded-lg border p-4 flex-col sm:flex-row gap-4">
        <div className="space-y-0.5">
            <Label htmlFor={id} className="text-base">{label}</Label>
            <p className="text-sm text-muted-foreground">
                {description}
            </p>
        </div>
        {children || <Switch id={id} />}
    </div>
);

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

const mockThreats = [
  {
    userAgent: "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)",
    reason: "Bot de SEO conhecido. Pode estar copiando seu conteúdo.",
    type: "Bot de SEO",
  },
  {
    userAgent: "python-requests/2.25.1",
    reason: "User-agent comum para scripts automatizados e scraping.",
    type: "Scraping",
  },
  {
    userAgent: "HTTrack/3.x",
    reason: "Ferramenta de clonagem de site detectada. Ative o Filtro Anti-Clonagem.",
    type: "Clonagem de Site",
  }
];

export default function CloakerPage() {
  const { toast } = useToast();
  const [geoFilterEnabled, setGeoFilterEnabled] = React.useState(false);
  const [osFilterEnabled, setOsFilterEnabled] = React.useState(false);
  const [ipFilterEnabled, setIpFilterEnabled] = React.useState(false);
  const [referrerFilterEnabled, setReferrerFilterEnabled] = React.useState(false);
  const [userAgentFilterEnabled, setUserAgentFilterEnabled] = React.useState(false);
  const [ispFilterEnabled, setIspFilterEnabled] = React.useState(false);
  const [timeFilterEnabled, setTimeFilterEnabled] = React.useState(false);
  const [utmFilterEnabled, setUtmFilterEnabled] = React.useState(false);

  const handleAddToBlocklist = (userAgent: string) => {
    // In a real app, this would update the state or call an API
    toast({
      title: "User-Agent Adicionado",
      description: `${userAgent} foi adicionado à sua lista de bloqueio de User-Agent.`,
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
                <CloakerOption 
                    id="block-right-click"
                    label="Bloquear Clique Direito"
                    description="Desativa o menu de contexto do navegador para impedir a cópia fácil de conteúdo."
                />
                <CloakerOption 
                    id="block-f12"
                    label="Bloquear Ferramentas de Desenvolvedor"
                    description="Impede o acesso às ferramentas de inspeção do navegador (F12, Inspencionar Elemento)."
                />
                 <div className="flex items-start sm:items-center justify-between rounded-lg border p-4 flex-col sm:flex-row gap-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="redirect-url" className="text-base">Redirecionar ao Inspecionar</Label>
                        <p className="text-sm text-muted-foreground">
                            Se um usuário abrir as ferramentas de desenvolvedor, ele será redirecionado para esta URL.
                        </p>
                    </div>
                    <Input id="redirect-url" placeholder="https://google.com" className="w-full sm:max-w-xs" />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <ShieldAlert className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline">Análise de Ameaças e Recomendações</CardTitle>
                </div>
                <CardDescription>
                    Nossa IA detectou atividades suspeitas. Recomendamos adicionar os seguintes User-Agents à sua lista de bloqueio.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {mockThreats.map((threat, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-3 gap-3">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">{threat.userAgent}</p>
                            <p className="text-xs text-muted-foreground">{threat.reason}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleAddToBlocklist(threat.userAgent)}>Adicionar ao Bloqueio</Button>
                    </div>
                ))}
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
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Regra
                    </Button>
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
                            <TableRow>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        <Badge variant="secondary">País: Brasil</Badge>
                                        <Badge variant="secondary">Dispositivo: Mobile</Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono">/lp/oferta-br-mobile</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        <Badge variant="secondary">País: Portugal</Badge>
                                        <Badge variant="secondary">S.O.: Windows</Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono">/lp/oferta-pt-desktop</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                 </div>
            </CardContent>
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
                    <CloakerOption
                        id="bot-filter"
                        label="Filtro Anti-Bot"
                        description="Bloqueia bots conhecidos e tráfego automatizado."
                    />
                    <CloakerOption
                        id="spy-filter"
                        label="Filtro Anti-Spy"
                        description="Protege contra ferramentas de espionagem de anúncios e concorrentes."
                    />
                    <CloakerOption
                        id="emulator-filter"
                        label="Filtro Anti-Emulador"
                        description="Bloqueia o acesso de emuladores de Android e iOS, comumente usados para inspeção e clonagem de páginas."
                    />
                     <CloakerOption
                        id="cloner-filter"
                        label="Filtro Anti-Clonagem"
                        description="Bloqueia User-Agents de ferramentas conhecidas de clonagem de sites como HTTrack, Wget e outras."
                    />
                    <CloakerOption
                        id="fingerprint-filter"
                        label="Detecção por Impressão Digital"
                        description="Bloqueia o acesso com base em uma análise avançada do navegador (fontes, plugins, etc.) para identificar bots e emuladores."
                    />
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
                                <Input id="utm-source" placeholder="facebook" />
                                <p className="text-xs text-muted-foreground">O visitante só terá acesso se a URL contiver `?utm_source=valor_inserido`.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Geo Filter Section */}
                <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="geo-filter-switch" className="text-base font-semibold">
                                Filtro por Geolocalização
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Restrinja o acesso com base no país ou cidade do visitante.
                            </p>
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
                                <Select defaultValue="block">
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
                        <div className="space-y-0.5">
                            <Label htmlFor="os-filter-switch" className="text-base font-semibold">
                                Filtro por Sistema Operacional
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Filtre visitantes com base no sistema operacional.
                            </p>
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
                                <Select defaultValue="block">
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
                                            <Checkbox id={`os-${os.id}`} />
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
                                <Select defaultValue="block">
                                    <SelectTrigger id="ip-action"><SelectValue placeholder="Selecione a ação" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="block">Bloquear IPs da Lista</SelectItem>
                                        <SelectItem value="allow">Permitir Apenas IPs da Lista</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="ip-list">Lista de IPs</Label>
                                <Textarea id="ip-list" placeholder="Um IP por linha. Ex: 192.168.1.1&#10;10.0.0.0/8" rows={4} />
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
                                <Select defaultValue="allow">
                                    <SelectTrigger id="referrer-action"><SelectValue placeholder="Selecione a ação" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="block">Bloquear Referrers</SelectItem>
                                        <SelectItem value="allow">Permitir Apenas Referrers</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="referrer-list">Lista de Referrers (Domínios)</Label>
                                <Textarea id="referrer-list" placeholder="Um domínio por linha. Ex: facebook.com&#10;google.com" rows={4} />
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
                                <Select defaultValue="block">
                                    <SelectTrigger id="user-agent-action"><SelectValue placeholder="Selecione a ação" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="block">Bloquear User-Agents</SelectItem>
                                        <SelectItem value="allow">Permitir Apenas User-Agents</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="user-agent-list">Lista de User-Agents</Label>
                                <Textarea id="user-agent-list" placeholder="Uma string ou palavra-chave por linha. Ex: GoogleBot&#10;AhrefsBot" rows={4} />
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
                                <Select defaultValue="block">
                                    <SelectTrigger id="isp-action"><SelectValue placeholder="Selecione a ação" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="block">Bloquear ISPs</SelectItem>
                                        <SelectItem value="allow">Permitir Apenas ISPs</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="isp-list">Lista de ISPs</Label>
                                <Textarea id="isp-list" placeholder="Um nome de provedor por linha. Ex: Google Cloud&#10;OVH SAS" rows={4} />
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
                                            <Checkbox id={`day-${day.id}`} />
                                            <Label htmlFor={`day-${day.id}`} className="font-normal">{day.label}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start-time">Horário de Início</Label>
                                    <Input id="start-time" type="time" defaultValue="09:00" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end-time">Horário de Fim</Label>
                                    <Input id="end-time" type="time" defaultValue="18:00" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </CardContent>
        </Card>

        <div className="flex justify-end">
            <Button>Salvar Configurações do Cloaker</Button>
        </div>
    </div>
  );
}
