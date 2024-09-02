"use server";

import { Octokit } from "@octokit/core";

const octokit = new Octokit({
  auth: process.env.GITHUB_API_TOKEN,
});

export const fetchRepositories = async (q: string) => {
  return await octokit.request("GET /search/repositories", {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
    q,
  });
};

export const fetchStars = async (repo: string) => {
  let page = 1;
  const perPage = 100;
  const starMap: { [year: string]: number } = {};

  while (true) {
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/stargazers",
      {
        headers: {
          Accept: "application/vnd.github.v3.star+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        owner: repo.split("/")[0],
        repo: repo.split("/")[1],
        page,
        per_page: perPage,
      }
    );

    const stargazers = response.data;
    if (stargazers.length === 0) break;

    stargazers.forEach((stargazer: any) => {
      const year = new Date(stargazer.starred_at).getFullYear().toString();
      if (!starMap[year]) {
        starMap[year] = 0;
      }
      starMap[year]++;
    });

    page++;
  }

  return starMap;
};
