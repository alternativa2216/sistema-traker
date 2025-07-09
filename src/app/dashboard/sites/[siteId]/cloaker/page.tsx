'use client'

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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


export default function CloakerPage() {
  const [desktopRedirectEnabled, setDesktopRedirectEnabled] = React.useState(false);
  const [mobileRedirectEnabled, setMobileRedirectEnabled] = React.useState(false);

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
                    Controle quem pode ver seu site com base em vários critérios.
                </CardDescription>
            </CardHeader>
             <CardContent className="grid md:grid-cols-2 gap-4">
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
                    description="Bloqueia visitantes que usam VPNs ou proxies para ocultar a localização."
                />
                <CloakerOption 
                    id="device-filter"
                    label="Filtro por Dispositivo"
                    description="Permite ou bloqueia tráfego de dispositivos específicos (Desktop, Mobile)."
                />
                 <CloakerOption 
                    id="os-filter"
                    label="Filtro por Sistema Operacional"
                    description="Filtra visitantes com base no sistema operacional (Windows, macOS, etc.)."
                />
                 <CloakerOption 
                    id="geo-filter"
                    label="Filtro por Geolocalização"
                    description="Restringe o acesso com base no país, região ou cidade do visitante."
                />
            </CardContent>
        </Card>

        <div className="flex justify-end">
            <Button>Salvar Configurações do Cloaker</Button>
        </div>
    </div>
  );
}
