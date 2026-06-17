import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { month: "Jan", jobs: 2, education: 1, projects: 0, certificates: 1, technologies: 0 },
  { month: "Feb", jobs: 1, education: 0, projects: 2, certificates: 0, technologies: 1 },
  { month: "Mar", jobs: 0, education: 1, projects: 1, certificates: 2, technologies: 0 },
  { month: "Apr", jobs: 3, education: 0, projects: 0, certificates: 0, technologies: 2 },
  { month: "May", jobs: 1, education: 2, projects: 1, certificates: 1, technologies: 0 },
  { month: "Jun", jobs: 0, education: 1, projects: 2, certificates: 0, technologies: 1 },
];

interface MonthlyActivityProps {
  stats: Record<string, number>;
}

const barColors: Record<string, string> = {
  jobs: "#60a5fa",
  education: "#34d399",
  projects: "#a78bfa",
  certificates: "#fbbf24",
  technologies: "#fb7185",
};

export default function MonthlyActivity({ stats }: MonthlyActivityProps) {
  const hasContent = Object.values(stats).some((v) => v > 0);

  if (!hasContent) {
    return (
      <div className="rounded-[20px] border border-[#e5e7eb] dark:border-border bg-white dark:bg-card p-6">
        <h3 className="text-sm font-semibold mb-6">Monthly Activity</h3>
        <div className="flex items-center justify-center h-52 text-sm text-muted-foreground">
          No activity data yet
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[20px] border border-[#e5e7eb] dark:border-border bg-white dark:bg-card p-6">
      <h3 className="text-sm font-semibold mb-6">Monthly Activity</h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={2} barCategoryGap="20%">
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
            {Object.entries(stats).map(([key]) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={barColors[key] ?? "#6366f1"}
                radius={[3, 3, 0, 0]}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-out"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
