import { SwotAnalysis } from "@/components/dashboard/swot-analysis";

export default function AnalysisPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">AI SWOT Analysis</h1>
        <p className="text-muted-foreground">Leverage AI to uncover strategic insights about your project.</p>
      </div>
      <SwotAnalysis />
    </div>
  )
}
