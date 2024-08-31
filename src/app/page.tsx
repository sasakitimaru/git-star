import Chart from "@/components/dashboard/Chart";
import DateRangePicker from "@/components/dashboard/DateRangePicker";
import SearchDialogButton from "@/components/dashboard/SearchDialogButton";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex flex-col gap-4 items-center justify-between p-8">
      <SearchDialogButton />
      <Card className="w-full xl:w-4/5 pr-2 md:pr-8 p-4">
        <DateRangePicker className="justify-end mb-4" />
        <Chart />
      </Card>
    </main>
  );
}
