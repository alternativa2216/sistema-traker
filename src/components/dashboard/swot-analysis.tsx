'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import type { GenerateSwotAnalysisOutput } from '@/ai/flows/generate-swot-analysis'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  projectData: z.string().min(50, {
    message: "Please provide at least 50 characters of project data for an effective analysis.",
  }),
})

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
      setError("An error occurred while generating the analysis. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Generate SWOT Analysis</CardTitle>
          <CardDescription>
            Provide some data or context about your project, and our AI will generate a SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis.
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
                    <FormLabel>Project Data & Context</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Describe your project, its goals, target audience, recent performance metrics, and competitive landscape..."
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
                Generate Analysis
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
              <CardTitle className="font-headline text-accent">Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{analysis.strengths}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-destructive">Weaknesses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{analysis.weaknesses}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-primary">Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{analysis.opportunities}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Threats</CardTitle>
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
