"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

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
  visits: {
    label: "Visitas",
    color: "hsl(var(--primary))",
  },
}

export function OverviewChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Visão Geral das Visitas</CardTitle>
        <CardDescription>Total de visitas de todos os seus sites nos últimos 7 dias.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
            {chartData.length > 0 ? (
                <LineChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                    left: 12,
                    right: 12,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 5)}
                    />
                    <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickCount={6}
                    />
                    <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Line
                    dataKey="visits"
                    type="natural"
                    stroke="var(--color-visits)"
                    strokeWidth={2}
                    dot={false}
                    />
                </LineChart>
            ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                    Nenhum dado de visita disponível.
                </div>
            )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
