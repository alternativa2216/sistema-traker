import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import Image from "next/image";
import {
  ArrowRight,
  BarChart,
  Bot,
  Check,
  Filter,
  Shield,
  Facebook,
  Activity,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSettingsAction } from "./actions/settings";

const features = [
  {
    icon: Filter,
    title: "Análise de Funil Visual",
    description: "Construa funis de conversão personalizados para entender a jornada do seu cliente e identificar com precisão os pontos de abandono para otimizar suas vendas.",
  },
  {
    icon: Bot,
    title: "Insights Proativos com IA",
    description: "Receba alertas e oportunidades geradas por IA diretamente no seu painel. Deixe nossa inteligência artificial trabalhar para você, sugerindo melhorias e destacando tendências.",
  },
  {
    icon: Shield,
    title: "Cloaker e Suíte de Segurança",
    description: "Proteja suas páginas com filtros anti-bot, anti-spy, geográficos e bloqueio de inspeção. Garanta que apenas seu público certo veja suas ofertas estratégicas.",
  },
  {
    icon: Facebook,
    title: "Ferramentas para Facebook Ads",
    description: "Gere textos de anúncio (copy), sugira públicos-alvo e analise a eficácia de seus criativos. Uma suíte completa para turbinar suas campanhas.",
  },
  {
    icon: Activity,
    title: "Analytics em Tempo Real",
    description: "Acompanhe os visitantes no seu site em tempo real. Veja de onde eles vêm, quais páginas estão visitando e entenda o fluxo de usuários ao vivo.",
  },
  {
    icon: BarChart,
    title: "Dashboards Intuitivos",
    description: "Todos os seus dados importantes, como fontes de tráfego e páginas mais visitadas, apresentados em gráficos e tabelas fáceis de entender.",
  },
];

const tiers = [
  {
    name: "Grátis",
    price: "R$0",
    description: "Para projetos pessoais e para começar.",
    features: [
      "1 Projeto",
      "10.000 visualizações de página/mês",
      "Análises Básicas",
      "Retenção de dados por 7 dias",
    ],
    cta: "Comece de Graça",
    href: "/register"
  },
  {
    name: "Pro",
    price: "R$29",
    description: "Para profissionais e pequenas empresas.",
    features: [
      "10 Projetos",
      "200.000 visualizações de página/mês",
      "Suíte de Segurança e Cloaker",
      "Todas as Ferramentas de IA",
      "Análise de Funil e Tempo Real",
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
      "Acesso à API",
      "Suporte Dedicado",
      "Retenção de dados ilimitada",
    ],
    cta: "Contatar Vendas",
    href: "mailto:sales@tracklytics.ai"
  },
];


const testimonials = [
  {
    name: "Ana Silva",
    title: "CMO, InovaTech",
    quote: "O Tracklytics transformou nossa análise de dados. Os insights da IA são incrivelmente precisos e o cloaker nos deu a segurança que precisávamos para nossas campanhas.",
    avatar: "https://placehold.co/40x40.png",
    avatarHint: "woman portrait"
  },
  {
    name: "Carlos Martins",
    title: "Fundador, E-commerce de Sucesso",
    quote: "A análise de funil é simplesmente a melhor do mercado. Consegui identificar um gargalo que estava me custando milhares e o corrigi em um dia. Recomendo fortemente!",
    avatar: "https://placehold.co/40x40.png",
    avatarHint: "man portrait"
  }
]

const defaultContent = {
    homeHeadline: 'Analytics que Transforma Dados em Decisões de Alto Impacto',
    homeSubheadline: 'O Tracklytics é a única plataforma de web analytics que combina rastreamento completo, insights proativos com IA, uma suíte de segurança avançada e ferramentas visuais para você dominar sua estratégia digital.',
    dashboardImageUrl: 'https://placehold.co/1200x600.png',
};


