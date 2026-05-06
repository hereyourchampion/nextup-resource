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
  variant: string; // morphe | morphe-module | morphe-foss | revanced | ...
  version: string;
  publishedAt: string;
  buildTag: string;
  assets: MorpheAsset[];
}

interface State {
  loading: boolean;
  error: string | null;
  apps: MorpheApp[];
  latestBuild: string | null;
  totalReleases: number;
}

const CACHE_KEY = "morpheReleasesCache_v1";
const TTL = 1000 * 60 * 60; // 1h

function parseAssetName(name: string): { slug: string; variant: string; version: string; arch: string; ext: "apk" | "zip" } | null {
  // e.g. document-scanner-morphe-v6.8.18-arm-v7a.apk
  //      reddit-morphe-module-v2026.10.0-arm64-v8a.zip
  //      telegram-morphe-foss-v12.6.4-arm-v7a.apk
  const m = name.match(/^(.+?)-(morphe(?:-module|-foss)?|revanced(?:-module)?)-v([^-]+(?:-[^-]+)*?)-(arm-v7a|arm64-v8a|x86|x86_64|all|universal)\.(apk|zip)$/i);
  if (!m) return null;
  return {
    slug: m[1],
    variant: m[2].toLowerCase(),
    version: m[3],
    arch: m[4],
    ext: m[5].toLowerCase() as "apk" | "zip",
  };
}

function prettify(slug: string): string {
  return slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export function useMorpheReleases(): State {
  const [state, setState] = useState<State>({
    loading: true,
    error: null,
    apps: [],
    latestBuild: null,
    totalReleases: 0,
  });

  useEffect(() => {
    let cancelled = false;
    const cached = (() => {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.t < TTL) return parsed.v as State;
        return null;
      } catch {
        return null;
      }
    })();
    if (cached) {
      setState({ ...cached, loading: false });
      return;
    }

    fetch("https://api.github.com/repos/nullcpy/rvb/releases?per_page=30")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((releases: any[]) => {
        if (cancelled) return;
        const map = new Map<string, MorpheApp>();
        for (const rel of releases) {
          for (const a of rel.assets || []) {
            const parsed = parseAssetName(a.name);
            if (!parsed) continue;
            const key = `${parsed.slug}::${parsed.variant}::${parsed.version}`;
            const existing = map.get(`${parsed.slug}::${parsed.variant}`);
            // keep newest by publish date
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
            const app: MorpheApp = existing && existing.publishedAt === rel.published_at
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
            map.set(`${parsed.slug}::${parsed.variant}`, app);
          }
        }
        const apps = Array.from(map.values()).sort((a, b) =>
          a.displayName.localeCompare(b.displayName),
        );
        const v: State = {
          loading: false,
          error: null,
          apps,
          latestBuild: releases[0]?.tag_name ?? null,
          totalReleases: releases.length,
        };
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), v }));
        } catch {
          /* ignore */
        }
        setState(v);
      })
      .catch((e) => {
        if (cancelled) return;
        setState({
          loading: false,
          error: e?.message || "Failed to load releases",
          apps: [],
          latestBuild: null,
          totalReleases: 0,
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
