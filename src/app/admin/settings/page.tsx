import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Platform Settings</h1>
        <p className="text-muted-foreground">Configure global settings for Tracklytics AI.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Under Construction</CardTitle>
          <CardDescription>This page is currently in development. This powerful area will allow you to configure pricing, API keys (payment gateways, AI services), and other core platform functionalities.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Forms for managing platform settings will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
