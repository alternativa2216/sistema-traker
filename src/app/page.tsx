import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
       <header className="container mx-auto px-4 lg:px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden lg:flex gap-6 items-center">
                <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    Features
                </Link>
                <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    Preços
                </Link>
                <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    Integração
                </Link>
            </nav>
        </div>
        <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                Login
            </Link>
            <Button asChild>
                <Link href="/register">Começar</Link>
            </Button>
        </div>
        <Button size="icon" variant="ghost" className="lg:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </Button>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 lg:px-6 pt-16 pb-20 md:pt-24 md:pb-28 text-center flex flex-col items-center">
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter mb-4">
            Analytics que <span className="text-primary">Transforma Dados</span> em<br />
            Decisões
          </h1>
          <p className="max-w-xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            O Tracklytics é a plataforma de analytics que oferece rastreamento completo,
            insights de IA e ferramentas visuais para você entender seus usuários como
            nunca.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/register">Começar Gratuitamente</Link>
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
      </main>

      <footer className="container mx-auto px-4 lg:px-6 py-8 mt-24 border-t">
        <div className="flex justify-center items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Tracklytics. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
