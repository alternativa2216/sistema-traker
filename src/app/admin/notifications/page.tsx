
'use client'

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Megaphone, Send, Users, User, Loader2, Trash2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { sendNotificationAction, getSentNotificationsAction, deleteNotificationAction } from '@/app/actions/admin';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function NotificationsPage() {
    const { toast } = useToast();
    const [target, setTarget] = React.useState('all');
    const [specificUser, setSpecificUser] = React.useState('');
    const [notificationType, setNotificationType] = React.useState('info');
    const [message, setMessage] = React.useState('');
    
    const [sentNotifications, setSentNotifications] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSending, setIsSending] = React.useState(false);

    const fetchSentNotifications = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getSentNotificationsAction();
            setSentNotifications(result);
        } catch (error: any) {
            toast({ title: "Erro", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);
    
    React.useEffect(() => {
        fetchSentNotifications();
    }, [fetchSentNotifications]);

    const handleDelete = async (id: number) => {
        try {
            await deleteNotificationAction(id);
            toast({ title: "Sucesso", description: "A notificação foi excluída." });
            fetchSentNotifications();
        } catch (error: any) {
            toast({ title: "Erro ao Excluir", description: error.message, variant: "destructive" });
        }
    };

    const handleSendNotification = async () => {
        if (!message.trim()) {
            toast({ title: "Erro", description: "A mensagem não pode estar vazia.", variant: "destructive" });
            return;
        }
        if (target === 'specific' && !specificUser.trim()) {
             toast({ title: "Erro", description: "Por favor, especifique o e-mail do usuário.", variant: "destructive" });
            return;
        }

        setIsSending(true);
        try {
            await sendNotificationAction({ target, specificUser, notificationType, message });
            toast({
                title: "Notificação Enviada!",
                description: `Sua mensagem foi enviada para ${target === 'all' ? 'todos os usuários' : specificUser}.`,
            });
            setMessage('');
            setSpecificUser('');
            fetchSentNotifications();
        } catch (error: any) {
            toast({ title: "Erro ao Enviar", description: error.message, variant: "destructive" });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Enviar Notificações e Avisos</h1>
                <p className="text-muted-foreground">Comunique-se com seus usuários enviando alertas que aparecerão no painel deles.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Compor Mensagem</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Destinatário</Label>
                                <RadioGroup value={target} onValueChange={setTarget} className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="all" id="all" />
                                        <Label htmlFor="all" className="flex items-center gap-2 font-normal"><Users className="h-4 w-4" /> Todos</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="specific" id="specific" />
                                        <Label htmlFor="specific" className="flex items-center gap-2 font-normal"><User className="h-4 w-4" /> Específico</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {target === 'specific' && (
                                <div className="space-y-2">
                                    <Label htmlFor="specific-user">Email do Usuário</Label>
                                    <Input id="specific-user" placeholder="usuario@exemplo.com" value={specificUser} onChange={(e) => setSpecificUser(e.target.value)} />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="notification-type">Tipo de Aviso</Label>
                                <Select value={notificationType} onValueChange={setNotificationType}>
                                    <SelectTrigger id="notification-type" className="w-[200px]">
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="info">Aviso (Amarelo)</SelectItem>
                                        <SelectItem value="promo">Promoção (Azul)</SelectItem>
                                        <SelectItem value="critical">Crítico (Vermelho)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Mensagem</Label>
                                <Textarea id="message" placeholder="Escreva sua mensagem aqui..." rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
                            </div>

                             <Button onClick={handleSendNotification} disabled={isSending}>
                                {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Send className="mr-2 h-4 w-4"/>
                                Enviar Notificação
                             </Button>
                        </CardContent>
                    </Card>
                </div>
                 <div className="lg:col-span-2">
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Histórico de Envios</CardTitle>
                            <CardDescription>Últimas notificações enviadas para os usuários.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='rounded-lg border'>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Destinatário</TableHead>
                                            <TableHead>Mensagem</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead className='text-right'>Ação</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoading ? (
                                            <TableRow><TableCell colSpan={4} className='text-center h-24'><Loader2 className='mx-auto h-5 w-5 animate-spin'/></TableCell></TableRow>
                                        ) : sentNotifications.length > 0 ? (
                                            sentNotifications.map(n => (
                                                <TableRow key={n.id}>
                                                    <TableCell className="font-medium truncate max-w-[150px]">{n.target}</TableCell>
                                                    <TableCell className="text-muted-foreground truncate max-w-[200px]">{n.message}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={n.type === 'critical' ? 'destructive' : 'secondary'}>{n.type}</Badge>
                                                    </TableCell>
                                                    <TableCell className='text-right'>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Esta ação não pode ser desfeita. Isso excluirá a notificação para este usuário.
                                                                </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(n.id)} className='bg-destructive hover:bg-destructive/90'>Excluir</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-24 text-center">
                                                    Nenhuma notificação enviada.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                     </Card>
                 </div>
            </div>
        </div>
    );
}
