import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Users, TrendingUp, TrendingDown, Database, Cpu, CheckCircle, Clock, Link as LinkIcon, Plus, Globe } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const mockRecentUsers = [
  { name: 'Gabriel Lima', email: 'gabriel.l@example.com', joined: 'há 5 minutos' },
  { name: 'Fernanda Souza', email: 'fernanda.s@example.com', joined: 'há 2 horas' },
  { name: 'Lucas Pereira', email: 'lucas.p@example.com', joined: 'há 8 horas' },
];

const mockRecentProjects = [
  { name: 'loja-de-sapatos.com', user: 'Ana Silva', created: 'há 1 hora' },
  { name: 'portfolio-dev.io', user: 'Carlos Martins', created: 'há 3 horas' },
  { name: 'agencia-de-viagens.net', user: 'Beatriz Costa', created: 'há 1 dia' },
];

const mockTopProjects = [
    { name: 'meu-ecommerce.com', visits: '12,402' },
    { name: 'agencia-criativa.co', visits: '21,832' },
    { name: 'meu-blog-pessoal.dev', visits: '8,923' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Painel do Administrador</h1>
        <p className="text-muted-foreground">Seu negócio em resumo.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Recorrente Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,842.59</div>
            <p className="text-xs text-muted-foreground">+2.5% do último mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinantes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">482</div>
            <p className="text-xs text-muted-foreground">+32 desde o último mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Testes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">105</div>
            <p className="text-xs text-muted-foreground">+12% esta semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Churn</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1%</div>
            <p className="text-xs text-muted-foreground">-0.5% do último mês</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Atividade Recente</CardTitle>
                    <CardDescription>O que aconteceu na plataforma nas últimas 24 horas.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><Plus className="h-4 w-4"/>Novos Usuários</h3>
                         <Table>
                            <TableBody>
                                {mockRecentUsers.map(user => (
                                    <TableRow key={user.email}>
                                        <TableCell>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-xs text-muted-foreground">{user.email}</div>
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground">{user.joined}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                         </Table>
                    </div>
                     <div>
                        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><Globe className="h-4 w-4"/>Novos Sites</h3>
                         <Table>
                            <TableBody>
                                {mockRecentProjects.map(project => (
                                    <TableRow key={project.name}>
                                        <TableCell>
                                            <div className="font-medium">{project.name}</div>
                                            <div className="text-xs text-muted-foreground">por {project.user}</div>
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground">{project.created}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                         </Table>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Estatísticas da Plataforma</CardTitle>
                    <CardDescription>Métricas globais de todos os sites.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sites Mais Visitados</TableHead>
                                <TableHead className="text-right">Visitas (Últimos 7 dias)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockTopProjects.map(project => (
                                <TableRow key={project.name}>
                                    <TableCell className="font-medium">{project.name}</TableCell>
                                    <TableCell className="text-right">{project.visits}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                     </Table>
                     <div className="mt-4 pt-4 border-t flex justify-around text-center">
                        <div>
                            <p className="text-sm text-muted-foreground">Total de Sites</p>
                            <p className="text-2xl font-bold">1,250</p>
                        </div>
                         <div>
                            <p className="text-sm text-muted-foreground">Média de Visitas / Site</p>
                            <p className="text-2xl font-bold">4,321</p>
                        </div>
                     </div>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-1">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Status do Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <LinkIcon className="h-5 w-5 text-muted-foreground"/>
                           <span className="font-medium">API Principal</span>
                        </div>
                        <Badge variant="secondary" className="text-green-400 gap-1.5"><CheckCircle className="h-3 w-3" /> Operacional</Badge>
                    </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Database className="h-5 w-5 text-muted-foreground"/>
                           <span className="font-medium">Banco de Dados</span>
                        </div>
                        <Badge variant="secondary" className="text-green-400 gap-1.5"><CheckCircle className="h-3 w-3" /> Conectado</Badge>
                    </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Cpu className="h-5 w-5 text-muted-foreground"/>
                           <span className="font-medium">Serviços de IA</span>
                        </div>
                        <Badge variant="secondary" className="text-green-400 gap-1.5"><CheckCircle className="h-3 w-3" /> Operacional</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Clock className="h-5 w-5 text-muted-foreground"/>
                           <span className="font-medium">Processos em Fila</span>
                        </div>
                        <span className="font-mono text-sm">0</span>
                    </div>
                     <div className="border-t pt-4 text-center">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/health">Ver Saúde Detalhada</Link>
                        </Button>
                     </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
