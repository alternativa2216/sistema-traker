import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminSubscriptionsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Subscription Management</h1>
        <p className="text-muted-foreground">View and manage all active subscriptions.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Under Construction</CardTitle>
          <CardDescription>This page is currently in development. You will soon be able to see all active, trialing, and canceled subscriptions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>A table of all subscriptions will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
