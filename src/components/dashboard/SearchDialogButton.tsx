import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SearchCommand from "./SearchCommand";
import { SearchIcon } from "lucide-react";

export default function Component() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="dark:text-gray-400 dark:bg-gray-900"
        >
          <SearchIcon className="mr-2 h-4 w-4" />
          Search Repositories
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby="search-repositories">
        <DialogTitle>Search Repositories</DialogTitle>
        <SearchCommand />
      </DialogContent>
    </Dialog>
  );
}
