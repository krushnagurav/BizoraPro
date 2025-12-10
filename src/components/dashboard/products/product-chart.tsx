// src/components/dashboard/products/product-chart.tsx
/*  * Product Chart Component
 * This component visualizes product
 * performance metrics such as page
 * views and orders using a line chart.
 */
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function ProductChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis
          dataKey="date"
          stroke="#888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#000",
            border: "1px solid #333",
            borderRadius: "8px",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="views"
          stroke="#3B82F6"
          strokeWidth={2}
          name="Page Views"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#10B981"
          strokeWidth={2}
          name="Orders"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
