"use client";

import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OrdersTrendChart({ data }: { data: any[] }) {
  return (
    <Card className="bg-[#111] border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-sm font-medium">WhatsApp Orders Trend (30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" hide />
              <Tooltip 
                contentStyle={{ backgroundColor: "#000", border: "1px solid #333", borderRadius: "8px" }}
                itemStyle={{ color: "#fff" }}
                cursor={{ stroke: '#333', strokeWidth: 1 }}
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