import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground">Configure your account and tracking preferences.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Under Construction</CardTitle>
          <CardDescription>This page is currently in development. You'll soon be able to manage your profile, password, and project-specific settings here, including retrieving your tracking code.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Account and tracking settings will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
