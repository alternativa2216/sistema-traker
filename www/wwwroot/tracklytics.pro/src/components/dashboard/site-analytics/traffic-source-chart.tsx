"use client"

import { Pie, PieChart, Cell } from "recharts"
import { Loader2 } from "lucide-react";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

const chartConfig = {
  'Google': { label: 'Google', color: 'hsl(var(--chart-1))' },
  'Facebook': { label: 'Facebook', color: 'hsl(var(--chart-2))' },
  'Direto': { label: 'Direto', color: 'hsl(var(--chart-3))' },
  'Outros': { label: 'Outros', color: 'hsl(var(--chart-5))' },
}

export function TrafficSourceChart({ data, isLoading }: { data: any[], isLoading: boolean }) {
  const chartData = data.map(item => ({
    ...item,
    fill: (chartConfig[item.source as keyof typeof chartConfig] || chartConfig['Outros']).color
  }));

  return (
    <div className="h-[300px] w-full">
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-full"
    >
        {isLoading ? (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : data.length > 0 ? (
            <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                    data={chartData}
                    dataKey="visitors"
                    nameKey="source"
                    innerRadius={60}
                    strokeWidth={5}
                >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                </Pie>
                <ChartLegend
                    content={<ChartLegendContent nameKey="source" />}
                    className="-translate-y-[2rem] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
            </PieChart>
        ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Sem dados de tráfego.
            </div>
        )}
    </ChartContainer>
    </div>
  )
}
