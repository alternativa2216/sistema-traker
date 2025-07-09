"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "Janeiro", visitors: 18623 },
  { month: "Fevereiro", visitors: 20543 },
  { month: "Março", visitors: 29483 },
  { month: "Abril", visitors: 30103 },
  { month: "Maio", visitors: 25734 },
  { month: "Junho", visitors: 45345 },
]

const chartConfig = {
  visitors: {
    label: "Visitantes",
    color: "hsl(var(--accent))",
  },
}

export function OverviewChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Visão Geral do Tráfego</CardTitle>
        <CardDescription>Janeiro - Junho 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <Tooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="visitors" fill="var(--color-visitors)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Tendência de alta de 5,2% este mês <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Mostrando o total de visitantes dos últimos 6 meses
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
