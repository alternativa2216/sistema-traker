'use client'

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, FileText, QrCode } from "lucide-react";
import { format, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Dados de exemplo
const MOCK_INVOICES = [
    { id: 'INV-003', date: '01/06/2024', amount: 'R$ 29,00', status: 'Paga' },
    { id: 'INV-002', date: '01/05/2024', amount: 'R$ 29,00', status: 'Paga' },
    { id: 'INV-001', date: '01/04/2024', amount: 'R$ 29,00', status: 'Paga' },
];

const PLAN_DETAILS = {
    name: "Pro",
    price: 29.00,
    priceInCents: 2900,
    nextPayment: format(addMonths(new Date(), 1), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export default function BillingPage() {

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
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg">
                        <div>
                            <Badge variant="secondary" className="text-base">{PLAN_DETAILS.name}</Badge>
                            <p className="text-muted-foreground mt-2">
                                Sua assinatura será renovada em <span className="font-semibold text-foreground">{PLAN_DETAILS.nextPayment}</span>.
                            </p>
                        </div>
                        <div className="text-left sm:text-right">
                            <p className="text-3xl font-bold">R$ {PLAN_DETAILS.price.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">por mês</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <div className="flex flex-col gap-2">
                        <Button disabled>
                             <DollarSign className="mr-2 h-4 w-4"/>
                             Pagar Fatura Atual
                        </Button>
                        <p className="text-xs text-muted-foreground">Pagamentos estão temporariamente desativados.</p>
                    </div>
                    <Button variant="link">Trocar de Plano</Button>
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
                          {MOCK_INVOICES.map((invoice) => (
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
                                <Button variant="outline" size="sm">
                                  <FileText className="mr-2 h-4 w-4" />
                                  Baixar
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
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
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                         <QrCode className="h-8 w-8 text-primary" />
                         <div>
                            <p className="font-semibold">PIX</p>
                            <p className="text-sm text-muted-foreground">Pagamento instantâneo</p>
                         </div>
                    </div>
                </div>
                 <p className="text-xs text-muted-foreground mt-4">
                     No momento, aceitamos apenas PIX. Estamos trabalhando para adicionar a opção de cartão de crédito em breve.
                 </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
