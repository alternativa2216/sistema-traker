import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Database, UserCircle, CreditCard, Bell, KeyRound } from "lucide-react";
import Link from "next/link";

const settingsOptions = [
  {
    href: "/dashboard/settings/profile",
    icon: UserCircle,
    title: "Perfil",
    description: "Gerencie os detalhes do seu perfil e senha.",
    enabled: true,
  },
  {
    href: "/dashboard/billing",
    icon: CreditCard,
    title: "Faturamento",
    description: "Veja seu plano, histórico e métodos de pagamento.",
    enabled: true,
  },
  {
    href: "/dashboard/settings/database",
    icon: Database,
    title: "Banco de Dados",
    description: "Configure a conexão com seu banco de dados.",
    enabled: true,
  },
  {
    href: "/dashboard/settings/notifications",
    icon: Bell,
    title: "Notificações",
    description: "Escolha como você recebe as notificações.",
    enabled: true,
  },
  {
    href: "/dashboard/settings/api-keys",
    icon: KeyRound,
    title: "Chaves de API",
    description: "Gerencie chaves de API para integrações personalizadas.",
    enabled: false, // Disabling this for now
  }
];

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações da sua conta e da plataforma.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {settingsOptions.map((option) => {
          const cardContent = (
            <Card className={`hover:bg-muted/50 transition-colors h-full ${!option.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <CardHeader className="flex flex-row items-center gap-4">
                <option.icon className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="font-headline">{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          );

          if (!option.enabled) {
            return <div key={option.title}>{cardContent}</div>;
          }

          return (
            <Link href={option.href} key={option.title}>
              {cardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
