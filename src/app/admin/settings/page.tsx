import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, CreditCard, Palette, Database } from "lucide-react";
import Link from "next/link";

const settingsOptions = [
  {
    href: "/admin/settings/email",
    icon: Mail,
    title: "E-mail e Notificações",
    description: "Configure seu servidor SMTP e personalize os layouts dos e-mails.",
    enabled: true,
  },
  {
    href: "/admin/settings/billing",
    icon: CreditCard,
    title: "Faturamento e Planos",
    description: "Gerencie os preços dos seus planos e a integração com o gateway de pagamento.",
    enabled: true,
  },
  {
    href: "/admin/settings/database",
    icon: Database,
    title: "Banco de Dados",
    description: "Conecte e gerencie a conexão com seu banco de dados.",
    enabled: true,
  },
  {
    href: "/admin/content-management",
    icon: Palette,
    title: "Aparência e Conteúdo",
    description: "Edite os textos e imagens das páginas públicas (inicial, registro).",
    enabled: true,
  },
];

export default function AdminSettingsHubPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Configurações da Plataforma</h1>
        <p className="text-muted-foreground">O centro de controle para todas as configurações globais do Tracklytics.</p>
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
