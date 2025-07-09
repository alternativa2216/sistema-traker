import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminFeatureFlagsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Feature Flags</h1>
        <p className="text-muted-foreground">Control feature availability across different plans.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Under Construction</CardTitle>
          <CardDescription>This page is currently in development. Here you will be able to enable or disable specific features for Free and Pro plans, giving you full control over your monetization strategy.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>A list of toggleable features will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
