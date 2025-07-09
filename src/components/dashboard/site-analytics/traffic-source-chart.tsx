"use client"

import { Pie, PieChart, Cell } from "recharts"

import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

const chartData = [
  { source: "google", visitors: 275, fill: "var(--color-google)" },
  { source: "facebook", visitors: 200, fill: "var(--color-facebook)" },
  { source: "direct", visitors: 287, fill: "var(--color-direct)" },
  { source: "outros", visitors: 190, fill: "var(--color-outros)" },
]

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
    </ChartContainer>
    </div>
  )
}
