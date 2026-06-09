import { useCallback, useEffect, useState } from "react";

interface LiveContentResult<T> {
	items: T[];
	loading: boolean;
	error: string | null;
	refresh: () => void;
}

const cache = new Map<string, unknown[]>();

export function useLiveContent<T>(
	collection: string,
	initialData: T[],
): LiveContentResult<T> {
	const [items, setItems] = useState<T[]>(() => {
		if (cache.has(collection)) return cache.get(collection) as T[];
		return initialData;
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/public", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ collection }),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);
			const fetched = (data.items ?? []) as T[];
			cache.set(collection, fetched);
			setItems(fetched);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load data");
		} finally {
			setLoading(false);
		}
	}, [collection]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { items, loading, error, refresh: fetchData };
}
