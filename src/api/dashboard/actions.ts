"use server";

import { Octokit } from "@octokit/core";

const octokit = new Octokit({
  // auth: process.env.GITHUB_API_TOKEN,
});

export const fetchRepositories = async (q: string) => {
  return await octokit.request("GET /search/repositories", {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
    q,
  });
};
