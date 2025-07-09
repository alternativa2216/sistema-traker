import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminSecurityPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Security</h1>
        <p className="text-muted-foreground">Monitor security-related events and logs.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Under Construction</CardTitle>
          <CardDescription>This page is currently in development. Here you will be able to view active login sessions, audit important actions, and monitor for suspicious activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Security logs and session management tools will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
