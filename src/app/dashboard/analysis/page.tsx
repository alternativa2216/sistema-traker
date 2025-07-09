import { SwotAnalysis } from "@/components/dashboard/swot-analysis";

export default function AnalysisPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Análise SWOT com IA</h1>
        <p className="text-muted-foreground">Use a IA para descobrir insights estratégicos sobre seu projeto.</p>
      </div>
      <SwotAnalysis />
    </div>
  )
}
