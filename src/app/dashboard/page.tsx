import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Users, Eye, Target, PlusCircle } from "lucide-react";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import Link from "next/link";

const sites = [
    { name: "meu-ecommerce.com", status: "Ativo", visitors: "12,402" },
    { name: "meu-blog-pessoal.dev", status: "Ativo", visitors: "8,923" },
    { name: "agencia-criativa.co", status: "Ativo", visitors: "21,832" },
    { name: "landing-page-produto.com", status: "Pausado", visitors: "950" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h1 className="text-3xl font-bold font-headline">Painel Geral</h1>
            <p className="text-muted-foreground">Uma visão geral de todos os seus projetos.</p>
        </div>
        <div className="flex items-center space-x-2">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Site
            </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Visitas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">44,107</div>
            <p className="text-xs text-muted-foreground">+12.5% do último mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+1,245</div>
            <p className="text-xs text-muted-foreground">+8.2% do último mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.72%</div>
            <p className="text-xs text-muted-foreground">+1.1% do último mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Rejeição Média</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">41.5%</div>
            <p className="text-xs text-muted-foreground">-2.3% do último mês</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <OverviewChart />
        </div>
        <div className="lg:col-span-2">
            <Card>
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                        <CardTitle className="font-headline">Meus Sites</CardTitle>
                        <CardDescription>
                            Seus sites rastreados e o desempenho recente deles.
                        </CardDescription>
                    </div>
                    <Button asChild size="sm" className="ml-auto gap-1">
                        <Link href="/dashboard/projects">
                            Ver Todos
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Site</TableHead>
                                <TableHead className="text-right">Visitantes (30d)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sites.map((site) => (
                                <TableRow key={site.name}>
                                    <TableCell>
                                        <div className="font-medium">{site.name}</div>
                                        <div className={cn("text-sm text-muted-foreground flex items-center gap-1.5")}>
                                            <span className={cn("h-2 w-2 rounded-full", site.status === "Ativo" ? "bg-accent" : "bg-muted-foreground/50")} />
                                            {site.status}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{site.visitors}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
