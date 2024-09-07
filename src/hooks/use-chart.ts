"use client";

import { ChartConfig } from "@/components/ui/chart";
import React from "react";

type ChartData = {
  yearAndMonth: string;
  [repoName: string]: number | string;
}[];

const initialChartData: ChartData = [
  {
    yearAndMonth: "2021-01",
    kurimatsu: 10,
    endo: 20,
    gouenji: 30,
  },
  {
    yearAndMonth: "2021-02",
    kurimatsu: 15,
    endo: 25,
    gouenji: 35,
  },
  {
    yearAndMonth: "2021-03",
    kurimatsu: 30,
    endo: 30,
    gouenji: 40,
  },
  {
    yearAndMonth: "2021-04",
    kurimatsu: 55,
    endo: 35,
    gouenji: 40,
  },
  {
    yearAndMonth: "2021-05",
    kurimatsu: 60,
    endo: 40,
    gouenji: 50,
  },
  {
    yearAndMonth: "2021-06",
    kurimatsu: 70,
    endo: 55,
    gouenji: 55,
  },
  {
    yearAndMonth: "2021-07",
    kurimatsu: 75,
    endo: 66,
    gouenji: 60,
  },
  {
    yearAndMonth: "2021-08",
    kurimatsu: 90,
    endo: 70,
    gouenji: 65,
  },
  {
    yearAndMonth: "2021-09",
    kurimatsu: 100,
    endo: 80,
    gouenji: 70,
  },
  {
    yearAndMonth: "2021-10",
    kurimatsu: 105,
    endo: 85,
    gouenji: 90,
  },
  {
    yearAndMonth: "2021-11",
    kurimatsu: 160,
    endo: 90,
    gouenji: 97,
  },
  {
    yearAndMonth: "2021-12",
    kurimatsu: 250,
    endo: 105,
    gouenji: 115,
  },
];

const initialChartConfig: ChartConfig = {
  kurimatsu: {
    label: "kurimatsu",
    color: "hsl(0, 70%, 50%)",
  },
  endo: {
    label: "endo",
    color: "hsl(120, 70%, 50%)",
  },
  gouenji: {
    label: "gouenji",
    color: "hsl(240, 70%, 50%)",
  },
};

export function useChart() {
  const [chartData, setChartData] = React.useState<ChartData>(initialChartData);
  const [chartConfig, setChartConfig] =
    React.useState<ChartConfig>(initialChartConfig);

  function initChart() {
    setChartData(initialChartData);
    setChartConfig(initialChartConfig);
  }

  function updateChart(
    repos: string[],
    data: {
      date: string;
      count: number;
    }[][]
  ) {
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
  }

  return { chartData, chartConfig, initChart, updateChart };
}
