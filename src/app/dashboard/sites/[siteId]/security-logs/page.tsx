import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldAlert, Fingerprint, Globe, ServerOff } from "lucide-react";

const mockLogs = [
  {
    timestamp: "2024-07-26 14:32:10",
    ip: "104.28.210.132",
    country: "🇺🇸",
    countryName: "United States",
    reason: "Bot de SEO Detectado",
    userAgent: "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)",
    reasonIcon: ShieldAlert,
  },
  {
    timestamp: "2024-07-26 14:28:55",
    ip: "192.158.1.38",
    country: "🇫🇷",
    countryName: "France",
    reason: "Impressão Digital Suspeita",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    reasonIcon: Fingerprint,
  },
  {
    timestamp: "2024-07-26 14:15:02",
    ip: "185.191.171.12",
    country: "🇳🇱",
    countryName: "Netherlands",
    reason: "Bloqueio Geográfico",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    reasonIcon: Globe,
  },
  {
    timestamp: "2024-07-26 13:59:41",
    ip: "34.224.75.120",
    country: "🇺🇸",
    countryName: "United States",
    reason: "IP na Lista de Bloqueio",
    userAgent: "python-requests/2.28.1",
    reasonIcon: ServerOff,
  },
  {
    timestamp: "2024-07-26 13:45:11",
    ip: "45.146.164.110",
    country: "🇷🇺",
    countryName: "Russia",
    reason: "Ferramenta de Clonagem",
    userAgent: "HTTrack/3.x",
    reasonIcon: ShieldAlert,
  },
];

export default function SecurityLogsPage() {
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
              {mockLogs.map((log, index) => {
                  const Icon = log.reasonIcon;
                  return (
                    <TableRow key={index}>
                        <TableCell className="text-muted-foreground whitespace-nowrap">{log.timestamp}</TableCell>
                        <TableCell className="font-mono">{log.ip}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <span title={log.countryName}>{log.country}</span> 
                                <span className="hidden sm:inline">{log.countryName}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="destructive" className="gap-1.5">
                                <Icon className="h-3 w-3" />
                                {log.reason}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-xs max-w-[200px] truncate">{log.userAgent}</TableCell>
                    </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
