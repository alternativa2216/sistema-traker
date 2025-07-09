import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ProjectsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Projects</h1>
        <p className="text-muted-foreground">Manage all your tracked websites.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Under Construction</CardTitle>
          <CardDescription>This page is currently in development. You will soon be able to add, edit, and manage your projects from here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>A list of your projects will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
