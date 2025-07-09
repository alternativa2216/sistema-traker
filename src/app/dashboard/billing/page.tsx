import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and view payment history.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Under Construction</CardTitle>
          <CardDescription>This page is currently in development. Come back soon to manage your billing details.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Your current plan, invoices, and payment methods will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
