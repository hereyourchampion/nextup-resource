// Vercel serverless function: caches the nullcpy/rvb GitHub releases response
// for 12h in-memory + via HTTP cache headers (s-maxage=43200, swr=86400).
//
// IMPORTANT: Add GITHUB_TOKEN env var on Vercel dashboard to avoid the
// 60 req/hour unauthenticated GitHub limit (raises it to 5000/hour).

interface MorpheAsset {
  name: string;
  size: number;
  url: string;
  arch: string;
  ext: "apk" | "zip";
}
interface MorpheApp {
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
  cachedAt: string;
}

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

function prettify(slug: string) {
  return slug.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
}

const TTL = 1000 * 60 * 60 * 12; // 12h
let cache: { t: number; data: Payload } | null = null;

async function loadReleases(): Promise<Payload> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "nextup-resources",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(
    "https://api.github.com/repos/nullcpy/rvb/releases?per_page=30",
    { headers }
  );
  if (!res.ok) throw new Error(`GitHub HTTP ${res.status}`);
  const releases: any[] = await res.json();

  const map = new Map<string, MorpheApp>();
  for (const rel of releases) {
    for (const a of rel.assets || []) {
      const parsed = parseAssetName(a.name);
      if (!parsed) continue;
      const key = `${parsed.slug}::${parsed.variant}`;
      const existing = map.get(key);
      if (existing && new Date(existing.publishedAt) >= new Date(rel.published_at)) {
        if (existing.version === parsed.version) {
          existing.assets.push({
            name: a.name,
            size: a.size,
            url: a.browser_download_url,
            arch: parsed.arch,
            ext: parsed.ext,
          });
        }
        continue;
      }
      const app: MorpheApp =
        existing && existing.publishedAt === rel.published_at
          ? existing
          : {
              slug: parsed.slug,
              displayName: prettify(parsed.slug),
              variant: parsed.variant,
              version: parsed.version,
              publishedAt: rel.published_at,
              buildTag: rel.tag_name,
              assets: [],
            };
      app.assets.push({
        name: a.name,
        size: a.size,
        url: a.browser_download_url,
        arch: parsed.arch,
        ext: parsed.ext,
      });
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

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, s-maxage=43200, stale-while-revalidate=86400");
  try {
    if (cache && Date.now() - cache.t < TTL) {
      res.status(200).json({ ...cache.data, cacheHit: true });
      return;
    }
    const data = await loadReleases();
    cache = { t: Date.now(), data };
    res.status(200).json({ ...data, cacheHit: false });
  } catch (e: any) {
    if (cache) {
      res.status(200).json({ ...cache.data, cacheHit: true, stale: true });
      return;
    }
    res.status(500).json({ error: e?.message || "Failed to load releases" });
  }
}
