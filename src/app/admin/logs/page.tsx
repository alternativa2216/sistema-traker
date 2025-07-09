'use client'

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

// In a real application, logs would be fetched from a logging service or database
const mockLogs: any[] = [];

export default function AdminLogsPage() {
    const [filterLevel, setFilterLevel] = React.useState('all');
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredLogs = mockLogs.filter(log => {
        const levelMatch = filterLevel === 'all' || log.level.toLowerCase() === filterLevel;
        const termMatch = searchTerm === '' || log.message.toLowerCase().includes(searchTerm.toLowerCase());
        return levelMatch && termMatch;
    });

    const levelVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
        INFO: 'secondary',
        WARN: 'default',
        ERROR: 'destructive',
        DEBUG: 'outline'
    };
    
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Logs do Sistema</h1>
        <p className="text-muted-foreground">Visualize e filtre os logs da aplicação para depuração e monitoramento.</p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1">
                <CardTitle className="font-headline">Visualizador de Logs</CardTitle>
                <CardDescription>Mostrando os logs mais recentes da plataforma.</CardDescription>
            </div>
            <div className="flex w-full sm:w-auto items-center gap-2">
                <Input 
                    placeholder="Filtrar por mensagem..." 
                    className="w-full sm:w-[250px]" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Nível" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os Níveis</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warn">Warn</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Timestamp</TableHead>
                            <TableHead className="w-[100px]">Nível</TableHead>
                            <TableHead>Mensagem</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLogs.length > 0 ? filteredLogs.map((log, index) => (
                            <TableRow key={index} className={cn(log.level === 'ERROR' && 'bg-destructive/10')}>
                                <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                                <TableCell>
                                    <Badge variant={levelVariant[log.level] || 'secondary'}>{log.level}</Badge>
                                </TableCell>
                                <TableCell className="font-mono text-xs">{log.message}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    Nenhum log encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
