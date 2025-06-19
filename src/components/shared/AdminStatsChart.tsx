"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AdminStatsChartProps {
  data: {
    name: string;
    count: number;
    fill: string;
  }[];
}

export default function AdminStatsChart({ data }: AdminStatsChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" fontSize={12} stroke="hsl(var(--muted-foreground))" />
          <YAxis
            dataKey="name"
            type="category"
            fontSize={12}
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: string) => value.substring(0, 10)}
          />
          <Tooltip />
          <Bar dataKey="count" radius={[0, 5, 5, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
