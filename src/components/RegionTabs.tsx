"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Region } from "@/lib/types";

interface RegionTabsProps {
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
  regions?: { value: Region; label: string }[];
}

export function RegionTabs({ selectedRegion, onRegionChange, regions }: RegionTabsProps) {
  const items = regions ?? [];
  return (
    <Tabs
      value={selectedRegion}
      onValueChange={(value) => onRegionChange(value as Region)}
    >
      <TabsList className="w-full sm:w-auto">
        {items.map((region) => (
          <TabsTrigger key={region.value} value={region.value}>
            {region.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
