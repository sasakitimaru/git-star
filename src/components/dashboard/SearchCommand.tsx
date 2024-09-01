"use client";

import { Input } from "@/components/ui/input";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import React, { Suspense } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Checkbox } from "../ui/checkbox";
import { LoaderCircle } from "lucide-react";
import { Spinner } from "../ui/spinner";

const repositories = [
  "react",
  "vue",
  "angular",
  "svelte",
  "preact",
  "next",
  "nuxt",
  "nest",
  "express",
  "fastify",
  "koa",
  "hapi",
  "sails",
  "loopback",
];

const RepoSuggestions = ({ query }: { query: string }) => {
  const [checkedRepos, setCheckedRepos] = React.useState<string[]>([]);
  const searchedRepositories = repositories.filter(
    (repo) => query && repo.includes(query) && !checkedRepos.includes(repo)
  );
  return (
    <CommandGroup heading="Suggestions">
      {checkedRepos.map((repo) => (
        <RepoCommandItem
          key={repo}
          repo={repo}
          checkedRepos={checkedRepos}
          setCheckedRepos={setCheckedRepos}
        />
      ))}
      <SearchedRepoItems
        query={query}
        checkedRepos={checkedRepos}
        setCheckedRepos={setCheckedRepos}
      />
    </CommandGroup>
  );
};

const SearchedRepoItems = ({
  query,
  checkedRepos,
  setCheckedRepos,
}: {
  query: string;
  checkedRepos: string[];
  setCheckedRepos: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const searchedRepositories = repositories.filter(
    (repo) => query && repo.includes(query) && !checkedRepos.includes(repo)
  );
  return (
    <Suspense fallback={<Spinner />}>
      {searchedRepositories.map((repo) => (
        <RepoCommandItem
          key={repo}
          repo={repo}
          checkedRepos={checkedRepos}
          setCheckedRepos={setCheckedRepos}
        />
      ))}
    </Suspense>
  );
};

const RepoCommandItem = ({
  repo,
  checkedRepos,
  setCheckedRepos,
}: {
  repo: string;
  checkedRepos: string[];
  setCheckedRepos: React.Dispatch<React.SetStateAction<string[]>>;
}) => (
  <CommandItem key={repo} className="gap-1">
    <Checkbox
      defaultChecked={checkedRepos.includes(repo)}
      onCheckedChange={() => {
        setCheckedRepos((prev) => {
          if (prev.includes(repo)) {
            return prev.filter((r) => r !== repo);
          }
          return [...prev, repo];
        });
      }}
      id={repo}
      className="my-auto"
    />
    <span>{repo}</span>
  </CommandItem>
);

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
        <RepoSuggestions query={query} />
        <CommandSeparator />
      </CommandList>
    </Command>
  );
}
