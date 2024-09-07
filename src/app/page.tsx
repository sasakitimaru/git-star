import Chart from "@/components/dashboard/Chart";
import DateRangePicker from "@/components/dashboard/DateRangePicker";
import SearchDialogButton from "@/components/dashboard/SearchDialogButton";
import RepositoryChips from "@/components/dashboard/RepositoryChips";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex flex-col gap-4 items-center justify-between p-8">
      <SearchDialogButton />
      <RepositoryChips />
      <Card className="w-full max-w-4xl pr-2 md:pr-8 p-4">
        <DateRangePicker className="justify-end mb-4" />
        <Chart />
      </Card>
    </main>
  );
}
