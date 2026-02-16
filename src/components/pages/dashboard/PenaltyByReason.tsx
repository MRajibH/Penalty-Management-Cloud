"use client"

import { useMemo } from "react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useDataContext } from "@/context/data-context/dataContext"

export const description = "Penalty count by reason"

const chartConfig = {
  reason: { label: "Reason" },
  count: {
    label: "Count",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

function PenaltyByReason() {
  const { penaltyData, penaltyReasonMapped } = useDataContext()

  const reasonCountArray = useMemo(() => {
    const countByReasonId = penaltyData.reduce((acc, p) => {
      acc[p.reason_id] = (acc[p.reason_id] ?? 0) + 1
      return acc
    }, {} as Record<string, number>)
    return Object.entries(countByReasonId)
      .map(([reason_id, count]) => ({
        reason: penaltyReasonMapped[reason_id]?.reason_name ?? "Unknown",
        count,
      }))
      .sort((a, b) => b.count - a.count)
  }, [penaltyData, penaltyReasonMapped])

  return (
    <Card className="h-full">
      <CardHeader >
        <CardTitle>Penalties by reason</CardTitle>
        <CardDescription>Count of penalties per reason</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto max-h-[250px]"
        >
          <RadarChart data={reasonCountArray}>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => [`Count: ${value}`]}
                />
              }
            />
            <PolarAngleAxis dataKey="reason" />
            <PolarGrid />
            <Radar
              dataKey="count"
              fill="var(--color-count)"
              fillOpacity={0.6}
              stroke="var(--color-count)"
              dot={{ r: 4, fillOpacity: 1 }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default PenaltyByReason;