'use client'

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

// In a real app, this data would be fetched from the database and payment gateway
const initialSubscriptions: any[] = [];

export default function AdminSubscriptionsPage() {
    const [subscriptions, setSubscriptions] = React.useState(initialSubscriptions);
    const [searchTerm, setSearchTerm] = React.useState('');
    const filteredSubscriptions = subscriptions.filter(
        sub => sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
               sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusVariant = (status: string): "secondary" | "default" | "destructive" | "outline" => {
        switch (status) {
            case 'Ativa': return 'secondary';
            case 'Pendente': return 'default';
            case 'Cancelada': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline">Gerenciamento de Assinaturas</h1>
                <p className="text-muted-foreground">Visualize e gerencie todas as assinaturas ativas, pendentes e canceladas.</p>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                       <div>
                         <CardTitle className="font-headline">Todas as Assinaturas</CardTitle>
                         <CardDescription>
                            {filteredSubscriptions.length} assinaturas encontradas.
                         </CardDescription>
                       </div>
                        <Input 
                            placeholder="Buscar por nome ou email..." 
                            className="w-full sm:w-auto max-w-xs"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                   <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuário</TableHead>
                                <TableHead>Plano</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Valor (R$)</TableHead>
                                <TableHead>Próxima Cobrança</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSubscriptions.length > 0 ? filteredSubscriptions.map(sub => (
                                <TableRow key={sub.id}>
                                    <TableCell>
                                        <div className="font-medium">{sub.userName}</div>
                                        <div className="text-xs text-muted-foreground">{sub.userEmail}</div>
                                    </TableCell>
                                    <TableCell>
                                         <Badge variant={sub.plan === 'Pro' ? 'default' : 'secondary'}>
                                            {sub.plan}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(sub.status)}>{sub.status}</Badge>
                                    </TableCell>
                                    <TableCell>{sub.amount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        {sub.nextBilling === 'N/A' ? 'N/A' : new Date(sub.nextBilling).toLocaleDateString('pt-BR')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Ver Fatura</DropdownMenuItem>
                                                <DropdownMenuItem>Reenviar Cobrança</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Cancelar Assinatura</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        Nenhuma assinatura encontrada.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                      </Table>
                   </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    {/* Pagination can be added here */}
                </CardFooter>
            </Card>
        </div>
    );
}
