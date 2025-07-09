import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminProjectsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Project Management</h1>
        <p className="text-muted-foreground">Oversee all projects created on the platform.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Under Construction</CardTitle>
          <CardDescription>This page is currently in development. You will soon be able to view and manage all user projects from a centralized location.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>A table of all projects will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
