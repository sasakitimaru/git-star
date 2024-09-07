"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DeletableBadge } from "../ui/badge";

export default function Component() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();
  const repos = params.getAll("repos");
  if (!repos) {
    return;
  }

  const deleteRepo = (repo: string) => {
    params.delete("repos", encodeURI(repo));
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      {repos.map((repo) => (
        <DeletableBadge
          text={repo}
          key={repo}
          onDelete={() => deleteRepo(repo)}
        />
      ))}
    </div>
  );
}
