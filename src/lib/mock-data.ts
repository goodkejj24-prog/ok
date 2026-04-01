import { ApartmentCardData, ApartmentMaster, School } from "./types";

const now = new Date();

function createApartment(
  master: Omit<ApartmentMaster, "createdAt" | "updatedAt">,
  summary: {
    currentPrice: number;
    price3MonthsAgo: number;
    jeonsePrice: number;
    jeonseListingCount: number;
    naverInterestCount: number;
    locationScore: number;
    totalScore: number;
    rankRegion: number;
    isLandPermitZone: boolean;
    investScore2Y: number;
    investRationale: string[];
  }
): ApartmentCardData {
  const priceChange = summary.currentPrice - summary.price3MonthsAgo;
  const priceChangeRate = Math.round((priceChange / summary.price3MonthsAgo) * 1000) / 10;
  const gap = summary.currentPrice - summary.jeonsePrice;
  const jeonseRate = Math.round((summary.jeonsePrice / summary.currentPrice) * 1000) / 10;
  const investType = summary.isLandPermitZone ? "실거주(토허제지역)" as const : "갭투자 가능" as const;
  const acquisitionTax = Math.round(summary.currentPrice * 0.011);
  const brokerageFee = Math.round(summary.currentPrice * 0.004);
  const realInvestment = summary.isLandPermitZone
    ? summary.currentPrice + acquisitionTax + brokerageFee
    : gap + acquisitionTax + brokerageFee;

  return {
    master: {
      ...master,
      createdAt: now,
      updatedAt: now,
    },
    masterId: master.id,
    currentPrice: summary.currentPrice,
    price3MonthsAgo: summary.price3MonthsAgo,
    priceChange,
    priceChangeRate,
    jeonsePrice: summary.jeonsePrice,
    jeonseListingCount: summary.jeonseListingCount,
    gap,
    jeonseRate,
    naverInterestCount: summary.naverInterestCount,
    locationScore: summary.locationScore,
    totalScore: summary.totalScore,
    rankRegion: summary.rankRegion,
    isLandPermitZone: summary.isLandPermitZone,
    investType,
    acquisitionTax,
    brokerageFee,
    realInvestment,
    investScore2Y: summary.investScore2Y,
    investRationale: summary.investRationale,
  };
}

const schoolsPyeongchon: School[][] = [
  [
    { name: "귀인초", distance: "200m", type: "초" },
    { name: "평촌중", distance: "400m", type: "중" },
    { name: "평촌고", distance: "600m", type: "고" },
  ],
  [
    { name: "평촌초", distance: "200m", type: "초" },
    { name: "평촌중", distance: "350m", type: "중" },
    { name: "범계고", distance: "600m", type: "고" },
  ],
  [
    { name: "부흥초", distance: "150m", type: "초" },
    { name: "평촌중", distance: "350m", type: "중" },
    { name: "범계고", distance: "700m", type: "고" },
  ],
];

const schoolsYongin: School[][] = [
  [
    { name: "성복초", distance: "250m", type: "초" },
    { name: "수지중", distance: "450m", type: "중" },
  ],
  [
    { name: "풍덕초", distance: "250m", type: "초" },
    { name: "풍덕중", distance: "400m", type: "중" },
  ],
  [
    { name: "영덕초", distance: "200m", type: "초" },
    { name: "영덕중", distance: "350m", type: "중" },
    { name: "기흥고", distance: "500m", type: "고" },
  ],
];

const schoolsGeumcheon: School[][] = [
  [
    { name: "독산초", distance: "200m", type: "초" },
    { name: "독산중", distance: "400m", type: "중" },
  ],
  [
    { name: "시흥초", distance: "350m", type: "초" },
    { name: "시흥중", distance: "500m", type: "중" },
    { name: "금천고", distance: "700m", type: "고" },
  ],
  [
    { name: "금나래초", distance: "250m", type: "초" },
    { name: "문성중", distance: "600m", type: "중" },
  ],
];

const schoolsJungnang: School[][] = [
  [
    { name: "면목초", distance: "200m", type: "초" },
    { name: "면목중", distance: "350m", type: "중" },
    { name: "면목고", distance: "500m", type: "고" },
  ],
  [
    { name: "상봉초", distance: "300m", type: "초" },
    { name: "상봉중", distance: "450m", type: "중" },
  ],
  [
    { name: "중화초", distance: "250m", type: "초" },
    { name: "중랑중", distance: "400m", type: "중" },
    { name: "중랑고", distance: "650m", type: "고" },
  ],
];

