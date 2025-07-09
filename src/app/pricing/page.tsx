import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/shared/logo";
import { Check } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Grátis",
    price: "$0",
    description: "Para projetos pessoais e para começar.",
    features: [
      "1 Projeto",
      "10.000 visualizações de página mensais",
      "Análises Básicas",
      "Retenção de dados por 7 dias",
    ],
    cta: "Comece de Graça",
    href: "/register"
  },
  {
    name: "Pro",
    price: "$29",
    description: "Para profissionais e pequenas empresas.",
    features: [
      "10 Projetos",
      "200.000 visualizações de página mensais",
      "Análise Avançada",
      "Análise SWOT e Relatórios de IA",
      "Diagnóstico de Erros",
      "Retenção de dados por 1 ano",
    ],
    cta: "Começar com Pro",
    href: "/register",
    featured: true,
  },
  {
    name: "Empresarial",
    price: "Custom",
    description: "Para aplicações e agências de grande escala.",
    features: [
      "Projetos Ilimitados",
      "Limites de visualização de página personalizados",
      "Chatbot de IA",
      "Acesso à API",
      "Suporte Dedicado",
      "Retenção de dados ilimitada",
    ],
    cta: "Contatar Vendas",
    href: "mailto:sales@tracklytics.ai"
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-4 lg:px-6 h-20 flex items-center">
        <Logo />
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 lg:px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter mb-4">
            Encontre o plano perfeito para suas necessidades
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-12">
            Comece de graça, depois dimensione conforme você cresce. Todos os planos incluem nossos principais recursos de análise.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {tiers.map((tier) => (
              <Card key={tier.name} className={`flex flex-col ${tier.featured ? 'border-primary ring-2 ring-primary' : ''}`}>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-6">
                  <div className="text-4xl font-bold font-headline">
                    {tier.price}
                    {tier.name !== "Empresarial" && <span className="text-sm font-normal text-muted-foreground">/mês</span>}
                  </div>
                  <ul className="space-y-3 text-left">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-accent" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className={`w-full ${tier.featured ? '' : 'variant="outline"'}`}>
                    <Link href={tier.href}>{tier.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 lg:px-6 py-8 border-t border-border">
          <p className="text-sm text-center text-muted-foreground">
            © {new Date().getFullYear()} Tracklytics. Todos os direitos reservados.
          </p>
      </footer>
    </div>
  );
}
