"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { date: "Jan", desktop: 186, mobile: 80 },
  { date: "Fev", desktop: 305, mobile: 200 },
  { date: "Mar", desktop: 237, mobile: 120 },
  { date: "Abr", desktop: 73, mobile: 190 },
  { date: "Mai", desktop: 209, mobile: 130 },
  { date: "Jun", desktop: 214, mobile: 140 },
  { date: "Jul", desktop: 314, mobile: 240 },
  { date: "Ago", desktop: 214, mobile: 140 },
  { date: "Set", desktop: 414, mobile: 240 },
  { date: "Out", desktop: 314, mobile: 210 },
  { date: "Nov", desktop: 514, mobile: 340 },
  { date: "Dez", desktop: 414, mobile: 380 },
]

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

export function VisitsOverTimeChart() {
  return (
    <div className="h-[300px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
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
                hideLabel
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
        </ChartContainer>
    </div>
  )
}
