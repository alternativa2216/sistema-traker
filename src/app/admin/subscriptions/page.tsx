'use client'

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getAllSubscriptionsAction } from '@/app/actions/admin';

type Subscription = {
    id: string;
    user_name: string;
    user_email: string;
    plan_name: string;
    status: 'active' | 'pending' | 'canceled';
    plan_price: number;
    next_billing_date: string | null;
};

export default function AdminSubscriptionsPage() {
    const { toast } = useToast();
    const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        const fetchSubscriptions = async () => {
            setIsLoading(true);
            try {
                const result = await getAllSubscriptionsAction();
                // @ts-ignore
                setSubscriptions(result);
            } catch (error: any) {
                toast({ title: "Erro ao carregar assinaturas", description: error.message, variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubscriptions();
    }, [toast]);
    
    const filteredSubscriptions = subscriptions.filter(
        sub => sub.user_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
               sub.user_email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusVariant = (status: string): "secondary" | "default" | "destructive" | "outline" => {
        switch (status) {
            case 'active': return 'secondary';
            case 'pending': return 'default';
            case 'canceled': return 'destructive';
            default: return 'outline';
        }
    };
     const getStatusText = (status: string): string => {
        switch (status) {
            case 'active': return 'Ativa';
            case 'pending': return 'Pendente';
            case 'canceled': return 'Cancelada';
            default: return status;
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
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center"><Loader2 className='mx-auto h-6 w-6 animate-spin'/></TableCell>
                                </TableRow>
                            ) : filteredSubscriptions.length > 0 ? filteredSubscriptions.map(sub => (
                                <TableRow key={sub.id}>
                                    <TableCell>
                                        <div className="font-medium">{sub.user_name}</div>
                                        <div className="text-xs text-muted-foreground">{sub.user_email}</div>
                                    </TableCell>
                                    <TableCell>
                                         <Badge variant={sub.plan_name === 'Pro' ? 'default' : 'secondary'}>
                                            {sub.plan_name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(sub.status)}>{getStatusText(sub.status)}</Badge>
                                    </TableCell>
                                    <TableCell>{Number(sub.plan_price || 0).toFixed(2)}</TableCell>
                                    <TableCell>
                                        {sub.next_billing_date ? new Date(sub.next_billing_date).toLocaleDateString('pt-BR') : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem disabled>Ver Fatura</DropdownMenuItem>
                                                <DropdownMenuItem disabled>Reenviar Cobrança</DropdownMenuItem>
                                                <DropdownMenuItem disabled className="text-destructive">Cancelar Assinatura</DropdownMenuItem>
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
