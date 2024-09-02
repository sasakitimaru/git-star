const DEFAULT_PER_PAGE = 30;
const BASE_URL = "https://api.github.com";
const TOKEN = process.env.GITHUB_API_TOKEN!;

export async function fetchRepoStargazers(
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
  return res.json();
}

export async function fetchRepoStargazersCount(
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
  token: string,
  maxRequestAmount: number = 15
): Promise<{ date: string; count: number }[]> {
  const patchRes = await fetchRepoStargazers(repo, token);

  const headerLink = patchRes.headers["link"] || "";

  let pageCount = 1;
  const regResult = /next.*&page=(\d*).*last/.exec(headerLink);

  if (regResult && regResult[1] && Number.isInteger(Number(regResult[1]))) {
    pageCount = Number(regResult[1]);
  }

  if (pageCount === 1 && patchRes?.data?.length === 0) {
    throw {
      status: patchRes.status,
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

export async function getRepoLogoUrl(
  repo: string,
  token?: string
): Promise<string> {
  const owner = repo.split("/")[0];
  const res = await fetch(`${BASE_URL}/users/${owner}`, {
    headers: {
      Accept: "application/vnd.github.v3.star+json",
      Authorization: token ? `token ${token}` : "",
    },
  });

  return res.json().then((data) => data.avatar_url);
}

function buildArrayFromRange(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function getDateString(
  t: Date | number | string,
  format = "yyyy/MM/dd hh:mm:ss"
): string {
  const d = new Date(new Date(t).getTime());

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();

  const formatedString = format
    .replace("yyyy", String(year))
    .replace("MM", String(month))
    .replace("dd", String(date))
    .replace("hh", String(hours))
    .replace("mm", String(minutes))
    .replace("ss", String(seconds));

  return formatedString;
}
