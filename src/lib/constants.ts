import { Region, SortOption } from "./types";

export const REGIONS: { value: Region; label: string }[] = [
  { value: "평촌", label: "평촌" },
  { value: "용인", label: "용인" },
  { value: "금천", label: "금천" },
  { value: "중랑", label: "중랑구" },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "rankRegion", label: "종합랭킹순" },
  { value: "naverInterestCount", label: "선호도순" },
  { value: "realInvestment", label: "실투자금순" },
  { value: "currentPrice", label: "매매가순" },
  { value: "jeonseRate", label: "전세가율순" },
  { value: "gap", label: "갭순" },
];

export const REGION_CODES: Partial<Record<Region, string>> = {
  "평촌": "4117100000",
  "용인": "4146300000",
  "금천": "1154500000",
  "중랑": "1126000000",
};

export const ACQUISITION_TAX_RATE = 0.011;
export const BROKERAGE_FEE_RATE = 0.004;
