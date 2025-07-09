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

export default function CloakerPage() {
  const [desktopRedirectEnabled, setDesktopRedirectEnabled] = React.useState(false);
  const [mobileRedirectEnabled, setMobileRedirectEnabled] = React.useState(false);
  const [geoFilterEnabled, setGeoFilterEnabled] = React.useState(false);
  const [osFilterEnabled, setOsFilterEnabled] = React.useState(false);

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Configurações do Cloaker</CardTitle>
                <CardDescription>
                    Proteja seu conteúdo e filtre o tráfego indesejado com nossas ferramentas avançadas de cloaking.
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
                <CardTitle className="font-headline">Redirecionamento por Dispositivo</CardTitle>
                <CardDescription>
                    Envie visitantes para URLs diferentes com base no dispositivo. Ative individualmente para Desktop ou Mobile.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Desktop Section */}
                <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="desktop-redirect-switch" className="text-base">
                                Redirecionamento para Desktop
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Ative para redirecionar o tráfego de desktops.
                            </p>
                        </div>
                        <Switch
                            id="desktop-redirect-switch"
                            checked={desktopRedirectEnabled}
                            onCheckedChange={setDesktopRedirectEnabled}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="desktop-url" className={!desktopRedirectEnabled ? 'text-muted-foreground' : ''}>
                            URL para Desktop
                        </Label>
                        <Input 
                            id="desktop-url" 
                            placeholder="https://seusite.com/pagina-desktop" 
                            disabled={!desktopRedirectEnabled} 
                        />
                    </div>
                </div>
                
                {/* Mobile Section */}
                <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="mobile-redirect-switch" className="text-base">
                                Redirecionamento para Mobile
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Ative para redirecionar o tráfego de celulares.
                            </p>
                        </div>
                        <Switch
                            id="mobile-redirect-switch"
                            checked={mobileRedirectEnabled}
                            onCheckedChange={setMobileRedirectEnabled}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mobile-url" className={!mobileRedirectEnabled ? 'text-muted-foreground' : ''}>
                            URL para Mobile
                        </Label>
                        <Input 
                            id="mobile-url" 
                            placeholder="https://seusite.com/pagina-mobile" 
                            disabled={!mobileRedirectEnabled} 
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Filtros de Tráfego</CardTitle>
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
                        id="vpn-proxy-filter"
                        label="Filtro de VPNs e Proxies"
                        description="Bloqueia visitantes que usam VPNs ou proxies."
                    />
                     <CloakerOption 
                        id="device-filter"
                        label="Filtro por Dispositivo"
                        description="Permite ou bloqueia tráfego de dispositivos específicos."
                    />
                </div>
                
                <Separator />

                {/* Geo Filter Section */}
                <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="geo-filter-switch" className="text-base">
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
                        <div className="grid sm:grid-cols-3 gap-4 pt-2">
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
                            <Label htmlFor="os-filter-switch" className="text-base">
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
                        <div className="space-y-4 pt-2">
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
            </CardContent>
        </Card>

        <div className="flex justify-end">
            <Button>Salvar Configurações do Cloaker</Button>
        </div>
    </div>
  );
}
