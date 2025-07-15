'use client'

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { getCurrentUserAction, updateUserPasswordAction, updateUserInfoAction } from '@/app/actions/user';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória.'),
  newPassword: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres.'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As novas senhas não coincidem.",
  path: ["confirmPassword"],
});


export default function ProfileSettingsPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSavingInfo, setIsSavingInfo] = React.useState(false);
    const [isSavingPassword, setIsSavingPassword] = React.useState(false);
    
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');

    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' }
    });

    React.useEffect(() => {
        async function fetchUser() {
            setIsLoading(true);
            try {
                const user = await getCurrentUserAction();
                if(user) {
                    setName(user.name);
                    setEmail(user.email);
                }
            } catch (error: any) {
                toast({ title: "Erro ao carregar perfil", description: error.message, variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        }
        fetchUser();
    }, [toast]);

    const handleSaveInfo = async () => {
        setIsSavingInfo(true);
        try {
            await updateUserInfoAction({ name, email });
            toast({ title: 'Sucesso!', description: 'Suas informações foram atualizadas.'});
        } catch (error: any) {
             toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
        } finally {
            setIsSavingInfo(false);
        }
    };

    const handlePasswordChange = async (values: z.infer<typeof passwordSchema>) => {
        setIsSavingPassword(true);
        try {
            await updateUserPasswordAction(values);
            toast({ title: 'Sucesso!', description: 'Sua senha foi alterada.' });
            passwordForm.reset();
        } catch (error: any) {
             toast({ title: "Erro ao alterar senha", description: error.message, variant: "destructive" });
        } finally {
            setIsSavingPassword(false);
        }
    };

    if (isLoading) {
        return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold font-headline">Perfil</h1>
        <p className="text-muted-foreground">Gerencie os detalhes do seu perfil e senha.</p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Informações Pessoais</CardTitle>
          <CardDescription>Atualize seu nome e endereço de e-mail.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Endereço de E-mail</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveInfo} disabled={isSavingInfo}>
            {isSavingInfo && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Informações
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
          <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)}>
            <CardHeader>
            <CardTitle className="font-headline">Senha</CardTitle>
            <CardDescription>Altere sua senha. Recomendamos usar um gerenciador de senhas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input id="current-password" type="password" {...passwordForm.register('currentPassword')} />
                {passwordForm.formState.errors.currentPassword && <p className="text-sm text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input id="new-password" type="password" {...passwordForm.register('newPassword')} />
                 {passwordForm.formState.errors.newPassword && <p className="text-sm text-destructive">{passwordForm.formState.errors.newPassword.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input id="confirm-password" type="password" {...passwordForm.register('confirmPassword')} />
                 {passwordForm.formState.errors.confirmPassword && <p className="text-sm text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>}
            </div>
            </CardContent>
            <CardFooter>
            <Button type="submit" disabled={isSavingPassword}>
                 {isSavingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Alterar Senha
            </Button>
            </CardFooter>
          </form>
      </Card>
    </div>
  );
}
