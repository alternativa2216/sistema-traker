"use client"

import { Pie, PieChart, Cell } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

const chartData: any[] = [];

const chartConfig = {
  visitors: {
    label: "Visitantes",
  },
  google: {
    label: "Google",
    color: "hsl(var(--chart-1))",
  },
  facebook: {
    label: "Facebook",
    color: "hsl(var(--chart-2))",
  },
  direct: {
    label: "Direto",
    color: "hsl(var(--chart-3))",
  },
  outros: {
    label: "Outros",
    color: "hsl(var(--chart-5))",
  },
}

export function TrafficSourceChart() {
  return (
    <div className="h-[300px] w-full">
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-full"
    >
        {chartData.length > 0 ? (
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
