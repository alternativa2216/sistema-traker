'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { generateSwotAnalysisAction } from '@/app/actions/ai'
import { Loader2 } from 'lucide-react'
import type { GenerateSwotAnalysisOutput } from '@/ai/schemas'
import { GenerateSwotAnalysisInputSchema } from '@/ai/schemas'
import type { z } from 'zod'

const formSchema = GenerateSwotAnalysisInputSchema;

export function SwotAnalysis() {
  const [analysis, setAnalysis] = useState<GenerateSwotAnalysisOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectData: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)
    setAnalysis(null)
    try {
      const result = await generateSwotAnalysisAction(values)
      setAnalysis(result)
    } catch (err) {
      setError("Ocorreu um erro ao gerar a análise. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Gerar Análise SWOT</CardTitle>
          <CardDescription>
            Forneça alguns dados ou contexto sobre seu projeto, e nossa IA gerará uma análise SWOT (Forças, Fraquezas, Oportunidades, Ameaças).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="projectData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dados e Contexto do Projeto</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="ex: Descreva seu projeto, seus objetivos, público-alvo, métricas de desempenho recentes e cenário competitivo..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Gerar Análise
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && <p className="text-destructive">{error}</p>}

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-accent">Forças</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{analysis.strengths}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-destructive">Fraquezas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{analysis.weaknesses}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-primary">Oportunidades</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{analysis.opportunities}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Ameaças</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{analysis.threats}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
