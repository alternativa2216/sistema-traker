import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/shared/logo";
import { Check } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "For personal projects and getting started.",
    features: [
      "1 Project",
      "10,000 monthly pageviews",
      "Basic Analytics",
      "7-day data retention",
    ],
    cta: "Start for Free",
    href: "/register"
  },
  {
    name: "Pro",
    price: "$29",
    description: "For professionals and small businesses.",
    features: [
      "10 Projects",
      "200,000 monthly pageviews",
      "Advanced Analytics",
      "AI SWOT Analysis & Reports",
      "Error Diagnostics",
      "1-year data retention",
    ],
    cta: "Get Started with Pro",
    href: "/register",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large-scale applications and agencies.",
    features: [
      "Unlimited Projects",
      "Custom pageview limits",
      "AI Chatbot",
      "API Access",
      "Dedicated Support",
      "Unlimited data retention",
    ],
    cta: "Contact Sales",
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
            Find the perfect plan for your needs
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-12">
            Start for free, then scale as you grow. All plans include our core analytics features.
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
                    {tier.name !== "Enterprise" && <span className="text-sm font-normal text-muted-foreground">/month</span>}
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
            © {new Date().getFullYear()} Tracklytics AI. All rights reserved.
          </p>
      </footer>
    </div>
  );
}
