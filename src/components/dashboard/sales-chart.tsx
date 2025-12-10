// src/components/dashboard/sales-chart.tsx
/*  * Sales Chart Component
 * This component renders a sales trend area chart
 * for the dashboard, visualizing revenue data over
 * the last 30 days using the Recharts library.
 */
"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SalesChart({ data }: { data: any[] }) {
  return (
    <Card className="bg-card border-border/50 h-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          Sales Trend (Last 30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E6B800" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E6B800" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(128,128,128,0.1)"
              />
              <XAxis
                dataKey="date"
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />
              <YAxis
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#000",
                  borderRadius: "8px",
                  border: "1px solid #333",
                }}
                itemStyle={{ color: "#fff" }}
                formatter={(value: number) => [`₹${value}`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#E6B800"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
