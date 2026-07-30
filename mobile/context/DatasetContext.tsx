import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loadDataset, search as searchIndex } from "@/lib/data";
import type { Dataset, SearchRecord } from "@/lib/types";

type DatasetContextValue = {
  data: Dataset | null;
  loading: boolean;
  error: string | null;
  progressBytes: number;
  reload: () => void;
  search: (query: string, limit?: number) => SearchRecord[];
};

const DatasetContext = createContext<DatasetContextValue | null>(null);

export function DatasetProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressBytes, setProgressBytes] = useState(0);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setProgressBytes(0);

    loadDataset((bytes) => {
      if (!cancelled) setProgressBytes(bytes);
    })
      .then((dataset) => {
        if (!cancelled) {
          setData(dataset);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load dataset");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  const search = useCallback(
    (query: string, limit = 30) => (data ? searchIndex(query, limit) : []),
    [data]
  );

  const value = useMemo(
    () => ({ data, loading, error, progressBytes, reload, search }),
    [data, loading, error, progressBytes, reload, search]
  );

  return (
    <DatasetContext.Provider value={value}>{children}</DatasetContext.Provider>
  );
}

export function useDataset() {
  const ctx = useContext(DatasetContext);
  if (!ctx) throw new Error("useDataset must be used within DatasetProvider");
  return ctx;
}
