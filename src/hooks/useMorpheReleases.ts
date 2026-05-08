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

interface State {
  loading: boolean;
  error: string | null;
  apps: MorpheApp[];
  latestBuild: string | null;
  totalReleases: number;
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
    fetch("/api/morphe")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => {
        if (cancelled) return;
        setState({
          loading: false,
          error: null,
          apps: data.apps || [],
          latestBuild: data.latestBuild ?? null,
          totalReleases: data.totalReleases ?? 0,
        });
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
