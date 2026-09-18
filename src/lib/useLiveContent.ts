import { useCallback, useEffect, useState } from "react";
import { useInitialData } from "#/lib/data-context";

interface LiveContentResult<T> {
	items: T[];
	loading: boolean;
	error: string | null;
	refresh: () => void;
}

const CACHE_TTL_MS = 5 * 60_000;

interface CacheEntry {
	data: unknown[];
	at: number;
}

const cache = new Map<string, CacheEntry>();

function isStale(collection: string): boolean {
	const entry = cache.get(collection);
	if (!entry) return true;
	return Date.now() - entry.at > CACHE_TTL_MS;
}

export function getCache<T>(collection: string): T[] | null {
	const entry = cache.get(collection);
	return entry ? (entry.data as T[]) : null;
}

export function setCache<T>(collection: string, data: T[]): void {
	cache.set(collection, { data, at: Date.now() });
}

export function clearCache(collection?: string): void {
	if (collection) {
		cache.delete(collection);
	} else {
		cache.clear();
	}
}

export function useLiveContent<T>(
	collection: string,
	ssrFallback?: T[],
): LiveContentResult<T> {
	const ssrData = useInitialData<T>(collection as any);
	const initial = ssrData.length > 0 ? ssrData : (ssrFallback ?? []);

	const [items, setItems] = useState<T[]>(() => {
		const cached = cache.get(collection);
		if (cached) return cached.data as T[];
		return initial;
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(
		async (silent = false) => {
			if (!silent) {
				setLoading(true);
				setError(null);
			}
			try {
				const res = await fetch("/api/public", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ collection }),
				});
				const data = await res.json();
				if (data.error) throw new Error(data.error);
				const fetched = (data.items ?? []) as T[];
				cache.set(collection, { data: fetched, at: Date.now() });
				setItems(fetched);
			} catch (err) {
				if (!silent) {
					setError(err instanceof Error ? err.message : "Failed to load data");
				}
			} finally {
				if (!silent) setLoading(false);
			}
		},
		[collection],
	);

	useEffect(() => {
		if (items.length === 0) {
			fetchData();
			return;
		}
		if (isStale(collection)) fetchData(true);
	}, [items.length, fetchData, collection]);

	return { items, loading, error, refresh: () => fetchData() };
}
