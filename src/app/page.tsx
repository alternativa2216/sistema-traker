import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Bot, LayoutDashboard, Lock } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-4 lg:px-6 h-20 flex items-center justify-between">
        <Logo />
        <nav className="hidden lg:flex gap-6 items-center">
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
            Login
          </Link>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </nav>
        <Button size="icon" variant="ghost" className="lg:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </Button>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 lg:px-6 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter mb-4">
            Smarter Web Analytics, Powered by AI
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            Tracklytics AI is the privacy-focused Google Analytics alternative that gives you actionable insights, not just data. Understand your visitors, optimize your website, and grow your business.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/register">Start for Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </section>

        <section id="features" className="container mx-auto px-4 lg:px-6 py-20 bg-card rounded-t-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Everything You Need to Analyze</h2>
            <p className="max-w-xl mx-auto text-muted-foreground mt-2">
              From high-level dashboards to deep-dive AI analysis, we have you covered.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-primary rounded-full mb-4">
                <LayoutDashboard className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold font-headline mb-2">User-Friendly Dashboard</h3>
              <p className="text-muted-foreground">
                All your key metrics in one clean, intuitive interface. No complexity, just clarity.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-primary rounded-full mb-4">
                <BarChart3 className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold font-headline mb-2">Detailed Analytics</h3>
              <p className="text-muted-foreground">
                Dive deep into your traffic sources, top pages, user flows, and more.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-primary rounded-full mb-4">
                <Bot className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold font-headline mb-2">AI-Powered Insights</h3>
              <p className="text-muted-foreground">
                Go beyond numbers. Ask our AI for SWOT analyses, performance reports, and strategic advice.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-primary rounded-full mb-4">
                <Lock className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold font-headline mb-2">Admin Control Panel</h3>
              <p className="text-muted-foreground">
                Manage your entire SaaS platform, from users and subscriptions to feature flags and pricing.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 lg:px-6 py-8 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Logo />
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            © {new Date().getFullYear()} Tracklytics AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
