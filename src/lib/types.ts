export interface School {
  name: string;
  distance: string;
  type: "초" | "중" | "고";
}

export interface ApartmentMaster {
  id: string;
  name: string;
  region: Region;
  address: string;
  totalHouseholds: number;
  builtYear: number;
  hallwayType: "복도식" | "계단식" | "혼합";
  heatingType: "개별난방" | "중앙난방" | "지역난방";
  avgMaintenanceFee: number;
  roomCount: number;
  exclusiveArea: number;
  nearestStation: string;
  stationWalkMin: number;
  gangnamCommuteMin: number; // 강남역까지 대중교통 소요시간 (분)
  seoulChamberCommuteMin: number; // 서울상공회의소까지 대중교통 소요시간 (분)
  schools: School[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApartmentSummary {
  masterId: string;
  currentPrice: number;
  price3MonthsAgo: number;
  priceChange: number;
  priceChangeRate: number;
  jeonsePrice: number;
  jeonseListingCount: number;
  gap: number;
  jeonseRate: number;
  naverInterestCount: number;
  locationScore: number;
  totalScore: number;
  rankRegion: number;
  isLandPermitZone: boolean;
  investType: "갭투자 가능" | "실거주(토허제지역)";
  acquisitionTax: number;
  brokerageFee: number;
  realInvestment: number;
  investScore2Y: number;        // 2년 투자 적합도 (0~100)
  investRationale: string[];    // 상승 근거 목록
}

export interface DailySummary {
  date: string;
  updatedAt: Date;
  apartments: ApartmentSummary[];
}

export interface ApartmentCardData extends ApartmentSummary {
  master: ApartmentMaster;
}

export type Region = "평촌" | "용인" | "금천" | "중랑" | "강남·서초" | "동작·관악" | "용산·성동" | "송파·강동" | "금천·관악" | "중랑·노원";

export type SortOption = "rankRegion" | "naverInterestCount" | "realInvestment" | "currentPrice" | "jeonseRate" | "gap";
