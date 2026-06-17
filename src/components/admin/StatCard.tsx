import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
	Area,
	AreaChart,
	ResponsiveContainer,
} from "recharts";

interface StatCardProps {
	title: string;
	count: number;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	color: {
		bg: string;
		iconBg: string;
		iconColor: string;
		sparkline: string;
		sparklineFill: string;
	};
	to: string;
	sparklineData: number[];
	index?: number;
}

export default function StatCard({
	title,
	count,
	description,
	icon: Icon,
	color,
	to,
	sparklineData,
	index = 0,
}: StatCardProps) {
	const chartData = sparklineData.map((value, i) => ({ value, index: i }));

	return (
		<Link
			to={to}
			className="group relative flex flex-col rounded-[20px] border border-[#e5e7eb] bg-white dark:bg-card dark:border-border overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] animate-card-enter"
			style={{ animationDelay: `${index * 80}ms` }}
		>
			<div className="p-5 pb-3 flex-1">
				<div className="flex items-start justify-between mb-4">
					<div
						className={`size-11 rounded-2xl ${color.iconBg} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}
					>
						<Icon className={`size-5 ${color.iconColor}`} />
					</div>
					<span className="text-3xl font-bold tabular-nums tracking-tight">
						{count}
					</span>
				</div>

				<h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
					{title}
				</h3>
				<p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
					{description}
				</p>
			</div>

			{/* Sparkline */}
			<div className="h-10 w-full mt-auto">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						data={chartData}
						margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
					>
						<defs>
							<linearGradient
								id={`sparkGrad-${title}`}
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop
									offset="0%"
									stopColor={color.sparkline}
									stopOpacity={0.3}
								/>
								<stop
									offset="100%"
									stopColor={color.sparkline}
									stopOpacity={0.02}
								/>
							</linearGradient>
						</defs>
						<Area
							type="monotone"
							dataKey="value"
							stroke={color.sparkline}
							strokeWidth={1.5}
							fill={`url(#sparkGrad-${title})`}
							dot={false}
							isAnimationActive={true}
							animationDuration={1200}
							animationEasing="ease-out"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>

			{/* CTA */}
			<div className="px-5 py-3 border-t border-[#e5e7eb] dark:border-border flex items-center justify-between">
				<span className="text-xs text-muted-foreground group-hover:text-primary/70 transition-colors duration-200">
					Manage {title.toLowerCase()}
				</span>
				<ArrowRight className="size-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
			</div>
		</Link>
	);
}
