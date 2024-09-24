import Chart from "@/components/dashboard/Chart";
import DateRangePicker from "@/components/dashboard/DateRangePicker";
import SearchDialogButton from "@/components/dashboard/SearchDialogButton";
import RepositoryChips from "@/components/dashboard/RepositoryChips";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex flex-col gap-4 items-center justify-between p-8">
      <SearchDialogButton />
      <Suspense>
        <RepositoryChips />
      </Suspense>
      <Card className="w-full max-w-4xl pr-2 md:pr-8 p-4">
        <Suspense>
          <DateRangePicker className="justify-end mb-4" />
        </Suspense>
        <Suspense>
          <Chart />
        </Suspense>
      </Card>
    </main>
  );
}
