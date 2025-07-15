'use client'

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BarChart2, Filter, Bot, Shield, Facebook, Settings, ClipboardList, Activity, Loader2 } from 'lucide-react';
import { getProjectByIdAction } from '@/app/actions/projects';
import { useToast } from '@/hooks/use-toast';

type ProjectDetails = {
    id: string;
    name: string;
}

export default function SiteIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams() as { siteId: string };
  const basePath = `/dashboard/sites/${params.siteId}`;
  const { toast } = useToast();

  const [project, setProject] = React.useState<ProjectDetails | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchProjectDetails() {
        if (!params.siteId) return;
        setIsLoading(true);
        try {
            const projectDetails = await getProjectByIdAction(params.siteId);
            setProject(projectDetails);
        } catch (error: any) {
            toast({ title: "Erro", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }
    fetchProjectDetails();
  }, [params.siteId, toast]);

  const navItems = [
    { href: basePath, label: 'Analytics', icon: BarChart2, exact: true },
    { href: `${basePath}/real-time`, label: 'Tempo Real', icon: Activity },
    { href: `${basePath}/funnel`, label: 'Funil', icon: Filter },
    { href: `${basePath}/ai-analysis`, label: 'Análise IA', icon: Bot },
    { href: `${basePath}/cloaker`, label: 'Cloaker', icon: Shield },
    { href: `${basePath}/security-logs`, label: 'Logs de Segurança', icon: ClipboardList },
    { href: `${basePath}/facebook-ads`, label: 'Facebook Ads', icon: Facebook },
    { href: `${basePath}/settings`, label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        {isLoading ? (
            <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <h1 className="text-3xl font-bold font-headline">Carregando...</h1>
            </div>
        ) : (
            <>
                <h1 className="text-3xl font-bold font-headline">{project?.name || 'Site não encontrado'}</h1>
                <p className="text-muted-foreground">Análise detalhada do seu site.</p>
            </>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b overflow-x-auto scrollbar-hide">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
      
      {/* Page Content */}
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}
