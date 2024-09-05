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
import React, { Fragment } from "react";
import { useSearchParams } from "next/navigation";
import { fetchRepoStarRecords } from "@/api/dashboard/actions";
import { Skeleton } from "../ui/skeleton";

type ChartData = {
  yearAndMonth: string;
  [repoName: string]: number | string;
}[];

function ChartSkeleton() {
  return (
    <div className="p-4">
      {/* チャートのタイトル部分 */}
      <Skeleton className="w-1/3 h-6" />

      {/* チャートのメインエリア */}
      <div className="mt-4 flex flex-col">
        {/* Y軸のラベル */}
        <Skeleton className="w-20 h-4" />

        {/* チャート本体 */}
        <div className="flex-1">
          <Skeleton className="w-full h-full" />
        </div>
      </div>

      {/* X軸のラベル */}
      <div className="mt-4">
        <Skeleton className="w-full h-20" />
      </div>
    </div>
  );
}

export default function Component() {
  const searchParams = useSearchParams();
  const [chartData, setChartData] = React.useState<ChartData>([]);
  const [chartConfig, setChartConfig] = React.useState<ChartConfig>();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const updateSearchParams = async () => {
      const repos = params.getAll("repos");
      if (repos.length === 0) {
        return;
      }

      setLoading(true);
      const data = await Promise.all(
        repos.map((repo) => fetchRepoStarRecords(repo))
      );
      const newChartData = data
        .reduce((acc, item, index) => {
          const repo = repos[index];
          item.forEach((record) => {
            const yearAndMonth = record.date;
            const existingDataIndex = acc.findIndex(
              (data) => data.yearAndMonth === yearAndMonth
            );
            if (existingDataIndex !== -1) {
              acc[existingDataIndex][repo] = record.count;
            } else {
              acc.push({
                yearAndMonth,
                [repo]: record.count,
              });
            }
          });
          return acc;
        }, [] as ChartData)
        .sort((a, b) => {
          const dateA = new Date(a.yearAndMonth);
          const dateB = new Date(b.yearAndMonth);
          return dateA.getTime() - dateB.getTime();
        });

      setChartData(newChartData);
      setChartConfig(
        repos.reduce(
          (acc, repo, index) => ({
            ...acc,
            [repo]: {
              label: repo,
              color: `hsl(${(index * 360) / repos.length}, 70%, 50%)`,
            },
          }),
          {} as ChartConfig
        )
      );
      setLoading(false);
    };
    updateSearchParams();
  }, [searchParams]);

  if (true) {
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
