import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ChartDataItem {
	name: string;
	value: number;
	color: string;
}

interface AnalyticsChartProps {
	data: ChartDataItem[];
	total: number;
}

export default function AnalyticsChart({ data, total }: AnalyticsChartProps) {
	const filteredData = data.filter((d) => d.value > 0);

	if (filteredData.length === 0) {
		return (
			<div className="rounded-[20px] border border-[#e5e7eb] dark:border-border bg-white dark:bg-card p-6 animate-card-enter">
				<h3 className="text-sm font-semibold mb-6">Content Distribution</h3>
				<div className="flex items-center justify-center h-52 text-sm text-muted-foreground">
					No content data yet
				</div>
			</div>
		);
	}

	return (
		<div className="rounded-[20px] border border-[#e5e7eb] dark:border-border bg-white dark:bg-card p-6 animate-card-enter" style={{ animationDelay: "400ms" }}>
			<h3 className="text-sm font-semibold mb-6">Content Distribution</h3>

			<div className="flex flex-col items-center">
				{/* Donut chart */}
				<div className="relative w-52 h-52">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={filteredData}
								cx="50%"
								cy="50%"
								innerRadius={60}
								outerRadius={90}
								paddingAngle={3}
								dataKey="value"
								strokeWidth={0}
								animationBegin={200}
								animationDuration={1000}
								animationEasing="ease-out"
							>
								{filteredData.map((entry) => (
									<Cell
										key={entry.name}
										fill={entry.color}
									/>
								))}
							</Pie>
							<Tooltip
								contentStyle={{
									borderRadius: "12px",
									border: "1px solid #e5e7eb",
									boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
									padding: "8px 14px",
									fontSize: "13px",
									fontFamily: "Inter, system-ui, sans-serif",
								}}
								itemStyle={{ color: "inherit" }}
							/>
						</PieChart>
					</ResponsiveContainer>

					{/* Center label */}
					<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
						<span className="text-3xl font-bold tracking-tight">
							{total}
						</span>
						<span className="text-xs text-muted-foreground">
							Total
						</span>
					</div>
				</div>

				{/* Legend */}
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 mt-6 w-full">
					{filteredData.map((item) => (
						<div key={item.name} className="flex items-center gap-2">
							<span
								className="size-2.5 rounded-full shrink-0"
								style={{ backgroundColor: item.color }}
							/>
							<span className="text-xs text-muted-foreground truncate">
								{item.name}
							</span>
							<span className="text-xs font-semibold tabular-nums ml-auto">
								{item.value}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
