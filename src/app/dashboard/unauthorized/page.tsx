import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Unauthorized Use</h1>
        <p className="text-muted-foreground">Check for unauthorized use of your tracking code.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Under Construction</CardTitle>
          <CardDescription>This page is currently in development. This Pro feature will alert you if your tracking code is found on unauthorized domains.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>A list of domains using your tracking code will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
