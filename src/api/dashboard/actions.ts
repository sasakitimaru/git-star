"use server";

const DEFAULT_PER_PAGE = 30;
const BASE_URL = "https://api.github.com";
const TOKEN = process.env.GITHUB_API_TOKEN!;

async function fetchRepoStargazers(
  repo: string,
  token: string = TOKEN,
  page?: number
) {
  const url = new URL(`${BASE_URL}/repos/${repo}/stargazers`);
  url.searchParams.append("per_page", String(DEFAULT_PER_PAGE));
  if (page !== undefined) {
    url.searchParams.append("page", String(page));
  }

  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3.star+json",
      Authorization: token ? `token ${token}` : "",
    },
  });
  const data = await res.json();
  return { data, status: res.status, headers: res.headers };
}

async function fetchRepoStargazersCount(
  repo: string,
  token: string = TOKEN
): Promise<number> {
  const res = await fetch(`${BASE_URL}/repos/${repo}`, {
    headers: {
      Accept: "application/vnd.github.v3.star+json",
      Authorization: token ? `token ${token}` : "",
    },
  });

  return res.json().then((data) => data.stargazers_count);
}

export async function fetchRepoStarRecords(
  repo: string,
  token: string = TOKEN,
  maxRequestAmount: number = 15
): Promise<{ date: string; count: number }[]> {
  const { data, status, headers } = await fetchRepoStargazers(repo, token);
  const headerLink = headers.get("link") || "";

  let pageCount = 1;
  const regResult = /next.*&page=(\d*).*last/.exec(headerLink);

  if (regResult && regResult[1] && Number.isInteger(Number(regResult[1]))) {
    pageCount = Number(regResult[1]);
  }

  if (pageCount === 1 && data?.length === 0) {
    throw {
      status,
      data: [],
    };
  }

  const requestPages: number[] = [];
  if (pageCount < maxRequestAmount) {
    requestPages.push(...buildArrayFromRange(1, pageCount));
  } else {
    buildArrayFromRange(1, maxRequestAmount).forEach((i) => {
      requestPages.push(Math.round((i * pageCount) / maxRequestAmount) - 1);
    });
    if (!requestPages.includes(1)) {
      requestPages[0] = 1;
    }
  }

  const resArray = await Promise.all(
    requestPages.map((page) => {
      return fetchRepoStargazers(repo, token, page);
    })
  );

  const starRecordsMap: Map<string, number> = new Map();

  if (requestPages.length < maxRequestAmount) {
    const starRecordsData = resArray.flatMap(({ data }) => data);
    for (let i = 0; i < starRecordsData.length; ) {
      starRecordsMap.set(getDateString(starRecordsData[i].starred_at), i + 1);
      i += Math.floor(starRecordsData.length / maxRequestAmount) || 1;
    }
  } else {
    resArray.forEach(({ data }, index) => {
      if (data.length > 0) {
        const starRecord = data[0];
        starRecordsMap.set(
          getDateString(starRecord.starred_at),
          DEFAULT_PER_PAGE * (requestPages[index] - 1)
        );
      }
    });
  }

  const starAmount = await fetchRepoStargazersCount(repo, token);
  starRecordsMap.set(getDateString(Date.now()), starAmount);

  return Array.from(starRecordsMap, ([date, count]) => ({
    date,
    count,
  }));
}

export async function fetchRepositories(q: string, token: string = TOKEN) {
  const res = await fetch(`${BASE_URL}/search/repositories?q=${q}`, {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `token ${TOKEN}`,
    },
  });
  return res.json();
}

function buildArrayFromRange(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function getDateString(t: Date | number | string, format = "yyyy/MM"): string {
  const d = new Date(new Date(t).getTime());

  const year = d.getFullYear();
  const month = d.getMonth() + 1;

  const formatedString = format
    .replace("yyyy", String(year))
    .replace("MM", String(month));

  return formatedString;
}
