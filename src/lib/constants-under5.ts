import type { Region, SortOption } from "./types";

export const REGIONS: { value: Region; label: string }[] = [
  { value: "금천·관악", label: "금천·관악" },
  { value: "중랑·노원", label: "중랑·노원" },
  { value: "평촌", label: "평촌" },
  { value: "용인", label: "용인" },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "rankRegion", label: "종합랭킹순" },
  { value: "naverInterestCount", label: "선호도순" },
  { value: "realInvestment", label: "실투자금순" },
  { value: "currentPrice", label: "매매가순" },
  { value: "jeonseRate", label: "전세가율순" },
  { value: "gap", label: "갭순" },
];
