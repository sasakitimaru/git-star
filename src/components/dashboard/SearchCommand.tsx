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
import React from "react";
import { useDebouncedCallback } from "use-debounce";
import { Checkbox } from "../ui/checkbox";
import { Spinner } from "../ui/spinner";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { fetchRepositories } from "@/api/dashboard/actions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const RepoSuggestions = ({ query }: { query: string }) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const checkedRepos = params.getAll("repos");

  return (
    <CommandGroup heading="Suggestions">
      {checkedRepos.map((repo) => (
        <RepoCommandItem key={repo} repo={repo} defaultChecked />
      ))}
      <SearchedRepoItems query={query} checkedRepos={checkedRepos} />
    </CommandGroup>
  );
};

const SearchedRepoItems = ({
  query,
  checkedRepos,
}: {
  query: string;
  checkedRepos: string[];
}) => {
  const [repositories, setRepositories] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!query || query.length < 3) {
      setRepositories([]);
      return;
    }

    const updateSearchParams = async () => {
      setLoading(true);
      const res = await fetchRepositories(query);
      const repos = res.items.map((item: any) => item.full_name);
      setRepositories(repos);
      setLoading(false);
    };
    updateSearchParams();
  }, [query]);

  if (loading) {
    return (
      <CommandItem className="flex justify-center p-2">
        <Spinner />
      </CommandItem>
    );
  }

  return repositories
    .filter((repo) => !checkedRepos.includes(repo))
    .map((repo) => <RepoCommandItem key={repo} repo={repo} />);
};

const RepoCommandItem = ({
  repo,
  defaultChecked = false,
}: {
  repo: string;
  defaultChecked?: boolean;
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleOnCheckedChange = (checked: boolean | "indeterminate") => {
    if (checked === "indeterminate") return;

    const params = new URLSearchParams(searchParams);
    checked
      ? params.append("repos", repo)
      : params.delete("repos", encodeURI(repo));
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <CommandItem key={repo} className="gap-1">
      <Checkbox
        defaultChecked={defaultChecked}
        onCheckedChange={(e) => handleOnCheckedChange(e)}
        id={repo}
        className="my-auto"
      />
      <span>{repo}</span>
    </CommandItem>
  );
};

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
        <ErrorBoundary
          errorComponent={(e) => {
            return (
              <div className="flex justify-center p-2">
                <span>Error: {e.error.message}</span>
              </div>
            );
          }}
        >
          <RepoSuggestions query={query} />
        </ErrorBoundary>
        <CommandSeparator />
      </CommandList>
    </Command>
  );
}
