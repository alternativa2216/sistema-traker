'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Laptop, Smartphone, Users } from "lucide-react";

// Mock Data Generation
const randomIp = () => `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
const countries = [
    { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
    { code: 'US', name: 'EUA', flag: '🇺🇸' },
    { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
    { code: 'DE', name: 'Alemanha', flag: '🇩🇪' },
];
const pages = ['/home', '/produtos', '/precos', '/contato', '/blog/post-1'];
const referrers = ['google.com', 'facebook.com', 'direct', 'twitter.com'];
const devices = ['mobile', 'desktop'] as const;

interface Visitor {
    id: number;
    ip: string;
    country: { code: string; name: string; flag: string };
    device: 'mobile' | 'desktop';
    currentPage: string;
    timeOnSite: number;
    referrer: string;
}

let visitorIdCounter = 0;
const createRandomVisitor = (): Visitor => {
    visitorIdCounter++;
    return {
        id: visitorIdCounter,
        ip: randomIp(),
        country: countries[Math.floor(Math.random() * countries.length)],
        device: devices[Math.floor(Math.random() * devices.length)],
        currentPage: pages[Math.floor(Math.random() * pages.length)],
        timeOnSite: 0,
        referrer: referrers[Math.floor(Math.random() * referrers.length)],
    };
};

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};


// Main Component
export default function RealTimeAnalyticsPage() {
    const [visitors, setVisitors] = React.useState<Visitor[]>(() => [createRandomVisitor(), createRandomVisitor()]);
    const [isPaused, setIsPaused] = React.useState(false);

    React.useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setVisitors(currentVisitors => {
                let newVisitors = [...currentVisitors];

                // Update existing visitors
                newVisitors = newVisitors.map(v => ({
                    ...v,
                    timeOnSite: v.timeOnSite + 2,
                    // Randomly change page
                    currentPage: Math.random() > 0.95 ? pages[Math.floor(Math.random() * pages.length)] : v.currentPage,
                }));

                // Randomly remove a visitor
                if (Math.random() > 0.8 && newVisitors.length > 1) {
                    newVisitors.splice(Math.floor(Math.random() * newVisitors.length), 1);
                }

                // Randomly add a new visitor
                if (Math.random() > 0.6 && newVisitors.length < 15) {
                    newVisitors.push(createRandomVisitor());
                }

                return newVisitors;
            });
        }, 2000); // Update every 2 seconds

        return () => clearInterval(interval);
    }, [isPaused]);
    
    const summary = React.useMemo(() => {
        const pageCounts = visitors.reduce((acc, v) => {
            acc[v.currentPage] = (acc[v.currentPage] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const referrerCounts = visitors.reduce((acc, v) => {
            acc[v.referrer] = (acc[v.referrer] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const deviceCounts = visitors.reduce((acc, v) => {
            acc[v.device] = (acc[v.device] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const countryCounts = visitors.reduce((acc, v) => {
            acc[v.country.name] = (acc[v.country.name] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const toSortedArray = (obj: Record<string, number>) => Object.entries(obj).sort(([, a], [, b]) => b - a);

        return {
            topPages: toSortedArray(pageCounts),
            topReferrers: toSortedArray(referrerCounts),
            topDevices: toSortedArray(deviceCounts),
            topCountries: toSortedArray(countryCounts),
        };
    }, [visitors]);

    const SummaryCard = ({ title, data }: { title: string; data: [string, number][] }) => (
        <Card>
            <CardHeader className='pb-2'>
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {data.length > 0 ? (
                    <Table>
                        <TableBody>
                            {data.slice(0, 5).map(([item, count]) => (
                                <TableRow key={item}>
                                    <TableCell className="p-2 text-muted-foreground truncate max-w-[150px]">{item}</TableCell>
                                    <TableCell className="p-2 text-right font-bold">{count}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Sem dados</p>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Users className="h-6 w-6 text-primary" />
                       <div>
                           <CardTitle className="font-headline">Usuários Online: {visitors.length}</CardTitle>
                           <CardDescription>Visitantes no seu site neste exato momento.</CardDescription>
                       </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>IP</TableHead>
                                    <TableHead>País</TableHead>
                                    <TableHead>Dispositivo</TableHead>
                                    <TableHead>Página Atual</TableHead>
                                    <TableHead>Referrer</TableHead>
                                    <TableHead className="text-right">Tempo no Site</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {visitors.map(v => (
                                    <TableRow key={v.id}>
                                        <TableCell className="font-mono text-xs">{v.ip}</TableCell>
                                        <TableCell>{v.country.flag} {v.country.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="gap-1">
                                                {v.device === 'desktop' ? <Laptop className="h-3 w-3" /> : <Smartphone className="h-3 w-3" />}
                                                {v.device.charAt(0).toUpperCase() + v.device.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium truncate max-w-[200px]">{v.currentPage}</TableCell>
                                        <TableCell className="text-muted-foreground">{v.referrer}</TableCell>
                                        <TableCell className="text-right font-mono">{formatTime(v.timeOnSite)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <SummaryCard title="Páginas Populares" data={summary.topPages} />
                <SummaryCard title="Principais Referrers" data={summary.topReferrers} />
                <SummaryCard title="Dispositivos" data={summary.topDevices} />
                <SummaryCard title="Países" data={summary.topCountries} />
            </div>
        </div>
    );
}
