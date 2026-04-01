"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS } from "@/lib/constants-seoul";
import type { SortOption } from "@/lib/types";

interface SortSelectorProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function SortSelector({ sortBy, onSortChange }: SortSelectorProps) {
  return (
    <Select
      value={sortBy}
      onValueChange={(value) => onSortChange(value as SortOption)}
    >
      <SelectTrigger className="min-w-[140px]">
        <SelectValue placeholder="정렬 기준" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
