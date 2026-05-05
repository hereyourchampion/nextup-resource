import { useEffect, useState } from "react";

export interface RepoInfo {
  description?: string;
  stars?: number;
  language?: string;
  topics?: string[];
}

const CACHE_KEY = "ghRepoInfoCache_v1";
const TTL = 1000 * 60 * 60 * 24 * 7; // 7 days

type CacheEntry = { t: number; v: RepoInfo };
type Cache = Record<string, CacheEntry>;

function readCache(): Cache {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}
function writeCache(c: Cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(c));
  } catch {
    /* ignore */
  }
}

function parseRepo(url: string): { owner: string; repo: string } | null {
  try {
    const u = new URL(url);
    if (u.hostname !== "github.com") return null;
    const [owner, repo] = u.pathname.replace(/^\//, "").split("/");
    if (!owner || !repo) return null;
    return { owner, repo: repo.replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

export function useGithubRepoInfo(url: string, enabled = true): RepoInfo | null {
  const [info, setInfo] = useState<RepoInfo | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const parsed = parseRepo(url);
    if (!parsed) return;
    const key = `${parsed.owner}/${parsed.repo}`;
    const cache = readCache();
    const hit = cache[key];
    if (hit && Date.now() - hit.t < TTL) {
      setInfo(hit.v);
      return;
    }
    let cancelled = false;
    fetch(`https://api.github.com/repos/${key}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d || cancelled) return;
        const v: RepoInfo = {
          description: d.description ?? undefined,
          stars: d.stargazers_count,
          language: d.language ?? undefined,
          topics: d.topics ?? [],
        };
        setInfo(v);
        const c = readCache();
        c[key] = { t: Date.now(), v };
        writeCache(c);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [url, enabled]);

  return info;
}
