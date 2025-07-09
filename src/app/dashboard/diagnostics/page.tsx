import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DiagnosticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Diagnostics</h1>
        <p className="text-muted-foreground">Monitor your site's health and track errors.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Under Construction</CardTitle>
          <CardDescription>This page is currently in development. Soon you'll be able to track Javascript errors and other site health metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>A log of site errors and performance issues will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
