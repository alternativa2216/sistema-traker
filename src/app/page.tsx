
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSettingsAction } from "./actions/settings";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    title: "Análise de Funil Visual",
    description: "Construa funis de conversão para entender a jornada do seu cliente e identificar com precisão os pontos de abandono.",
    image: "https://i.postimg.cc/mD8c5gGj/funnel-feature.png",
    imageHint: "funnel chart"
  },
  {
    title: "Suíte de Segurança Completa",
    description: "Proteja suas páginas com filtros anti-bot, anti-spy e geográficos. Garanta que apenas seu público certo veja suas ofertas.",
    image: "https://i.postimg.cc/d1c3vXGz/cloaker-feature.png",
    imageHint: "security dashboard"
  },
  {
    title: "Insights com Inteligência Artificial",
    description: "Receba alertas e oportunidades geradas por IA. Deixe nossa inteligência trabalhar para você, sugerindo melhorias e destacando tendências.",
    image: "https://i.postimg.cc/t4gHq6k5/ai-feature.png",
    imageHint: "AI chatbot interface"
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
  },
  {
    name: "Juliana Costa",
    title: "Gerente de Mídia Paga",
    quote: "As ferramentas para Facebook Ads são um divisor de águas. O gerador de públicos e a análise de criativos economizam horas de trabalho e melhoram nosso ROAS.",
    avatar: "https://placehold.co/40x40.png",
    avatarHint: "woman headshot"
  }
];

const faqs = [
    {
        question: "O que é o Tracklytics?",
        answer: "O Tracklytics é uma plataforma de web analytics que vai além dos dados básicos. Combinamos rastreamento completo, uma suíte de segurança avançada com cloaker, e ferramentas de IA para fornecer insights acionáveis e otimizar suas estratégias de marketing digital."
    },
    {
        question: "Preciso de conhecimentos técnicos para usar?",
        answer: "Não! A plataforma foi projetada para ser intuitiva. A instalação é uma única linha de código, e nossos painéis e ferramentas são fáceis de usar, mesmo para quem não é desenvolvedor. As ferramentas de IA, como o gerador de anúncios, são feitas para simplificar seu trabalho."
    },
    {
        question: "Como o cloaker funciona?",
        answer: "Nosso cloaker (ou suíte de segurança) permite que você crie regras para filtrar o tráfego. Você pode bloquear bots, ferramentas de espionagem, visitantes de certos países, ou até mesmo redirecionar tráfego com base em regras complexas, garantindo que apenas seu público ideal veja suas ofertas estratégicas."
    },
    {
        question: "Posso cancelar meu plano a qualquer momento?",
        answer: "Sim, você pode cancelar ou alterar seu plano a qualquer momento diretamente no seu painel de faturamento. Não há contratos de longo prazo ou taxas de cancelamento."
    }
];

const defaultContent = {
    homeHeadline: 'Analytics que Transforma Dados em Decisões de Alto Impacto',
    homeSubheadline: 'O Tracklytics é a única plataforma de web analytics que combina rastreamento completo, insights proativos com IA, uma suíte de segurança avançada e ferramentas visuais para você dominar sua estratégia digital.',
    dashboardImageUrl: 'https://i.postimg.cc/TY4Jc3Zg/main-dash.png',
    freePlanFeatures: "1 Projeto\n10.000 visualizações de página/mês\nAnálises Básicas\nRetenção de dados por 7 dias",
    proPlanPrice: "29",
    proPlanFeatures: "10 Projetos\n200.000 visualizações de página/mês\nSuíte de Segurança e Cloaker\nTodas as Ferramentas de IA\nAnálise de Funil e Tempo Real\nRetenção de dados por 1 ano",
};

