
'use client'

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Megaphone, X, AlertTriangle, Sparkles } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getProjectsAction, markNotificationAsReadAction } from "../actions/projects";
import { cn } from "@/lib/utils";
import { getCurrentUserAction } from "../actions/user";


const UserAlert = ({ alert, onDismiss }: { alert: any, onDismiss: (id: number) => void }) => {
    // Determine which alert config to use based on alert type or default to info
    const alertConfig = {
        info: {
            icon: Megaphone,
            className: 'border-yellow-500/50',
            titleClassName: 'text-yellow-400',
            iconClassName: 'text-yellow-500',
        },
        promo: {
            icon: Sparkles,
            className: 'border-primary/50',
            titleClassName: 'text-primary',
            iconClassName: 'text-primary',
        },
        critical: {
            icon: AlertTriangle,
            variant: 'destructive' as "destructive" | "default" | null | undefined,
        },
        custom: {
            icon: Megaphone,
            className: 'border-yellow-500/50',
            titleClassName: 'text-yellow-400',
            iconClassName: 'text-yellow-500',
        }
    };
    // @ts-ignore
    const config = alertConfig[alert.type] || alertConfig.info;
    const Icon = config.icon;

    return (
        <Alert variant={config.variant} className={cn("relative pr-10", config.className)}>
           <div className="flex w-full items-start justify-between gap-4">
              <div className="flex items-start">
                 <Icon className={`h-4 w-4 mt-1 ${config.iconClassName}`} />
                 <div className="ml-4">
                   <AlertTitle className={config.titleClassName}>{alert.title}</AlertTitle>
                   <AlertDescription>
                     {alert.description}
                   </AlertDescription>
                 </div>
              </div>
              {alert.cta && alert.cta.href && (
                 <Button asChild size="sm" className="shrink-0">
                    <Link href={alert.cta.href}>{alert.cta.text || 'Clique aqui'}</Link>
                 </Button>
              )}
           </div>
            {alert.id && (
                 <button 
                    onClick={() => onDismiss(alert.id)} 
                    className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground"
                    aria-label="Dispensar aviso"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </Alert>
    )
}

export default function DashboardPage() {
    const [sites, setSites] = useState<any[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [customAlert, setCustomAlert] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchInitialData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [fetchedSites, fetchedAlerts, user] = await Promise.all([
                getProjectsAction(),
                getNotificationsForUserAction(),
                getCurrentUserAction()
            ]);
            setSites(fetchedSites);
            setAlerts(fetchedAlerts);
            if (user.customAlert) {
                setCustomAlert(user.customAlert);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            toast({
                title: "Erro ao Carregar Dados",
                description: "Não foi possível buscar seus projetos e notificações.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);


    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);
    

    const handleDismissAlert = async (id: number) => {
        setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
        try {
            await markNotificationAsReadAction(id);
        } catch (error: any) {
            toast({ title: 'Erro', description: error.message, variant: 'destructive' });
            fetchInitialData();
        }
    };


    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }
    
    return (
        <div className="space-y-8">
            <div className="space-y-4 mb-6">
                {customAlert && (
                    <UserAlert alert={{ type: 'custom', title: 'Aviso do Administrador', description: customAlert }} onDismiss={() => {}} />
                )}
                {alerts.map(alert => (
                    <UserAlert key={alert.id} alert={alert} onDismiss={handleDismissAlert} />
                ))}
            </div>
            
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Visão Geral</h1>
                    <p className="text-muted-foreground">
                        {sites.length === 0 ? 'Adicione um site para começar a ver seus dados.' : 'Desempenho consolidado de todos os seus projetos.'}
                    </p>
                </div>
                 <Button asChild>
                   <Link href="/dashboard/projects">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar ou Gerenciar Sites
                  </Link>
                </Button>
            </div>

            {sites.length === 0 ? (
                <Card className="flex flex-col items-center justify-center text-center p-12">
                    <CardTitle className="font-headline">Bem-vindo ao Tracklytics!</CardTitle>
                    <CardDescription className="mt-2 mb-6">Parece que você ainda não tem nenhum site. Adicione seu primeiro site para começar.</CardDescription>
                    <Button asChild>
                       <Link href="/dashboard/projects">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar seu Primeiro Site
                      </Link>
                    </Button>
                </Card>
            ) : (
                <>
                    <OverviewChart />
                </>
            )}
        </div>
    );
}

    
