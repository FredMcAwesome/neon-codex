import { useEffect, useState } from "react";
import { get, set } from "idb-keyval";
import { CREATOR_DATA_VERSION } from "@neon-codex/common";
import type { CreatorStaticDataType } from "@neon-codex/common";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "@neon-codex/backend";

const DB_KEY = "creator-data";
const DATA_URL = "/creator-data.json";

export type CreatorDataKey = Exclude<keyof CreatorStaticDataType, "version">;
export type CreatorStaticDataError = TRPCClientErrorLike<AppRouter> | null;

// Static creator catalogs served as a single versioned JSON file and cached in IndexedDB
let bundlePromise: Promise<CreatorStaticDataType> | null = null;

function loadBundle(): Promise<CreatorStaticDataType> {
  if (!bundlePromise) {
    bundlePromise = (async () => {
      try {
        const cached = await get<CreatorStaticDataType>(DB_KEY);
        if (cached !== undefined && cached.version === CREATOR_DATA_VERSION) {
          return cached;
        }
      } catch {
        // Fall through to network if IndexedDB is unavailable
      }
      const response = await fetch(DATA_URL);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch creator data: ${response.status} ${response.statusText}`
        );
      }
      const data = (await response.json()) as CreatorStaticDataType;
      if (data.version !== CREATOR_DATA_VERSION) {
        throw new Error(
          `Stale creator data: got version ${JSON.stringify(data.version)}, expected ${CREATOR_DATA_VERSION}`
        );
      }
      try {
        await set(DB_KEY, data);
      } catch {
        // Ignore IndexedDB write errors
      }
      return data;
    })();
    // Reset on failure so one failure doesn't stall all future hooks.
    bundlePromise.catch(() => {
      bundlePromise = null;
    });
  }
  return bundlePromise;
}

function toQueryError(message: string): Exclude<CreatorStaticDataError, null> {
  return {
    message,
    shape: undefined,
    data: undefined,
  };
}

// Result shape mirroring react-query queries for compatibility with existing guards.
export type CreatorStaticDataResult<T> =
  | { data: undefined; isPending: true; isError: false; error: null }
  | {
      data: undefined;
      isPending: false;
      isError: true;
      error: Exclude<CreatorStaticDataError, null>;
    }
  | { data: T; isPending: false; isError: false; error: null };

export function useCreatorStaticData<K extends CreatorDataKey>(
  key: K
): CreatorStaticDataResult<CreatorStaticDataType[K]> {
  const [result, setResult] = useState<
    CreatorStaticDataResult<CreatorStaticDataType[K]>
  >({ data: undefined, isPending: true, isError: false, error: null });

  useEffect(() => {
    let cancelled = false;
    loadBundle().then(
      (bundle) => {
        if (cancelled) return;
        setResult({
          data: bundle[key],
          isPending: false,
          isError: false,
          error: null,
        });
      },
      (err: unknown) => {
        if (cancelled) return;
        setResult({
          data: undefined,
          isPending: false,
          isError: true,
          error: toQueryError(err instanceof Error ? err.message : String(err)),
        });
      }
    );
    return () => {
      cancelled = true;
    };
  }, [key]);

  return result;
}
