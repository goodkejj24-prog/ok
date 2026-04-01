import { Region, SortOption } from "./types";

export const REGIONS: { value: Region; label: string }[] = [
  { value: "강남·서초", label: "강남·서초" },
  { value: "동작·관악", label: "동작·관악" },
  { value: "용산·성동", label: "용산·성동" },
  { value: "송파·강동", label: "송파·강동" },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "rankRegion", label: "종합랭킹순" },
  { value: "naverInterestCount", label: "선호도순" },
  { value: "realInvestment", label: "실투자금순" },
  { value: "currentPrice", label: "매매가순" },
  { value: "jeonseRate", label: "전세가율순" },
  { value: "gap", label: "갭순" },
];

export const REGION_CODES: Record<string, string> = {
  "강남·서초": "1168000000",
  "동작·관악": "1159000000",
  "용산·성동": "1104000000",
  "송파·강동": "1171000000",
};

export const ACQUISITION_TAX_RATE = 0.011;
export const BROKERAGE_FEE_RATE = 0.004;
