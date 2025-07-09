'use client'

import * as React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, UserCog, Ban, LogIn } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

// In a real app, this data would be fetched from the database
const initialUsers: any[] = [];

type User = {
  id: string;
  name: string;
  email: string;
  plan: string;
  joined: string;
  customAlert: string;
}

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = React.useState<User[]>(initialUsers);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  
  // React.useEffect(() => {
  //   // Here you would fetch users from your database
  //   // e.g., fetchUsersAction().then(setUsers);
  // }, []);

  const handleOpenEditDialog = (user: User) => {
    setEditingUser({ ...user }); // Create a copy to edit
    setIsEditDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (!editingUser) return;
    
    // In a real app, this would be a server action to update the user
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    toast({
        title: "Usuário Atualizado!",
        description: `As informações de ${editingUser.name} foram salvas.`
    })
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

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
            Encontramos {users.length} usuários na sua plataforma.
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
                    <TableHead>Alerta Personalizado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
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
                        <TableCell>
                          {user.customAlert ? (
                            <span className="text-xs text-yellow-400 italic">Sim</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Não</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenEditDialog(user)}>
                                  <UserCog className="mr-2 h-4 w-4" /> Editar Usuário
                              </DropdownMenuItem>
                              <DropdownMenuItem disabled><LogIn className="mr-2 h-4 w-4" /> Personificar</DropdownMenuItem>
                              <DropdownMenuItem disabled className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                 <Ban className="mr-2 h-4 w-4" /> Suspender
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Nenhum usuário encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
        </CardContent>
      </Card>
      
      {editingUser && (
         <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Usuário</DialogTitle>
                    <DialogDescription>
                       Modifique o plano ou adicione um alerta no painel para {editingUser.name}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Nome</Label>
                        <Input id="name" value={editingUser.name} className="col-span-3" disabled />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" value={editingUser.email} className="col-span-3" disabled />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="plan" className="text-right">Plano</Label>
                        <Select
                            value={editingUser.plan}
                            onValueChange={(value) => setEditingUser(prev => prev ? {...prev, plan: value} : null)}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecione um plano" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Grátis">Grátis</SelectItem>
                                <SelectItem value="Pro">Pro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="alert" className="text-right pt-2">Alerta</Label>
                        <Textarea
                            id="alert"
                            placeholder="Deixe em branco para não exibir nenhum alerta."
                            className="col-span-3"
                            value={editingUser.customAlert}
                            onChange={(e) => setEditingUser(prev => prev ? {...prev, customAlert: e.target.value} : null)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSaveChanges}>Salvar Alterações</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
