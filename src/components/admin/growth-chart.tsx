// src/components/admin/growth-chart.tsx
/*  * Growth Chart Component
 * This component displays
 * a growth chart of new shops
 * joined over the last
 * six months in the admin dashboard.
 */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function GrowthChart({ data }: { data: any[] }) {
  return (
    <Card className="bg-[#111] border-white/10 text-white col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Platform Growth</CardTitle>
        <p className="text-sm text-gray-400">
          New shops joined over the last 6 months
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorShops" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E6B800" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E6B800" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="name"
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#000",
                  borderRadius: "8px",
                  border: "1px solid #333",
                  color: "#fff",
                }}
                itemStyle={{ color: "#E6B800" }}
              />
              <Area
                type="monotone"
                dataKey="shops"
                stroke="#E6B800"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorShops)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
