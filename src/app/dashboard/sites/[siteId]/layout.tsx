'use client'

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BarChart2, Filter, Bot, Shield, Facebook, Settings } from 'lucide-react';

const MOCK_SITE_DETAILS = {
    id: "site-1",
    name: "meu-ecommerce.com",
};

export default function SiteIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { siteId: string };
}) {
  const pathname = usePathname();
  const routeParams = useParams() as { siteId: string };
  const basePath = `/dashboard/sites/${routeParams.siteId}`;

  const navItems = [
    { href: '', label: 'Analytics', icon: BarChart2 },
    { href: '/funnel', label: 'Funil', icon: Filter },
    { href: '/ai-analysis', label: 'Análise IA', icon: Bot },
    { href: '/cloaker', label: 'Cloaker', icon: Shield },
    { href: '/facebook-ads', label: 'Facebook Ads', icon: Facebook },
    { href: '/settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-headline">{MOCK_SITE_DETAILS.name}</h1>
        <p className="text-muted-foreground">Análise detalhada do seu site.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b overflow-x-auto">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {navItems.map((item) => {
            const fullPath = `${basePath}${item.href || ''}`;
            const isActive = pathname === fullPath;
            return (
              <Link
                key={item.label}
                href={fullPath}
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
