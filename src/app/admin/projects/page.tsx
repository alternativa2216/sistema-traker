'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from "react";
import { getAllProjectsAction } from "@/app/actions/admin";
import Link from "next/link";

export default function AdminProjectsPage() {
    const { toast } = useToast();
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        async function fetchProjects() {
            setIsLoading(true);
            try {
                const result = await getAllProjectsAction();
                setProjects(result);
            } catch (error: any) {
                toast({ title: "Erro", description: error.message, variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        }
        fetchProjects();
    }, [toast]);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline">Gerenciamento de Sites</h1>
                <p className="text-muted-foreground">Supervisione todos os sites criados na plataforma.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Todos os Sites</CardTitle>
                    <CardDescription>
                        Encontramos {projects.length} sites na sua plataforma.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome do Site</TableHead>
                                    <TableHead>Proprietário</TableHead>
                                    <TableHead>Data de Criação</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                                        </TableCell>
                                    </TableRow>
                                ) : projects.length > 0 ? (
                                    projects.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell>
                                                <div className="font-medium">{project.name}</div>
                                                <Link href={project.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:underline">
                                                    {project.url}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{project.user_name}</div>
                                                <div className="text-sm text-muted-foreground">{project.user_email}</div>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(project.created_at).toLocaleDateString('pt-BR')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/sites/${project.id}`}>Ver Analytics</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem disabled className="text-destructive">Suspender Site</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            Nenhum site encontrado.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
