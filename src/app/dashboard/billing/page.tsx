'use client'

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, Clock, Copy, DollarSign, FileText, Loader2, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createPaymentTransaction, checkPaymentStatus } from '@/app/actions/billing';
import { Progress } from '@/components/ui/progress';
import QRCode from "qrcode.react";
import { format, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Dados de exemplo
const MOCK_INVOICES = [
    { id: 'INV-003', date: '01/06/2024', amount: 'R$ 29,00', status: 'Paga' },
    { id: 'INV-002', date: '01/05/2024', amount: 'R$ 29,00', status: 'Paga' },
    { id: 'INV-001', date: '01/04/2024', amount: 'R$ 29,00', status: 'Paga' },
];

const MOCK_USER = {
    name: 'Usuário de Amostra',
    email: 'usuario@amostra.com',
    cpf: '12345678900', // Use um CPF válido para testes reais
    phone: '21965152545'
}

const PLAN_DETAILS = {
    name: "Pro",
    price: 29.00,
    priceInCents: 2900,
    nextPayment: format(addMonths(new Date(), 1), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export default function BillingPage() {
    const { toast } = useToast();
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);
    const [paymentState, setPaymentState] = React.useState<'idle' | 'loading' | 'qr_visible' | 'paid'>('idle');
    const [pixData, setPixData] = React.useState<{ transactionId: string; pixCode: string; } | null>(null);
    const [timer, setTimer] = React.useState(1800); // 30 minutos em segundos
    const paymentCheckIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

    const handlePayNow = async () => {
        setPaymentState('loading');
        setIsPaymentDialogOpen(true);
        try {
            const data = await createPaymentTransaction({
                userName: MOCK_USER.name,
                userEmail: MOCK_USER.email,
                userCpf: MOCK_USER.cpf,
                userPhone: MOCK_USER.phone,
                amountInCents: PLAN_DETAILS.priceInCents,
                description: `Pagamento Plano Pro - ${PLAN_DETAILS.name}`
            });
            setPixData(data);
            setPaymentState('qr_visible');
        } catch (error: any) {
            toast({ title: "Erro ao Gerar Pagamento", description: error.message, variant: "destructive" });
            setIsPaymentDialogOpen(false);
            setPaymentState('idle');
        }
    };
    
    const copyPixCode = () => {
        if (pixData?.pixCode) {
            navigator.clipboard.writeText(pixData.pixCode);
            toast({ title: "Copiado!", description: "O código PIX foi copiado para sua área de transferência." });
        }
    };

    React.useEffect(() => {
        if (paymentState === 'qr_visible' && pixData) {
            // Iniciar timer
            const countdown = setInterval(() => {
                setTimer(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            
            // Iniciar verificação de pagamento
            paymentCheckIntervalRef.current = setInterval(async () => {
                try {
                    const { status } = await checkPaymentStatus({ transactionId: pixData.transactionId });
                    if (status === 'paid') {
                        setPaymentState('paid');
                    }
                } catch (error) {
                    console.error("Erro ao verificar status:", error);
                }
            }, 5000); // Verificar a cada 5 segundos

            return () => {
                clearInterval(countdown);
                if (paymentCheckIntervalRef.current) {
                    clearInterval(paymentCheckIntervalRef.current);
                }
            };
        }
    }, [paymentState, pixData]);

    React.useEffect(() => {
        if (paymentState === 'paid' && paymentCheckIntervalRef.current) {
            clearInterval(paymentCheckIntervalRef.current);
            // Redirecionar ou fechar o dialog após um tempo
            setTimeout(() => {
                setIsPaymentDialogOpen(false);
                setPaymentState('idle');
                 toast({ title: "Pagamento Confirmado!", description: "Seu plano foi renovado com sucesso." });
            }, 5000)
        }
    }, [paymentState, toast]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };


    const renderPaymentContent = () => {
        switch (paymentState) {
            case 'loading':
                return (
                    <div className="flex flex-col items-center justify-center h-80">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="mt-4 text-muted-foreground">Gerando seu pagamento PIX...</p>
                    </div>
                );
            case 'qr_visible':
                if (!pixData) return null;
                return (
                    <div className="text-center space-y-4">
                        <p className="text-muted-foreground">Escaneie o QR Code ou use o código abaixo para pagar.</p>
                        <div className="flex justify-center p-4 bg-white rounded-lg border">
                            <QRCode value={pixData.pixCode} size={200} />
                        </div>
                         <div className="space-y-2">
                             <Progress value={(timer / 1800) * 100} className="w-full" />
                             <p className="text-sm text-muted-foreground">Este código expira em: {formatTime(timer)}</p>
                         </div>
                        <div className="relative">
                            <input type="text" value={pixData.pixCode} readOnly className="w-full p-2 pr-20 border rounded-md bg-muted text-sm" />
                            <Button size="sm" onClick={copyPixCode} className="absolute right-1 top-1/2 -translate-y-1/2">
                                <Copy className="mr-2 h-4 w-4" /> Copiar
                            </Button>
                        </div>
                    </div>
                );
            case 'paid':
                 return (
                    <div className="flex flex-col items-center justify-center h-80 text-center">
                        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                        <h3 className="text-xl font-bold text-green-600 mb-2">Pagamento Confirmado!</h3>
                        <p className="text-muted-foreground">Seu plano foi renovado com sucesso. Você já pode fechar esta janela.</p>
                    </div>
                );
            default:
                return null;
        }
    }


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
                    <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                        <DialogTrigger asChild>
                           <Button onClick={handlePayNow} disabled={paymentState !== 'idle'}>
                             <DollarSign className="mr-2 h-4 w-4"/>
                             Pagar Fatura Atual
                           </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                             <DialogHeader>
                                <DialogTitle className="font-headline text-center text-2xl">Pagamento PIX</DialogTitle>
                             </DialogHeader>
                             {renderPaymentContent()}
                        </DialogContent>
                    </Dialog>
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
