"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";

const AVAILABLE_BADGES = [
  { id: "new", label: "New Arrival", color: "bg-blue-500" },
  { id: "bestseller", label: "Best Seller", color: "bg-yellow-500 text-black" },
  { id: "trending", label: "Trending", color: "bg-purple-500" },
  { id: "sale", label: "On Sale", color: "bg-red-500" },
];

export function BadgeSelector({ value, onChange }: { value: string[], onChange: (v: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>(value || []);

  useEffect(() => {
    onChange(selected);
  }, [selected, onChange]);

  const toggleBadge = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(b => b !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {AVAILABLE_BADGES.map((badge) => {
        const isActive = selected.includes(badge.id);
        return (
          <div 
            key={badge.id}
            onClick={() => toggleBadge(badge.id)}
            className={`
              cursor-pointer px-3 py-1 rounded-full text-xs font-bold border transition-all flex items-center gap-2
              ${isActive ? badge.color + " border-transparent" : "bg-secondary border-border text-muted-foreground hover:border-primary/50"}
            `}
          >
            {isActive && <Check className="w-3 h-3" />}
            {badge.label}
          </div>
        );
      })}
    </div>
  );
}