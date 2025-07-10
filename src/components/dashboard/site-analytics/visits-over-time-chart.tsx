"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Loader2 } from "lucide-react";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--primary))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--accent))",
  },
}

export function VisitsOverTimeChart({ data, isLoading }: { data: any[], isLoading: boolean }) {
  return (
    <div className="h-[300px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
            {isLoading ? (
                 <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : data.length > 0 ? (
                <LineChart
                    accessibilityLayer
                    data={data}
                    margin={{
                    top: 5,
                    right: 10,
                    left: -10,
                    bottom: 0,
                    }}
                >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickCount={6}
                    />
                    <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent
                        indicator="line"
                        labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    />}
                    />
                    <Line
                    dataKey="desktop"
                    type="natural"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={{
                        fill: "var(--color-desktop)",
                    }}
                    activeDot={{
                        r: 6,
                    }}
                    />
                    <Line
                    dataKey="mobile"
                    type="natural"
                    stroke="var(--color-mobile)"
                    strokeWidth={2}
                    dot={{
                        fill: "var(--color-mobile)",
                    }}
                    activeDot={{
                        r: 6,
                    }}
                    />
                </LineChart>
            ) : (
                 <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Sem dados de visita.
                </div>
            )}
        </ChartContainer>
    </div>
  )
}
