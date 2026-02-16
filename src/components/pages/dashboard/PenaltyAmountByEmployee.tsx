"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useDataContext } from "@/context/data-context/dataContext";

export const description = "Penalty amount by employee";

const chartConfig = {
  employee: { label: "Employee" },
  amount: {
    label: "Amount",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

function PenaltyAmountByEmployee() {
  const { penaltyData, employeeMapped } = useDataContext();

  const employeeAmountArray = useMemo(() => {
    const byEmployee = penaltyData.reduce((acc, p) => {
      acc[p.employee_id] = (acc[p.employee_id] ?? 0) + Number(p.amount);
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(byEmployee)
      .map(([employee_id, amount]) => ({
        employee: employeeMapped[employee_id]?.name ?? "Unknown",
        amount,
      }))
      .sort((a, b) => b.amount - a.amount)
      .map((item, index) => ({
        ...item,
        employee: index + 1 + ". " + item.employee,
      }));
  }, [penaltyData, employeeMapped]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Penalty amount by employee</CardTitle>
        <CardDescription>Total penalty amount per employee</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[600px] w-full">
          <BarChart
            accessibilityLayer
            data={employeeAmountArray}
            layout="vertical"
            margin={{ left: 12, right: 12, top: 0 }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              hide={true}
              tickFormatter={(v) => `৳${Number(v).toLocaleString()}`}
            />
            <YAxis
              hide={true}
              type="category"
              dataKey="employee"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={140}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent formatter={(value) => [`Total Amount: ৳${Number(value).toLocaleString()}`]} />
              }
            />
            <Bar dataKey="amount" fill="var(--color-amount)" radius={4}>
              <LabelList
                dataKey="employee"
                position="insideLeft"
                offset={8}
                style={{ fill: "#fff", fontWeight: "bold" }}
                fontSize={11}
                formatter={(value) => value}
              />
              <LabelList
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
                formatter={(value) => `৳${Number(value).toLocaleString()}`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default PenaltyAmountByEmployee;
