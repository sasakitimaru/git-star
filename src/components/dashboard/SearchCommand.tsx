"use client";

import { Input } from "@/components/ui/input";

import { Calendar } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import React from "react";
import { useDebouncedCallback } from "use-debounce";
import { Skeleton } from "../ui/skeleton";

export default function Component() {
  const [query, setQuery] = React.useState("");

  const handleInputChange = useDebouncedCallback((term: string) => {
    setQuery(term);
  }, 300);

  return (
    <Command className="rounded-lg border shadow-md w-full max-w-screen-2xl">
      <Input
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Type a command or search..."
      />
      <CommandList className="">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          {query.length > 3 ? (
            <CommandItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Calendar</span>
            </CommandItem>
          ) : (
            <CommandItem className="flex flex-col gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CommandItem>
          )}
        </CommandGroup>
        <CommandSeparator />
      </CommandList>
    </Command>
  );
}