export function getMockApartments(): ApartmentCardData[] {
  return [
    // ── 평촌 (3 apartments) ──
    createApartment(
      {
        id: "pc-001",
        name: "평촌 목련1단지",
        region: "평촌",
        address: "경기도 안양시 동안구 평촌동 897",
        totalHouseholds: 1240,
        builtYear: 1993,
        hallwayType: "복도식",
        heatingType: "지역난방",
        avgMaintenanceFee: 18,
        roomCount: 3,
        exclusiveArea: 59.9,
        nearestStation: "평촌역",
        stationWalkMin: 8,
        gangnamCommuteMin: 38,
        seoulChamberCommuteMin: 45,
        schools: schoolsPyeongchon[0],
      },
      {
        currentPrice: 43000,
        price3MonthsAgo: 41000,
        jeonsePrice: 29000,
        jeonseListingCount: 12,
        naverInterestCount: 3420,
        locationScore: 82,
        totalScore: 78,
        rankRegion: 1,
        isLandPermitZone: false,
        investScore2Y: 85,
        investRationale: ["재건축 안전진단 추진 중", "신분당선 연장 호재 (2027 개통 예정)", "평촌 스마트스퀘어 개발", "전세가율 67% 하방 지지"],
      }
    ),
    createApartment(
      {
        id: "pc-002",
        name: "평촌 한가람아파트",
        region: "평촌",
        address: "경기도 안양시 동안구 평촌동 910",
        totalHouseholds: 1320,
        builtYear: 1995,
        hallwayType: "계단식",
        heatingType: "지역난방",
        avgMaintenanceFee: 17,
        roomCount: 3,
        exclusiveArea: 59.5,
        nearestStation: "평촌역",
        stationWalkMin: 7,
        gangnamCommuteMin: 37,
        seoulChamberCommuteMin: 44,
        schools: schoolsPyeongchon[1],
      },
      {
        currentPrice: 45000,
        price3MonthsAgo: 43000,
        jeonsePrice: 30000,
        jeonseListingCount: 10,
        naverInterestCount: 2800,
        locationScore: 78,
        totalScore: 75,
        rankRegion: 2,
        isLandPermitZone: false,
        investScore2Y: 78,
        investRationale: ["평촌 학군 프리미엄 지속", "범계역 상권 확장", "전세가율 67% 안정적", "최근 3개월 상승세 +4.7%"],
      }
    ),
    createApartment(
      {
        id: "pc-003",
        name: "귀인마을 래미안",
        region: "평촌",
        address: "경기도 안양시 동안구 귀인동 320",
        totalHouseholds: 1560,
        builtYear: 2005,
        hallwayType: "계단식",
        heatingType: "지역난방",
        avgMaintenanceFee: 22,
        roomCount: 3,
        exclusiveArea: 59.98,
        nearestStation: "평촌역",
        stationWalkMin: 15,
        gangnamCommuteMin: 40,
        seoulChamberCommuteMin: 47,
        schools: schoolsPyeongchon[2],
      },
      {
        currentPrice: 52000,
        price3MonthsAgo: 50000,
        jeonsePrice: 33000,
        jeonseListingCount: 15,
        naverInterestCount: 4800,
        locationScore: 88,
        totalScore: 85,
        rankRegion: 3,
        isLandPermitZone: true,
        investScore2Y: 72,
        investRationale: ["대단지 1,560세대 프리미엄", "인덕원~동탄 복선전철 호재", "평촌 신도시 랜드마크 단지", "토허제 해제 시 추가 상승 기대"],
      }
    ),

    // ── 용인 (3 apartments) ──
    createApartment(
      {
        id: "yi-001",
        name: "수지 성복역 롯데캐슬",
        region: "용인",
        address: "경기도 용인시 수지구 성복동 782",
        totalHouseholds: 2100,
        builtYear: 2015,
        hallwayType: "계단식",
        heatingType: "지역난방",
        avgMaintenanceFee: 25,
        roomCount: 3,
        exclusiveArea: 59.97,
        nearestStation: "성복역",
        stationWalkMin: 5,
        gangnamCommuteMin: 52,
        seoulChamberCommuteMin: 55,
        schools: schoolsYongin[0],
      },
      {
        currentPrice: 42000,
        price3MonthsAgo: 40000,
        jeonsePrice: 28000,
        jeonseListingCount: 18,
        naverInterestCount: 5200,
        locationScore: 90,
        totalScore: 87,
        rankRegion: 1,
        isLandPermitZone: false,
        investScore2Y: 82,
        investRationale: ["신분당선 역세권 도보5분", "GTX-A 수서 환승 (2026 개통)", "2,100세대 대단지 수요 탄탄", "최근 3개월 +5% 상승세"],
      }
    ),
    createApartment(
      {
        id: "yi-002",
        name: "수지 풍덕천 주공",
        region: "용인",
        address: "경기도 용인시 수지구 풍덕천동 680",
        totalHouseholds: 1580,
        builtYear: 1994,
        hallwayType: "복도식",
        heatingType: "지역난방",
        avgMaintenanceFee: 14,
        roomCount: 3,
        exclusiveArea: 58.5,
        nearestStation: "수지구청역",
        stationWalkMin: 8,
        gangnamCommuteMin: 55,
        seoulChamberCommuteMin: 58,
        schools: schoolsYongin[1],
      },
      {
        currentPrice: 32000,
        price3MonthsAgo: 31000,
        jeonsePrice: 22000,
        jeonseListingCount: 12,
        naverInterestCount: 2100,
        locationScore: 70,
        totalScore: 67,
        rankRegion: 2,
        isLandPermitZone: false,
        investScore2Y: 80,
        investRationale: ["재건축 연한 도래 (1994년식)", "저평가 구간 - 수지 평균 대비 30% 저렴", "GTX-A 수혜 (수지~강남 30분대)", "전세가율 69% 갭 적어 소액 투자"],
      }
    ),
    createApartment(
      {
        id: "yi-003",
        name: "기흥 영덕 e편한세상",
        region: "용인",
        address: "경기도 용인시 기흥구 영덕동 450",
        totalHouseholds: 1200,
        builtYear: 2012,
        hallwayType: "계단식",
        heatingType: "개별난방",
        avgMaintenanceFee: 16,
        roomCount: 3,
        exclusiveArea: 59.2,
        nearestStation: "영덕역",
        stationWalkMin: 6,
        gangnamCommuteMin: 50,
        seoulChamberCommuteMin: 55,
        schools: schoolsYongin[2],
      },
      {
        currentPrice: 35000,
        price3MonthsAgo: 34000,
        jeonsePrice: 24000,
        jeonseListingCount: 8,
        naverInterestCount: 2600,
        locationScore: 74,
        totalScore: 71,
        rankRegion: 3,
        isLandPermitZone: false,
        investScore2Y: 76,
        investRationale: ["GTX-A 기흥역 환승 수혜", "영덕역 도보6분 초역세권", "2012년식 준신축 감가 적음", "기흥 테크노밸리 직주근접 수요"],
      }
    ),

    // ── 금천 (3 apartments) ──
    createApartment(
      {
        id: "gc-001",
        name: "독산동 주공아파트",
        region: "금천",
        address: "서울시 금천구 독산동 291",
        totalHouseholds: 1680,
        builtYear: 1990,
        hallwayType: "복도식",
        heatingType: "지역난방",
        avgMaintenanceFee: 15,
        roomCount: 2,
        exclusiveArea: 46.71,
        nearestStation: "독산역",
        stationWalkMin: 6,
        gangnamCommuteMin: 35,
        seoulChamberCommuteMin: 40,
        schools: schoolsGeumcheon[0],
      },
      {
        currentPrice: 26000,
        price3MonthsAgo: 25000,
        jeonsePrice: 18000,
        jeonseListingCount: 22,
        naverInterestCount: 3100,
        locationScore: 70,
        totalScore: 68,
        rankRegion: 1,
        isLandPermitZone: true,
        investScore2Y: 88,
        investRationale: ["재건축 안전진단 통과 임박", "1,680세대 대규모 재건축 사업성 우수", "독산역 도보6분 1호선 역세권", "서울 최저가 대비 상승 여력 큼"],
      }
    ),
    createApartment(
      {
        id: "gc-002",
        name: "시흥동 벽산아파트",
        region: "금천",
        address: "서울시 금천구 시흥동 985",
        totalHouseholds: 1120,
        builtYear: 1997,
        hallwayType: "계단식",
        heatingType: "중앙난방",
        avgMaintenanceFee: 19,
        roomCount: 3,
        exclusiveArea: 59.85,
        nearestStation: "시흥역",
        stationWalkMin: 9,
        gangnamCommuteMin: 38,
        seoulChamberCommuteMin: 42,
        schools: schoolsGeumcheon[1],
      },
      {
        currentPrice: 33000,
        price3MonthsAgo: 32000,
        jeonsePrice: 23000,
        jeonseListingCount: 10,
        naverInterestCount: 2650,
        locationScore: 74,
        totalScore: 71,
        rankRegion: 2,
        isLandPermitZone: true,
        investScore2Y: 79,
        investRationale: ["가산디지털단지 확장 개발", "서울 2.6억 소형 매수 기회", "7호선+1호선 더블 역세권 인접", "토허제 해제 시 갭투자 유입 기대"],
      }
    ),
    createApartment(
      {
        id: "gc-003",
        name: "금나래 대림아파트",
        region: "금천",
        address: "서울시 금천구 독산동 1015",
        totalHouseholds: 1040,
        builtYear: 2001,
        hallwayType: "계단식",
        heatingType: "개별난방",
        avgMaintenanceFee: 17,
        roomCount: 3,
        exclusiveArea: 59.52,
        nearestStation: "독산역",
        stationWalkMin: 11,
        gangnamCommuteMin: 37,
        seoulChamberCommuteMin: 38,
        schools: schoolsGeumcheon[2],
      },
      {
        currentPrice: 36000,
        price3MonthsAgo: 35000,
        jeonsePrice: 25000,
        jeonseListingCount: 7,
        naverInterestCount: 1980,
        locationScore: 66,
        totalScore: 64,
        rankRegion: 3,
        isLandPermitZone: true,
        investScore2Y: 73,
        investRationale: ["가산·독산 일대 재정비 계획", "서울 강남 30분대 가성비 지역", "IT 직주근접 수요 (가산디지털단지)", "최근 3개월 +2.9% 상승 추세"],
      }
    ),

    // ── 중랑 (3 apartments) ──
    createApartment(
      {
        id: "jn-001",
        name: "면목동 한신아파트",
        region: "중랑",
        address: "서울시 중랑구 면목동 620",
        totalHouseholds: 1450,
        builtYear: 1994,
        hallwayType: "복도식",
        heatingType: "지역난방",
        avgMaintenanceFee: 16,
        roomCount: 3,
        exclusiveArea: 59.76,
        nearestStation: "면목역",
        stationWalkMin: 7,
        gangnamCommuteMin: 48,
        seoulChamberCommuteMin: 35,
        schools: schoolsJungnang[0],
      },
      {
        currentPrice: 33000,
        price3MonthsAgo: 31000,
        jeonsePrice: 24000,
        jeonseListingCount: 14,
        naverInterestCount: 3750,
        locationScore: 76,
        totalScore: 74,
        rankRegion: 1,
        isLandPermitZone: true,
        investScore2Y: 86,
        investRationale: ["면목선 경전철 착공 (2028 개통 예정)", "면목동 재개발 구역 인접", "최근 3개월 +6.5% 급등세", "서울 3.3억 소형 - 상승 여력 큼"],
      }
    ),
    createApartment(
      {
        id: "jn-002",
        name: "상봉동 동아아파트",
        region: "중랑",
        address: "서울시 중랑구 상봉동 108",
        totalHouseholds: 1060,
        builtYear: 1996,
        hallwayType: "계단식",
        heatingType: "개별난방",
        avgMaintenanceFee: 14,
        roomCount: 3,
        exclusiveArea: 56.43,
        nearestStation: "상봉역",
        stationWalkMin: 4,
        gangnamCommuteMin: 45,
        seoulChamberCommuteMin: 32,
        schools: schoolsJungnang[1],
      },
      {
        currentPrice: 36000,
        price3MonthsAgo: 35000,
        jeonsePrice: 26000,
        jeonseListingCount: 11,
        naverInterestCount: 4100,
        locationScore: 80,
        totalScore: 77,
        rankRegion: 2,
        isLandPermitZone: true,
        investScore2Y: 84,
        investRationale: ["GTX-B 상봉역 정차 확정 (2028)", "상봉역 트리플 역세권 (경춘선+7호선+중앙선)", "망우역 환승센터 개발", "토허제 해제 시 시세 급등 예상"],
      }
    ),
    createApartment(
      {
        id: "jn-003",
        name: "중화동 건영아파트",
        region: "중랑",
        address: "서울시 중랑구 중화동 330",
        totalHouseholds: 1020,
        builtYear: 1999,
        hallwayType: "혼합",
        heatingType: "중앙난방",
        avgMaintenanceFee: 20,
        roomCount: 3,
        exclusiveArea: 59.88,
        nearestStation: "중화역",
        stationWalkMin: 6,
        gangnamCommuteMin: 53,
        seoulChamberCommuteMin: 38,
        schools: schoolsJungnang[2],
      },
      {
        currentPrice: 29000,
        price3MonthsAgo: 30000,
        jeonsePrice: 21000,
        jeonseListingCount: 5,
        naverInterestCount: 1650,
        locationScore: 65,
        totalScore: 62,
        rankRegion: 3,
        isLandPermitZone: true,
        investScore2Y: 70,
        investRationale: ["서울 2.9억 최저가 진입 기회", "중화역 역세권 정비사업 추진", "면목선 연장 시 수혜 가능", "하락 구간 저점 매수 기회 (-3.3%)"],
      }
    ),
  ];
}

export function getMockLastUpdated(): Date {
  // Simulate last update being earlier today
  const d = new Date();
  d.setHours(6, 0, 0, 0);
  return d;
}
