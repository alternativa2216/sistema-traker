'use client'

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, FileText, QrCode, Loader2 } from "lucide-react";
import { getBillingInfoAction, getInvoicesAction } from '@/app/actions/billing';
import { useToast } from '@/hooks/use-toast';

const MOCK_INVOICES: any[] = [];

type BillingInfo = {
    plan: string;
    status: string;
    nextBillingDate: string | null;
    price: string;
}

export default function BillingPage() {
    const [billingInfo, setBillingInfo] = React.useState<BillingInfo | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const { toast } = useToast();

    React.useEffect(() => {
        const fetchBillingInfo = async () => {
            setIsLoading(true);
            try {
                const info = await getBillingInfoAction();
                // @ts-ignore
                setBillingInfo(info);
            } catch (error: any) {
                toast({ title: "Erro ao carregar dados", description: error.message, variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchBillingInfo();
    }, [toast]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Faturamento</h1>
        <p className="text-muted-foreground">Gerencie sua assinatura e veja o histórico de pagamentos.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Plano Atual</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-24">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : billingInfo ? (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg">
                            <div>
                                <Badge variant="secondary" className="text-base">{billingInfo.plan}</Badge>
                                <p className="text-muted-foreground mt-2">
                                    {billingInfo.plan.toLowerCase() === 'grátis' ? 'Faça upgrade para o plano Pro para mais funcionalidades.' : `Próxima cobrança em ${billingInfo.nextBillingDate ? new Date(billingInfo.nextBillingDate).toLocaleDateString('pt-BR') : 'N/A'}`}
                                </p>
                            </div>
                            <div className="text-left sm:text-right">
                                <p className="text-3xl font-bold">R$ {Number(billingInfo.price || 0).toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">por mês</p>
                            </div>
                        </div>
                    ) : (
                        <p className='text-muted-foreground'>Não foi possível carregar as informações do plano.</p>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                     <p className="text-sm text-muted-foreground">Funcionalidade de faturamento em breve.</p>
                    <Button variant="link" disabled>Trocar de Plano</Button>
                </CardFooter>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Histórico de Faturas</CardTitle>
                    <CardDescription>Veja e baixe suas faturas anteriores.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Fatura</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ação</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                            {MOCK_INVOICES.length > 0 ? MOCK_INVOICES.map((invoice) => (
                                <TableRow key={invoice.id}>
                                <TableCell className="font-medium">{invoice.id}</TableCell>
                                <TableCell>{invoice.date}</TableCell>
                                <TableCell>{invoice.amount}</TableCell>
                                <TableCell>
                                    <Badge variant={invoice.status === 'Paga' ? 'secondary' : 'destructive'}>
                                    {invoice.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" disabled>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Baixar
                                    </Button>
                                </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Nenhum histórico de faturas.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                      </Table>
                   </div>
                </CardContent>
             </Card>
        </div>
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle className="font-headline">Método de Pagamento</CardTitle>
            </CardHeader>
             <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                         <QrCode className="h-8 w-8 text-muted-foreground" />
                         <div>
                            <p className="font-semibold">PIX</p>
                            <p className="text-sm text-muted-foreground">Pagamento instantâneo</p>
                         </div>
                    </div>
                </div>
                 <p className="text-xs text-muted-foreground mt-4">
                     O faturamento está desativado. Estamos trabalhando para adicionar opções de pagamento em breve.
                 </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
