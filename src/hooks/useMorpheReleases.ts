import { useEffect, useState } from "react";

export interface MorpheAsset {
  name: string;
  size: number;
  url: string;
  arch: string;
  ext: "apk" | "zip";
}

export interface MorpheApp {
  slug: string;
  displayName: string;
  variant: string;
  version: string;
  publishedAt: string;
  buildTag: string;
  assets: MorpheAsset[];
}

interface Payload {
  apps: MorpheApp[];
  latestBuild: string | null;
  totalReleases: number;
  cachedAt?: string;
  stale?: boolean;
}

interface State extends Payload {
  loading: boolean;
  error: string | null;
}

const CACHE_KEY = "morphe-cache-v1";
const TTL = 1000 * 60 * 60 * 12; // 12h

function parseAssetName(name: string) {
  const m = name.match(
    /^(.+?)-(morphe(?:-module|-foss)?|revanced(?:-module)?)-v([^-]+(?:-[^-]+)*?)-(arm-v7a|arm64-v8a|x86|x86_64|all|universal)\.(apk|zip)$/i
  );
  if (!m) return null;
  return {
    slug: m[1],
    variant: m[2].toLowerCase(),
    version: m[3],
    arch: m[4],
    ext: m[5].toLowerCase() as "apk" | "zip",
  };
}

const prettify = (slug: string) =>
  slug.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");

async function loadFromGitHub(): Promise<Payload> {
  const res = await fetch(
    "https://api.github.com/repos/nullcpy/rvb/releases?per_page=30",
    { headers: { Accept: "application/vnd.github+json" } }
  );
  if (!res.ok) throw new Error(`GitHub HTTP ${res.status}`);
  const releases: any[] = await res.json();
  const map = new Map<string, MorpheApp>();
  for (const rel of releases) {
    for (const a of rel.assets || []) {
      const p = parseAssetName(a.name);
      if (!p) continue;
      const key = `${p.slug}::${p.variant}`;
      const existing = map.get(key);
      if (existing && new Date(existing.publishedAt) >= new Date(rel.published_at)) {
        if (existing.version === p.version) {
          existing.assets.push({ name: a.name, size: a.size, url: a.browser_download_url, arch: p.arch, ext: p.ext });
        }
        continue;
      }
      const app: MorpheApp = existing && existing.publishedAt === rel.published_at
        ? existing
        : {
            slug: p.slug, displayName: prettify(p.slug), variant: p.variant, version: p.version,
            publishedAt: rel.published_at, buildTag: rel.tag_name, assets: [],
          };
      app.assets.push({ name: a.name, size: a.size, url: a.browser_download_url, arch: p.arch, ext: p.ext });
      map.set(key, app);
    }
  }
  const apps = Array.from(map.values()).sort((a, b) => a.displayName.localeCompare(b.displayName));
  return {
    apps,
    latestBuild: releases[0]?.tag_name ?? null,
    totalReleases: releases.length,
    cachedAt: new Date().toISOString(),
  };
}

function readCache(): Payload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { t: number; data: Payload };
    if (!parsed?.data) return null;
    const fresh = Date.now() - parsed.t < TTL;
    return { ...parsed.data, stale: !fresh };
  } catch {
    return null;
  }
}

function writeCache(data: Payload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data }));
  } catch {
    /* ignore */
  }
}

export function useMorpheReleases(): State {
  const cached = typeof window !== "undefined" ? readCache() : null;
  const [state, setState] = useState<State>({
    loading: !cached || cached.stale !== false,
    error: null,
    apps: cached?.apps ?? [],
    latestBuild: cached?.latestBuild ?? null,
    totalReleases: cached?.totalReleases ?? 0,
    cachedAt: cached?.cachedAt,
    stale: cached?.stale,
  });

  useEffect(() => {
    let cancelled = false;
    // If we have fresh cache, skip refetch
    if (cached && cached.stale === false) return;

    const fetchData = async (): Promise<Payload> => {
      // Try serverless proxy first
      try {
        const r = await fetch("/api/morphe");
        const ct = r.headers.get("content-type") || "";
        if (r.ok && ct.includes("application/json")) {
          return await r.json();
        }
        throw new Error(`Proxy unavailable (${r.status})`);
      } catch {
        // Fallback: direct GitHub
        return loadFromGitHub();
      }
    };

    fetchData()
      .then((data) => {
        if (cancelled) return;
        writeCache(data);
        setState({ loading: false, error: null, ...data, stale: false });
      })
      .catch((e) => {
        if (cancelled) return;
        if (cached) {
          // Keep stale data, just stop loading
          setState((s) => ({ ...s, loading: false, error: null, stale: true }));
        } else {
          setState({
            loading: false,
            error: e?.message || "Failed to load releases",
            apps: [], latestBuild: null, totalReleases: 0,
          });
        }
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
