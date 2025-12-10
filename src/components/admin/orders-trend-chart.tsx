// src/components/admin/orders-trend-chart.tsx
/*  * Orders Trend Chart Component
 * This component visualizes
 * the trend of WhatsApp orders
 * over the past 30 days
 * in the admin dashboard
 * using a line chart.
 */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export function OrdersTrendChart({ data }: { data: any[] }) {
  return (
    <Card className="bg-[#111] border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-sm font-medium">
          WhatsApp Orders Trend (30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#000",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#fff" }}
                cursor={{ stroke: "#333", strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#E6B800"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "#E6B800" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