export default async function Home() {
  const contentKeys = ['homeHeadline', 'homeSubheadline', 'dashboardImageUrl'];
  let settings = {};
  try {
    settings = await getSettingsAction(contentKeys);
  } catch (e) {
      console.error("Database not ready, using default content for home page.");
  }
  
  const content = { ...defaultContent, ...settings };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <Logo />
                <nav className="hidden lg:flex gap-6 items-center">
                    <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Funcionalidades
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Preços
                    </Link>
                    <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Depoimentos
                    </Link>
                </nav>
            </div>
            <div className="hidden lg:flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                    Login
                </Link>
                <Button asChild>
                    <Link href="/register">Começar Gratuitamente</Link>
                </Button>
            </div>
            <Button size="icon" variant="ghost" className="lg:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 lg:px-6 pt-16 pb-20 md:pt-24 md:pb-28 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter mb-4 whitespace-pre-line">
            {content.homeHeadline.replace('Transforma Dados', '<span class="text-primary">Transforma Dados</span>').replace(/Decisões de Alto Impacto/g, '<span class="text-primary">Decisões de Alto Impacto</span>')}
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            {content.homeSubheadline}
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/register">Começar Gratuitamente por 14 dias</Link>
            </Button>
          </div>
        </section>

        <section className="container mx-auto px-4 lg:px-6 -mt-12">
            <Card className="p-2 shadow-2xl shadow-primary/10 border-border/50 bg-card/50 backdrop-blur-sm">
                <Image
                    src={content.dashboardImageUrl}
                    width={1200}
                    height={600}
                    alt="Dashboard preview"
                    className="rounded-md"
                    data-ai-hint="dashboard analytics"
                />
            </Card>
        </section>

        <section id="features" className="container mx-auto px-4 lg:px-6 py-20 md:py-28">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold font-headline tracking-tighter">
                    Por que o <span className="text-primary">Tracklytics</span> é diferente?
                </h2>
                <p className="max-w-3xl mx-auto text-lg text-muted-foreground mt-4">
                    Fomos além do básico para entregar um conjunto de ferramentas que resolvem problemas reais e impulsionam o crescimento.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature) => (
                    <Card key={feature.title} className="bg-card/50 border-border/50 p-6 flex flex-col items-start text-left">
                        <div className="bg-primary/10 p-3 rounded-lg mb-4">
                           <feature.icon className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-xl mb-2">{feature.title}</CardTitle>
                        <CardDescription className="text-base flex-grow">{feature.description}</CardDescription>
                    </Card>
                ))}
            </div>
        </section>
        
        <section id="how-it-works" className="bg-muted/50 py-20 md:py-28">
          <div className="container mx-auto px-4 lg:px-6">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-5xl font-bold font-headline tracking-tighter">Comece a Otimizar em Minutos</h2>
                  <p className="max-w-2xl mx-auto text-lg text-muted-foreground mt-4">
                      Nosso processo é simples e direto ao ponto.
                  </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center bg-card border rounded-full h-16 w-16 mb-4">
                          <span className="text-2xl font-bold font-headline text-primary">1</span>
                      </div>
                      <h3 className="text-xl font-headline font-semibold mb-2">Instale o Script</h3>
                      <p className="text-muted-foreground">Adicione uma única linha de código no cabeçalho do seu site para começar a coletar dados.</p>
                  </div>
                   <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center bg-card border rounded-full h-16 w-16 mb-4">
                          <span className="text-2xl font-bold font-headline text-primary">2</span>
                      </div>
                      <h3 className="text-xl font-headline font-semibold mb-2">Configure suas Ferramentas</h3>
                      <p className="text-muted-foreground">Defina seu funil, ative a segurança e conecte suas contas de marketing com poucos cliques.</p>
                  </div>
                   <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center bg-card border rounded-full h-16 w-16 mb-4">
                          <span className="text-2xl font-bold font-headline text-primary">3</span>
                      </div>
                      <h3 className="text-xl font-headline font-semibold mb-2">Receba Insights e Cresça</h3>
                      <p className="text-muted-foreground">Acompanhe os resultados, use os insights da IA e veja suas conversões aumentarem.</p>
                  </div>
              </div>
          </div>
        </section>

        <section id="pricing" className="container mx-auto px-4 lg:px-6 py-20 md:py-28">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold font-headline tracking-tighter">
                Encontre o plano perfeito para você
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-muted-foreground mt-4">
                Comece de graça e escale conforme seu negócio cresce. Sem pegadinhas.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-5xl mx-auto">
              {tiers.map((tier) => (
                <Card key={tier.name} className={`flex flex-col text-left ${tier.featured ? 'border-primary ring-2 ring-primary shadow-lg' : ''}`}>
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-6">
                    <div className="text-4xl font-bold font-headline">
                      {tier.price}
                      {tier.name === "Pro" && <span className="text-sm font-normal text-muted-foreground">/mês</span>}
                    </div>
                    <ul className="space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-400" />
                          <span className="text-muted-foreground">{feature}</span>
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

        <section id="testimonials" className="bg-muted/50 py-20 md:py-28">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">
                        Amado por Profissionais de Marketing e Fundadores
                    </h2>
                    <p className="max-w-xl mx-auto text-lg text-muted-foreground mt-4">
                        Veja por que os líderes da indústria escolhem o Tracklytics para impulsionar seus resultados.
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {testimonials.map((testimonial) => (
                        <Card key={testimonial.name} className="p-6 text-left">
                            <CardContent className="p-0">
                                <blockquote className="text-lg text-foreground mb-4">
                                    "{testimonial.quote}"
                                </blockquote>
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.avatarHint} />
                                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        <section className="container mx-auto px-4 lg:px-6 py-20 md:py-28">
            <div className="bg-card border rounded-lg p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-center lg:text-left">
                    <h2 className="text-3xl font-bold font-headline">Pronto para Desbloquear seus Insights?</h2>
                    <p className="text-muted-foreground mt-2 max-w-xl">
                        Junte-se a centenas de empresas que já estão tomando decisões baseadas em dados reais. Comece seu teste gratuito de 14 dias hoje mesmo.
                    </p>
                </div>
                <Button size="lg" asChild className="shrink-0">
                    <Link href="/register">
                        Começar Gratuitamente <ArrowRight className="ml-2 h-5 w-5"/>
                    </Link>
                </Button>
            </div>
        </section>

      </main>

      <footer className="container mx-auto px-4 lg:px-6 py-8 mt-8 border-t">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Tracklytics. Todos os direitos reservados.
            </p>
        </div>
      </footer>
    </div>
  );
}
