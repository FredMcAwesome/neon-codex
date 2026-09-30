import { useEffect, useState } from "react";
import type {
  EquipmentListType,
  RequirementEvaluationContextType,
  RequirementFilterModeType,
} from "@neon-codex/common";
import {
  workerRequestEnum,
  workerResponseEnum,
  type SearchResultEquipmentType,
  type SearchResultItemType,
  type WorkerRequestType,
  type WorkerResponseType,
} from "../workers/types";

// Singleton worker instance
let worker: Worker | undefined = undefined;
const listeners = new Set<(response: WorkerResponseType) => void>();

export function postTypedMessage(
  workerInstance: Worker,
  message: WorkerRequestType
): void {
  workerInstance.postMessage(message);
}

export function getWorker() {
  if (!worker) {
    worker = new Worker(
      new URL("../workers/equipment.worker.ts", import.meta.url),
      {
        type: "module",
      }
    );
    worker.onmessage = (event: MessageEvent<WorkerResponseType>) => {
      listeners.forEach((listener) => listener(event.data));
    };
    postTypedMessage(worker, { type: workerRequestEnum.INIT });
  }
  return worker;
}

export function useEquipmentSearch() {
  const [isReady, setIsReady] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResultItemType[]>([]);
  const [details, setDetails] = useState<EquipmentListType | undefined>(
    undefined
  );
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const workerInstance = getWorker();

    const handleMessage = (response: WorkerResponseType) => {
      if (response.type === workerResponseEnum.READY) {
        setIsReady(true);
      } else if (response.type === workerResponseEnum.SEARCH_RESULTS) {
        setResults(response.results);
        setIsSearching(false);
      } else if (response.type === workerResponseEnum.DETAILS) {
        setDetails(response.data);
      } else if (response.type === workerResponseEnum.ERROR) {
        setError(response.error);
      }
    };

    listeners.add(handleMessage);

    // Trigger init check in case it's already running or needs to start
    postTypedMessage(workerInstance, { type: workerRequestEnum.INIT });

    return () => {
      listeners.delete(handleMessage);
    };
  }, []);

  const search = (
    query: string,
    filters?: SearchResultEquipmentType,
    context?: RequirementEvaluationContextType,
    filterMode?: RequirementFilterModeType
  ) => {
    setIsSearching(true);
    const workerInstance = getWorker();
    postTypedMessage(workerInstance, {
      type: workerRequestEnum.SEARCH,
      query,
      ...(filters !== undefined && { filters }),
      ...(context !== undefined && { context }),
      ...(filterMode !== undefined && { filterMode }),
    });
  };

  return { search, results, details, isReady, isSearching, error };
}
