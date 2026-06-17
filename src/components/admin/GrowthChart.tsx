import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { month: "Jan", value: 4 },
  { month: "Feb", value: 7 },
  { month: "Mar", value: 5 },
  { month: "Apr", value: 9 },
  { month: "May", value: 11 },
  { month: "Jun", value: 8 },
  { month: "Jul", value: 13 },
  { month: "Aug", value: 16 },
  { month: "Sep", value: 14 },
  { month: "Oct", value: 18 },
  { month: "Nov", value: 21 },
  { month: "Dec", value: 24 },
];

interface GrowthChartProps {
  total: number;
}

export default function GrowthChart({ total }: GrowthChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    value: Math.max(1, Math.round((d.value / 24) * Math.max(total, 1))),
  }));

  return (
    <div className="rounded-[20px] border border-[#e5e7eb] dark:border-border bg-white dark:bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold">Content Growth</h3>
        <span className="text-[11px] text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">
          +{total > 0 ? Math.min(Math.round((total / 5) * 100), 100) : 0}% this year
        </span>
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} dy={8} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} dx={-4} />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                padding: "8px 14px",
                fontSize: "13px",
                fontFamily: "Geist, Inter, system-ui, sans-serif",
              }}
            />
            <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#growthGrad)" dot={false} isAnimationActive={true} animationDuration={1200} animationEasing="ease-out" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
