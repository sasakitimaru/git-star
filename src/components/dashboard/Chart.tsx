"use client";

import { Bar, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { useSearchParams } from "next/navigation";
import { fetchStars } from "@/api/dashboard/actions";

const chartData = [
  { month: "Jan", desktop: 4000, mobile: 2400 },
  { month: "Feb", desktop: 3000, mobile: 1398 },
  { month: "Mar", desktop: 2000, mobile: 9800 },
  { month: "Apr", desktop: 2780, mobile: 3908 },
  { month: "May", desktop: 1890, mobile: 4800 },
  { month: "Jun", desktop: 2390, mobile: 3800 },
  { month: "Jul", desktop: 3490, mobile: 4300 },
  { month: "Aug", desktop: 4000, mobile: 2400 },
  { month: "Sep", desktop: 3000, mobile: 1398 },
  { month: "Oct", desktop: 2000, mobile: 9800 },
  { month: "Nov", desktop: 2780, mobile: 3908 },
  { month: "Dec", desktop: 1890, mobile: 4800 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export default function Component() {
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const updateSearchParams = async () => {
      const repos = params.getAll("repos");
      console.log(repos);
      const data = await Promise.all(repos.map(fetchStars));
      console.log(data);
    };
    updateSearchParams();
  }, [searchParams]);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        <Line
          type="monotone"
          dataKey="desktop"
          stroke="var(--color-desktop)"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="mobile"
          stroke="var(--color-mobile)"
          strokeWidth={2}
        />
      </LineChart>
    </ChartContainer>
  );
}
