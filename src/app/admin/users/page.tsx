import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminUsersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">User Management</h1>
        <p className="text-muted-foreground">View, edit, and manage all platform users.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Under Construction</CardTitle>
          <CardDescription>This page is currently in development. You will soon be able to manage all users, change their plans, and impersonate them for support purposes.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>A table of all registered users will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
