import { useEffect, useRef, useState } from "react";
import type {
  EquipmentListType,
  RequirementEvaluationContextType,
  RequirementFilterModeType,
} from "@neon-codex/common";
import {
  workerRequestEnum,
  workerResponseEnum,
  DEFAULT_SEARCH_LIMIT,
  type SearchResultEquipmentType,
  type SearchResultItemType,
  type WorkerRequestType,
  type WorkerResponseType,
} from "../workers/types";

// Singleton worker instance for equipment search
let worker: Worker | undefined = undefined;
const listeners = new Set<(response: WorkerResponseType) => void>();
let workerReady = false;

// Monotonic counter per search() call to prevent out-of-order updates
let searchRequestCounter = 0;

export function postTypedMessage(
  workerInstance: Worker,
  message: WorkerRequestType
): void {
  workerInstance.postMessage(message);
}

export function getWorker() {
  if (!worker) {
    if (typeof Worker === "undefined") {
      // Test/SSR fallback dummy worker
      const dummy: Partial<Worker> = {
        postMessage: () => {},
        onmessage: null,
        addEventListener: () => {},
        removeEventListener: () => {},
      };
      worker = dummy as Worker;
      return worker;
    }
    worker = new Worker(
      new URL("../workers/equipment.worker.ts", import.meta.url),
      {
        type: "module",
      }
    );
    worker.onmessage = (event: MessageEvent<WorkerResponseType>) => {
      if (event.data.type === workerResponseEnum.READY) {
        workerReady = true;
      }
      listeners.forEach((listener) => listener(event.data));
    };
  }
  return worker;
}

export function initEquipmentWorker() {
  try {
    const workerInstance = getWorker();
    postTypedMessage(workerInstance, { type: workerRequestEnum.INIT });
  } catch {
    // Ignore in test/SSR where Worker is unavailable.
  }
}

export function isWorkerReady(): boolean {
  return workerReady;
}

// Resolves once the worker has acknowledged boot (READY)
export function waitForWorkerReady(timeoutMs = 15000): Promise<void> {
  if (typeof Worker === "undefined" || workerReady) {
    return Promise.resolve();
  }
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      listeners.delete(handleMessage);
      reject(new Error("Timeout waiting for equipment worker to boot"));
    }, timeoutMs);
    const handleMessage = (response: WorkerResponseType) => {
      if (response.type === workerResponseEnum.READY) {
        clearTimeout(timer);
        listeners.delete(handleMessage);
        resolve();
      }
    };
    listeners.add(handleMessage);
  });
}

export interface SearchPagingOptions {
  offset?: number;
  limit?: number;
}

export function useEquipmentSearch() {
  const [isReady, setIsReady] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResultItemType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [details, setDetails] = useState<EquipmentListType | undefined>(
    undefined
  );
  const [error, setError] = useState<string | undefined>(undefined);
  const latestIdRef = useRef(0);

  useEffect(() => {
    getWorker();

    const handleMessage = (response: WorkerResponseType) => {
      if (response.type === workerResponseEnum.READY) {
        setIsReady(true);
      } else if (response.type === workerResponseEnum.SEARCH_RESULTS) {
        // Ignore stale out-of-order responses
        if (
          response.requestId !== undefined &&
          response.requestId !== latestIdRef.current
        ) {
          return;
        }
        setResults(response.results);
        setTotal(
          typeof response.total === "number"
            ? response.total
            : response.results.length
        );
        setIsSearching(false);
      } else if (response.type === workerResponseEnum.DETAILS) {
        setDetails(response.data);
      } else if (response.type === workerResponseEnum.ERROR) {
        setError(response.error);
        setIsSearching(false);
      }
    };

    listeners.add(handleMessage);

    return () => {
      listeners.delete(handleMessage);
    };
  }, []);

  const search = (
    query: string,
    filters?: SearchResultEquipmentType,
    context?: RequirementEvaluationContextType,
    filterMode?: RequirementFilterModeType,
    paging?: SearchPagingOptions
  ) => {
    searchRequestCounter++;
    const requestId = searchRequestCounter;
    latestIdRef.current = requestId;
    setIsSearching(true);
    const workerInstance = getWorker();
    postTypedMessage(workerInstance, {
      type: workerRequestEnum.SEARCH,
      query,
      ...(filters !== undefined && { filters }),
      ...(context !== undefined && { context }),
      ...(filterMode !== undefined && { filterMode }),
      offset: paging?.offset ?? 0,
      limit: paging?.limit ?? DEFAULT_SEARCH_LIMIT,
      requestId,
    });
  };

  return { search, results, total, details, isReady, isSearching, error };
}
