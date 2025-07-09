import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import Image from "next/image";
import {
  Activity,
  Bot,
  Filter,
  Shield,
  Sparkles,
  MousePointerClick,
  Megaphone,
  ArrowRight
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const features = [
  {
    icon: Filter,
    title: "Análise de Funil Visual",
    description: "Construa e visualize funis de conversão para entender exatamente onde seus usuários estão desistindo e otimizar a jornada do cliente.",
    imageSrc: "https://placehold.co/500x300.png",
    imageHint: "funnel chart"
  },
  {
    icon: Sparkles,
    title: "Insights Proativos com IA",
    description: "Receba alertas e oportunidades gerados por IA diretamente no seu painel. Deixe de analisar e comece a agir.",
    imageSrc: "https://placehold.co/500x300.png",
    imageHint: "AI dashboard"
  },
  {
    icon: Shield,
    title: "Segurança e Cloaker Avançado",
    description: "Proteja seu conteúdo com filtros anti-bot, anti-spy, bloqueio geográfico e regras de redirecionamento para garantir que apenas seu público veja suas ofertas.",
    imageSrc: "https://placehold.co/500x300.png",
    imageHint: "security shield"
  },
  {
    icon: Megaphone,
    title: "Ferramentas para Facebook Ads",
    description: "Gere textos de anúncio, sugira públicos e analise criativos com o poder da IA, otimizando suas campanhas para o máximo retorno.",
    imageSrc: "https://placehold.co/500x300.png",
    imageHint: "social media"
  },
  {
    icon: Activity,
    title: "Analytics em Tempo Real",
    description: "Observe os visitantes navegando em seu site em tempo real. Veja de onde eles vêm, quais páginas acessam e entenda o comportamento ao vivo.",
    imageSrc: "https://placehold.co/500x300.png",
    imageHint: "live data"
  },
  {
    icon: MousePointerClick,
    title: "Rastreamento Completo",
    description: "Capture todas as visualizações de página e, em breve, eventos personalizados como cliques em botões e envios de formulário para uma visão 360° do engajamento.",
    imageSrc: "https://placehold.co/500x300.png",
    imageHint: "mouse cursor"
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

export default function Home() {
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
                    <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
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
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter mb-4">
            Analytics que <span className="text-primary">Transforma Dados</span> em<br />
            Decisões de Alto Impacto
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            O Tracklytics é a plataforma de analytics que oferece rastreamento completo,
            insights de IA, segurança avançada e ferramentas visuais para você entender seus usuários como
            nunca.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/register">Começar Gratuitamente por 14 dias</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">Ver Planos</Link>
            </Button>
          </div>
        </section>

        <section className="container mx-auto px-4 lg:px-6 -mt-12">
            <Card className="p-2 shadow-2xl shadow-primary/10 border-border/50 bg-card/50 backdrop-blur-sm">
                <Image
                    src="https://placehold.co/1200x600.png"
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
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">
              Uma Suíte Completa de Ferramentas de Crescimento
            </h2>
            <p className="max-w-xl mx-auto text-lg text-muted-foreground mt-4">
              Do rastreamento à otimização, temos tudo o que você precisa para tomar decisões mais inteligentes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="flex flex-col overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                   <div className="bg-muted/50 border-b">
                     <Image
                        src={feature.imageSrc}
                        width={500}
                        height={300}
                        alt={feature.title}
                        className="object-cover w-full h-48"
                        data-ai-hint={feature.imageHint}
                      />
                   </div>
                  <CardHeader className="flex flex-row items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
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
                        <Card key={testimonial.name} className="p-6">
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