export default async function Home() {
  let content = defaultContent;
  try {
    const settingsKeys = ['homeHeadline', 'homeSubheadline', 'dashboardImageUrl', 'freePlanFeatures', 'proPlanPrice', 'proPlanFeatures'];
    const fetchedSettings = await getSettingsAction(settingsKeys);

    // Merge fetched settings with defaults, ensuring no key is undefined
    const newContent = { ...defaultContent };
    for (const key of settingsKeys) {
        if (fetchedSettings[key]) {
            (newContent as any)[key] = fetchedSettings[key];
        }
    }
    content = newContent;
  } catch (e) {
      console.log("Database not ready, using default content for homepage.");
  }

  const tiers = [
      {
        name: "Grátis",
        price: "R$0",
        description: "Para projetos pessoais e para começar.",
        features: content.freePlanFeatures.split('\n'),
        cta: "Comece de Graça",
        href: "/register"
      },
      {
        name: "Pro",
        price: `R$${content.proPlanPrice}`,
        description: "Para profissionais e pequenas empresas.",
        features: content.proPlanFeatures.split('\n'),
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
          "Visualizações de página personalizadas",
          "Acesso à API",
          "Suporte Dedicado",
          "Retenção de dados ilimitada",
        ],
        cta: "Contatar Vendas",
        href: "mailto:sales@tracklytics.pro"
      },
    ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter mb-4 max-w-4xl">
            {content.homeHeadline}
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            {content.homeSubheadline}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button size="lg" asChild>
              <Link href="/register">Começar Gratuitamente <ArrowRight className="ml-2 h-5 w-5"/></Link>
            </Button>
             <Button size="lg" variant="outline" asChild>
                <Link href="#features">Ver Funcionalidades <ChevronRight className="ml-2 h-5 w-5"/></Link>
            </Button>
          </div>
        </section>

        <section className="container mx-auto px-4 lg:px-6 -mt-12">
            <div className="relative rounded-lg p-2 bg-gradient-to-t from-primary/10 via-card to-card border border-border/30 shadow-2xl shadow-primary/10">
                {/* Browser Mockup Header */}
                <div className="flex items-center gap-1.5 p-2.5 border-b border-border/30">
                    <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                </div>
                 <Image
                    src={content.dashboardImageUrl}
                    width={1200}
                    height={800}
                    alt="Dashboard preview"
                    className="rounded-b-md"
                    data-ai-hint="dashboard analytics"
                />
            </div>
        </section>

        <section id="features" className="container mx-auto px-4 lg:px-6 py-20 md:py-28">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold font-headline tracking-tighter">
                    Uma suíte de ferramentas, <span className="text-primary">um objetivo: seu crescimento.</span>
                </h2>
                <p className="max-w-3xl mx-auto text-lg text-muted-foreground mt-4">
                    Fomos além do básico para entregar um conjunto de ferramentas que resolvem problemas reais e impulsionam o crescimento.
                </p>
            </div>
            <div className="space-y-24">
                {features.map((feature, index) => (
                    <div key={feature.title} className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center`}>
                        <div className={`space-y-4 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                            <h3 className="text-3xl font-bold font-headline">{feature.title}</h3>
                            <p className="text-lg text-muted-foreground">{feature.description}</p>
                            <Button variant="link" asChild className="p-0 h-auto text-lg">
                                <Link href="/register">Saber Mais <ArrowRight className="ml-2 h-4 w-4"/></Link>
                            </Button>
                        </div>
                        <div className={`rounded-lg bg-muted/50 p-4 border ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                             <Image
                                src={feature.image}
                                width={1024}
                                height={768}
                                alt={`Preview da funcionalidade ${feature.title}`}
                                className="rounded-md shadow-lg"
                                data-ai-hint={feature.imageHint}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>

        <section id="pricing" className="bg-muted/50 py-20 md:py-28">
           <div className="container mx-auto px-4 lg:px-6">
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
                <Card key={tier.name} className={`relative flex flex-col text-left bg-card ${tier.featured ? 'border-primary ring-2 ring-primary shadow-lg' : ''}`}>
                   {tier.featured && (
                      <Badge className="absolute -top-3 right-4">Mais Popular</Badge>
                   )}
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
           </div>
        </section>

        <section id="testimonials" className="py-20 md:py-28">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">
                        Amado por Profissionais de Marketing e Fundadores
                    </h2>
                    <p className="max-w-xl mx-auto text-lg text-muted-foreground mt-4">
                        Veja por que os líderes da indústria escolhem o Tracklytics para impulsionar seus resultados.
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <Card key={testimonial.name} className="p-6 text-left bg-card">
                            <CardContent className="p-0 flex flex-col h-full">
                                <blockquote className="text-lg text-foreground mb-4 flex-grow">
                                    "{testimonial.quote}"
                                </blockquote>
                                <div className="flex items-center gap-4 pt-4 border-t">
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

        <section id="faq" className="container mx-auto px-4 lg:px-6 py-20 md:py-28">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold font-headline tracking-tighter">
                    Perguntas Frequentes
                </h2>
                <p className="max-w-xl mx-auto text-lg text-muted-foreground mt-4">
                    Tem alguma dúvida? Encontre suas respostas aqui.
                </p>
            </div>
            <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>

        <section className="container mx-auto px-4 lg:px-6 pb-20 md:pb-28">
            <div className="bg-card border rounded-lg p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-center lg:text-left">
                    <h2 className="text-3xl font-bold font-headline">Pronto para Desbloquear seus Insights?</h2>
                    <p className="text-muted-foreground mt-2 max-w-xl">
                        Junte-se a centenas de empresas que já estão tomando decisões baseadas em dados reais. Comece seu teste gratuito hoje mesmo.
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
