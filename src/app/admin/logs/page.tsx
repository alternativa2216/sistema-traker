import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminLogsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">System Logs</h1>
        <p className="text-muted-foreground">View application and system logs.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Under Construction</CardTitle>
          <CardDescription>This page is currently in development. You will soon have access to a log viewer for debugging and monitoring platform activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>A live feed of system logs will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
