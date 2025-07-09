'use client'

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ShieldAlert, Fingerprint, Globe, ServerOff } from "lucide-react";
import * as React from 'react';

// In a real app, this data would be fetched from the database
const mockLogs: any[] = [];

export default function SecurityLogsPage() {
  const [logs, setLogs] = React.useState(mockLogs);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Logs de Segurança</CardTitle>
        <CardDescription>
          Visualize um histórico detalhado de todas as tentativas de acesso que foram bloqueadas pelo cloaker.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data e Hora</TableHead>
                <TableHead>Endereço IP</TableHead>
                <TableHead>País</TableHead>
                <TableHead>Motivo do Bloqueio</TableHead>
                <TableHead>User-Agent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? logs.map((log, index) => {
                  const Icon = log.reasonIcon || ShieldAlert;
                  return (
                    <TableRow key={index} className={cn(log.isCritical && 'bg-destructive/10 hover:bg-destructive/20')}>
                        <TableCell className="text-muted-foreground whitespace-nowrap">{log.timestamp}</TableCell>
                        <TableCell className="font-mono">{log.ip}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <span title={log.countryName}>{log.country}</span> 
                                <span className="hidden sm:inline">{log.countryName}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant={log.isCritical ? "destructive" : "secondary"} className="gap-1.5">
                                <Icon className="h-3 w-3" />
                                {log.reason}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-xs max-w-[200px] truncate">{log.userAgent}</TableCell>
                    </TableRow>
                )
              }) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">Nenhum evento de segurança registrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
