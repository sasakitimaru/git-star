import Chart from "@/components/dashboard/Chart";
import SearchBar from "@/components/dashboard/SearchBar";

export default function Home() {
  return (
    <main className="flex flex-col gap-4 items-center justify-between p-8">
      <SearchBar />
      <Chart />
    </main>
  );
}
