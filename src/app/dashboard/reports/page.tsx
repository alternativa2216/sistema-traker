import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">AI Reports</h1>
        <p className="text-muted-foreground">Generate and view complete performance reports.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Under Construction</CardTitle>
          <CardDescription>This page is currently in development. Soon you'll be able to generate detailed, AI-powered performance reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Your generated reports will be listed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
