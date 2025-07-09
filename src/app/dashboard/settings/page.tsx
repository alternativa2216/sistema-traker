import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Database, UserCircle, CreditCard, Bell } from "lucide-react";
import Link from "next/link";

const settingsOptions = [
  {
    href: "/dashboard/settings", // Placeholder for profile
    icon: UserCircle,
    title: "Perfil",
    description: "Gerencie os detalhes do seu perfil e senha.",
  },
  {
    href: "/dashboard/billing",
    icon: CreditCard,
    title: "Faturamento",
    description: "Veja seu plano, histórico e métodos de pagamento.",
  },
  {
    href: "/dashboard/settings/database",
    icon: Database,
    title: "Banco de Dados",
    description: "Configure a conexão com seu banco de dados.",
  },
  {
    href: "/dashboard/settings", // Placeholder for notifications
    icon: Bell,
    title: "Notificações",
    description: "Escolha como você recebe as notificações.",
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações da sua conta e da plataforma.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {settingsOptions.map((option) => (
          <Link href={option.href} key={option.title}>
            <Card className="hover:bg-muted/50 transition-colors h-full">
              <CardHeader className="flex flex-row items-center gap-4">
                <option.icon className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="font-headline">{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
