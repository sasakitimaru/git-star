"use client";

import { Bar, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React, { Fragment } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { useChart } from "@/hooks/use-chart";
import { fetchRepoStarRecords } from "@/api/dashboard/actions";

function ChartSkeleton() {
  return (
    <div className="min-h-[200px] mx-auto p-4 md:p-6 flex items-baseline gap-4 md:gap-8">
      <Skeleton className="w-full h-16" />
      <Skeleton className="w-full h-24" />
      <Skeleton className="w-full h-28" />
      <Skeleton className="w-full h-36" />
      <Skeleton className="w-full h-40" />
      <Skeleton className="w-full h-52" />
      <Skeleton className="w-full h-52 hidden sm:block" />
      <Skeleton className="w-full h-56 hidden sm:block" />
      <Skeleton className="w-full h-72 hidden md:block" />
      <Skeleton className="w-full h-96 hidden md:block" />
    </div>
  );
}

export default function Component() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = React.useState(false);
  const { chartData, chartConfig, initChart, updateChart } = useChart();

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const updateSearchParams = async () => {
      const repos = params.getAll("repos");
      if (repos.length === 0) {
        initChart();
        return;
      }
      setLoading(true);
      const data = await Promise.all(
        repos.map((repo) => fetchRepoStarRecords(repo)),
      );
      updateChart(repos, data);
      setLoading(false);
    };
    updateSearchParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (loading) {
    return <ChartSkeleton />;
  }

  return (
    <>
      {chartConfig && chartData.length > 0 && (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <LineChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="yearAndMonth"
              tickMargin={10}
              tickFormatter={(value) => value.slice(2, 7)}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {Object.keys(chartConfig).map((key) => (
              <Fragment key={key}>
                <Bar dataKey={key} fill={chartConfig[key].color} radius={4} />
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={chartConfig[key].color}
                  strokeWidth={2}
                  connectNulls
                />
              </Fragment>
            ))}
          </LineChart>
        </ChartContainer>
      )}
    </>
  );
}
