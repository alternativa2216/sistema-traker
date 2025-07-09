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

const chartData = [
  { date: "01/07", gasto: 150, conversoes: 5 },
  { date: "02/07", gasto: 180, conversoes: 8 },
  { date: "03/07", gasto: 200, conversoes: 7 },
  { date: "04/07", gasto: 170, conversoes: 10 },
  { date: "05/07", gasto: 220, conversoes: 12 },
  { date: "06/07", gasto: 250, conversoes: 15 },
  { date: "07/07", gasto: 210, conversoes: 11 },
];

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
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
