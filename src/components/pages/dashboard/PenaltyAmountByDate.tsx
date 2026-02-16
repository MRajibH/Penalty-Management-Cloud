"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { subDays, subYears, eachDayOfInterval, format, parseISO } from "date-fns"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDataContext } from "@/context/data-context/dataContext"
import { useMemo } from "react"

export const description = "Penalty amount collected by date"

const RANGE_DAYS = { "7d": 7, "30d": 30, "1y": 365 } as const
type RangeKey = keyof typeof RANGE_DAYS

const chartConfig = {
  date: { label: "Date" },
  amount: {
    label: "Amount collected",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

function toDateKey(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "yyyy-MM-dd")
  } catch {
    return format(new Date(dateStr), "yyyy-MM-dd")
  }
}

function aggregateByDate(penaltyData: { date: string; amount: number; status: string }[]) {
  const byDate = new Map<string, number>()
  for (const p of penaltyData) {
    // if (p.status !== "PAID") continue
    const key = toDateKey(p.date)
    byDate.set(key, (byDate.get(key) ?? 0) + parseInt(p.amount.toString()))
  }
  return Array.from(byDate.entries())
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

function PenaltyAmountByDate() {
  const { penaltyData } = useDataContext()
  const [timeRange, setTimeRange] = React.useState<RangeKey>("30d")

  const chartData = React.useMemo(() => aggregateByDate(penaltyData), [penaltyData])

  const filteredData = React.useMemo(() => {
    const now = new Date()
    const end = now
    const days = RANGE_DAYS[timeRange]
    const start = timeRange === "1y" ? subYears(now, 1) : subDays(now, days)
    const range = eachDayOfInterval({ start, end })
    const amountByDate = new Map(chartData.map(({ date, amount }) => [date, amount]))
    return range.map((d) => {
      const dateStr = format(d, "yyyy-MM-dd")
      return { date: dateStr, amount: amountByDate.get(dateStr) ?? 0 }
    })
  }, [chartData, timeRange])

  const rangeLabel =
    timeRange === "7d" ? "Last 7 days" : timeRange === "30d" ? "Last 30 days" : "Last 1 year"

  const totalAmount = useMemo(() => {
    return filteredData.reduce((acc, { amount }) => acc + amount, 0)
  }, [filteredData])

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Amount collected by date</CardTitle>
          <CardDescription>{rangeLabel} <span className="text-xs font-bold text-primary">( ৳{totalAmount.toLocaleString()})</span></CardDescription>
        </div>
        <Select value={timeRange} onValueChange={(v) => setTimeRange(v as RangeKey)}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="1y" className="rounded-lg">
              Last 1 year
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-amount)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-amount)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <YAxis
              domain={[0, "auto"]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `৳${Number(value).toLocaleString()}`}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  formatter={(value) => [`৳${Number(value)} `, "Collected"]}
                />
              }
            />
            <Area
              dataKey="amount"
              type="monotone"
              fill="url(#fillAmount)"
              stroke="var(--color-amount)"
            />
            <ChartLegend content={({ payload, verticalAlign }) => <ChartLegendContent payload={payload} verticalAlign={verticalAlign} />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default PenaltyAmountByDate;