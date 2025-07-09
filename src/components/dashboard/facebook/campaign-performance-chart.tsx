"use client"

import { Bar, Line, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData: any[] = [];

const chartConfig = {
  gasto: {
    label: "Gasto (R$)",
    color: "hsl(var(--secondary))",
  },
  conversoes: {
    label: "Conversões",
    color: "hsl(var(--primary))",
  },
}

export function CampaignPerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Gasto vs. Conversões</CardTitle>
        <CardDescription>Desempenho dos últimos 7 dias</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ComposedChart
                accessibilityLayer
                data={chartData}
                margin={{
                left: -20,
                right: 10,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                />
                <YAxis
                yAxisId="left"
                orientation="left"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `R$${value}`}
                />
                <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                />
                <Tooltip
                cursor={false}
                content={<ChartTooltipContent
                    indicator="dot"
                />}
                />
                <Legend />
                <Bar
                dataKey="gasto"
                yAxisId="left"
                fill="var(--color-gasto)"
                radius={4}
                />
                <Line
                dataKey="conversoes"
                yAxisId="right"
                type="monotone"
                stroke="var(--color-conversoes)"
                strokeWidth={2}
                dot={{
                    r: 4,
                    fill: "var(--color-conversoes)",
                    stroke: "var(--color-conversoes)",
                }}
                />
            </ComposedChart>
           ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
                Conecte sua conta do Facebook Ads para ver os dados.
            </div>
           )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
