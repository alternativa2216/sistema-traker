import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserCog, Ban, LogIn } from "lucide-react";

// Mock data for users
const mockUsers = [
  { id: 'usr_1', name: 'Ana Silva', email: 'ana.silva@example.com', plan: 'Pro', joined: '2024-07-15' },
  { id: 'usr_2', name: 'Carlos Martins', email: 'carlos.martins@example.com', plan: 'Pro', joined: '2024-07-10' },
  { id: 'usr_3', name: 'Beatriz Costa', email: 'beatriz.costa@example.com', plan: 'Grátis', joined: '2024-07-05' },
  { id: 'usr_4', name: 'Diogo Almeida', email: 'diogo.almeida@example.com', plan: 'Pro', joined: '2024-06-28' },
  { id: 'usr_5', name: 'Eliane Faria', email: 'eliane.faria@example.com', plan: 'Grátis', joined: '2024-06-25' },
];


export default function AdminUsersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Gerenciamento de Usuários</h1>
        <p className="text-muted-foreground">Visualize, edite e gerencie todos os usuários da plataforma.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Usuários</CardTitle>
          <CardDescription>
            Encontramos {mockUsers.length} usuários na sua plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </TableCell>
                       <TableCell>
                        <Badge variant={user.plan === 'Pro' ? 'default' : 'secondary'}>
                          {user.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.joined).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem disabled><UserCog className="mr-2 h-4 w-4" /> Editar Usuário</DropdownMenuItem>
                            <DropdownMenuItem disabled><LogIn className="mr-2 h-4 w-4" /> Personificar</DropdownMenuItem>
                            <DropdownMenuItem disabled className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                               <Ban className="mr-2 h-4 w-4" /> Suspender
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
