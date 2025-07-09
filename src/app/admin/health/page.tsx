import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminHealthPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">System Health</h1>
        <p className="text-muted-foreground">Monitor the technical health of the platform.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Under Construction</CardTitle>
          <CardDescription>This page is currently in development. You will soon be able to monitor database connections, API response times, and other critical system metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>System health charts and status indicators will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
