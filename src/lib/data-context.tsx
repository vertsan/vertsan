import { createContext, useContext } from "react";

export interface InitialData {
	projects: unknown[];
	jobs: unknown[];
	education: unknown[];
	certificates: unknown[];
	technologies: unknown[];
}

const DataContext = createContext<InitialData | null>(null);

export function DataProvider({
	data,
	children,
}: {
	data: InitialData;
	children: React.ReactNode;
}) {
	return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}

export function useInitialData<T>(collection: keyof InitialData): T[] {
	const ctx = useContext(DataContext);
	return (ctx?.[collection] ?? []) as T[];
}
