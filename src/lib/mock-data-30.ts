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
    investScore2Y?: number;
    investRationale?: string[];
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
    investScore2Y: summary.investScore2Y ?? 0,
    investRationale: summary.investRationale ?? [],
  };
}

// ── Schools ──

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
  // 래미안에코팰리스
  [
    { name: "평촌초", distance: "300m", type: "초" },
    { name: "범계중", distance: "500m", type: "중" },
    { name: "평촌고", distance: "800m", type: "고" },
  ],
  // 평촌 꿈마을 금호아파트
  [
    { name: "범계초", distance: "200m", type: "초" },
    { name: "범계중", distance: "400m", type: "중" },
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
  // 수지 동천자이
  [
    { name: "동천초", distance: "200m", type: "초" },
    { name: "동천중", distance: "350m", type: "중" },
  ],
  // 기흥 동백 센트럴자이
  [
    { name: "동백초", distance: "150m", type: "초" },
    { name: "동백중", distance: "300m", type: "중" },
    { name: "동백고", distance: "600m", type: "고" },
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
  // 독산 롯데캐슬
  [
    { name: "독산초", distance: "300m", type: "초" },
    { name: "문성중", distance: "450m", type: "중" },
  ],
  // 가산 두산위브
  [
    { name: "가산초", distance: "200m", type: "초" },
    { name: "금천중", distance: "500m", type: "중" },
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
  // 면목 한양수자인
  [
    { name: "면목초", distance: "150m", type: "초" },
    { name: "면목중", distance: "300m", type: "중" },
  ],
  // 상봉 프레미어스엠코
  [
    { name: "상봉초", distance: "200m", type: "초" },
    { name: "상봉중", distance: "350m", type: "중" },
    { name: "중랑고", distance: "500m", type: "고" },
  ],
];

export function getMock30Apartments(): ApartmentCardData[] {
  return [
    // ══════════════════════════════════════════
    // ── 평촌 (5 apartments) ──
    // rankRegion by totalScore desc: 귀인마을래미안 85, 래미안에코팰리스 83, 목련 78, 한가람 75, 꿈마을금호 70
    // ══════════════════════════════════════════
    createApartment(
      {
        id: "pc-001",
        name: "목련아파트",
        region: "평촌",
        address: "경기도 안양시 동안구 평촌동 897",
        totalHouseholds: 1240,
        builtYear: 1993,
        hallwayType: "복도식",
        heatingType: "지역난방",
        avgMaintenanceFee: 18,
        roomCount: 3,
        exclusiveArea: 59.94,
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
        rankRegion: 3,
        isLandPermitZone: false,
        investScore2Y: 85,
        investRationale: ["재건축 안전진단 추진 중", "신분당선 연장 호재", "평촌 스마트스퀘어 개발", "전세가율 67% 하방 지지"],
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
        rankRegion: 4,
        isLandPermitZone: false,
        investScore2Y: 78,
        investRationale: ["평촌 학군 프리미엄 지속", "범계역 상권 확장", "전세가율 67% 안정적", "최근 3개월 상승세"],
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
        rankRegion: 1,
        isLandPermitZone: true,
        investScore2Y: 72,
        investRationale: ["대단지 1,560세대 프리미엄", "인덕원~동탄 복선전철 호재", "평촌 랜드마크 단지", "토허제 해제 시 추가 상승"],
      }
    ),
    // 평촌 래미안에코팰리스 (NEW - 84.9㎡)
    // priceChange: 74000-72000=2000, priceChangeRate: (2000/72000)*100=2.8
    // gap: 74000-47000=27000, jeonseRate: (47000/74000)*100=63.5
    // acquisitionTax: round(74000*0.011)=814, brokerageFee: round(74000*0.004)=296
    // realInvestment(갭): 27000+814+296=28110
    createApartment(
      {
        id: "pc-004",
        name: "평촌 래미안에코팰리스",
        region: "평촌",
        address: "경기도 안양시 동안구 평촌동 680",
        totalHouseholds: 1280,
        builtYear: 2009,
        hallwayType: "계단식",
        heatingType: "지역난방",
        avgMaintenanceFee: 24,
        roomCount: 4,
        exclusiveArea: 84.9,
        nearestStation: "평촌역",
        stationWalkMin: 10,
        gangnamCommuteMin: 39,
        seoulChamberCommuteMin: 46,
        schools: schoolsPyeongchon[3],
      },
      {
        currentPrice: 74000,
        price3MonthsAgo: 72000,
        jeonsePrice: 47000,
        jeonseListingCount: 20,
        naverInterestCount: 5200,
        locationScore: 86,
        totalScore: 83,
        rankRegion: 2,
        isLandPermitZone: false,
        investScore2Y: 80,
        investRationale: ["신분당선 연장 직접 수혜", "평촌 대단지 1,280세대", "학군 프리미엄 지속", "30평대 실수요 탄탄"],
      }
    ),
    // 평촌 꿈마을 금호아파트 (NEW - 84.7㎡)
    // priceChange: 56000-55000=1000, priceChangeRate: (1000/55000)*100=1.8
    // gap: 56000-37000=19000, jeonseRate: (37000/56000)*100=66.1
    // acquisitionTax: round(56000*0.011)=616, brokerageFee: round(56000*0.004)=224
    // realInvestment(갭): 19000+616+224=19840
    createApartment(
      {
        id: "pc-005",
        name: "평촌 꿈마을 금호아파트",
        region: "평촌",
        address: "경기도 안양시 동안구 범계동 520",
        totalHouseholds: 1100,
        builtYear: 1996,
        hallwayType: "계단식",
        heatingType: "지역난방",
        avgMaintenanceFee: 21,
        roomCount: 4,
        exclusiveArea: 84.7,
        nearestStation: "범계역",
        stationWalkMin: 10,
        gangnamCommuteMin: 43,
        seoulChamberCommuteMin: 48,
        schools: schoolsPyeongchon[4],
      },
      {
        currentPrice: 56000,
        price3MonthsAgo: 55000,
        jeonsePrice: 37000,
        jeonseListingCount: 11,
        naverInterestCount: 2500,
        locationScore: 73,
        totalScore: 70,
        rankRegion: 5,
        isLandPermitZone: false,
        investScore2Y: 74,
        investRationale: ["범계역 상권 확장 수혜", "1,100세대 대단지", "평촌 학군 배후 수요", "구축 리모델링 기대"],
      }
    ),

    // ══════════════════════════════════════════
    // ── 용인 (5 apartments) ──
    // rankRegion by totalScore desc: 성복역롯데캐슬 87, 동천자이 82, 동백센트럴자이 75, 기흥영덕e편한세상 71, 풍덕천주공 67
    // sorted: 87, 82, 75, 71, 67 => ranks 1,2,3,4,5
    // ══════════════════════════════════════════
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
        investRationale: ["신분당선 역세권 도보5분", "GTX-A 수서 환승", "2,100세대 대단지", "최근 3개월 +5% 상승세"],
      }
    ),
    createApartment(
      {
        id: "yi-002",
        name: "수지 풍덕천 주공아파트",
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
        rankRegion: 5,
        isLandPermitZone: false,
        investScore2Y: 80,
        investRationale: ["재건축 연한 도래", "저평가 구간", "GTX-A 수혜", "전세가율 69% 소액 투자"],
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
        rankRegion: 4,
        isLandPermitZone: false,
        investScore2Y: 76,
        investRationale: ["GTX-A 기흥역 환승", "영덕역 초역세권", "2012년 준신축", "기흥 테크노밸리 직주근접"],
      }
    ),
    // 수지 동천자이 (NEW - 84.7㎡)
    // priceChange: 67000-65000=2000, priceChangeRate: (2000/65000)*100=3.1
    // gap: 67000-42000=25000, jeonseRate: (42000/67000)*100=62.7
    // acquisitionTax: round(67000*0.011)=737, brokerageFee: round(67000*0.004)=268
    // realInvestment(갭): 25000+737+268=26005
    createApartment(
      {
        id: "yi-004",
        name: "수지 동천자이",
        region: "용인",
        address: "경기도 용인시 수지구 동천동 550",
        totalHouseholds: 1850,
        builtYear: 2008,
        hallwayType: "계단식",
        heatingType: "지역난방",
        avgMaintenanceFee: 23,
        roomCount: 4,
        exclusiveArea: 84.7,
        nearestStation: "동천역",
        stationWalkMin: 7,
        gangnamCommuteMin: 48,
        seoulChamberCommuteMin: 50,
        schools: schoolsYongin[3],
      },
      {
        currentPrice: 67000,
        price3MonthsAgo: 65000,
        jeonsePrice: 42000,
        jeonseListingCount: 22,
        naverInterestCount: 4800,
        locationScore: 85,
        totalScore: 82,
        rankRegion: 2,
        isLandPermitZone: false,
        investScore2Y: 83,
        investRationale: ["신분당선 동천역 도보7분", "1,850세대 대단지 프리미엄", "GTX-A 수서 환승 수혜", "강남 48분 접근성"],
      }
    ),
    // 기흥 동백 센트럴자이 (NEW - 84.5㎡)
    // priceChange: 60000-58000=2000, priceChangeRate: (2000/58000)*100=3.4
    // gap: 60000-39000=21000, jeonseRate: (39000/60000)*100=65.0
    // acquisitionTax: round(60000*0.011)=660, brokerageFee: round(60000*0.004)=240
    // realInvestment(갭): 21000+660+240=21900
    createApartment(
      {
        id: "yi-005",
        name: "기흥 동백 센트럴자이",
        region: "용인",
        address: "경기도 용인시 기흥구 동백동 830",
        totalHouseholds: 2400,
        builtYear: 2020,
        hallwayType: "계단식",
        heatingType: "개별난방",
        avgMaintenanceFee: 21,
        roomCount: 3,
        exclusiveArea: 84.5,
        nearestStation: "동백역",
        stationWalkMin: 5,
        gangnamCommuteMin: 55,
        seoulChamberCommuteMin: 57,
        schools: schoolsYongin[4],
      },
      {
        currentPrice: 60000,
        price3MonthsAgo: 58000,
        jeonsePrice: 39000,
        jeonseListingCount: 16,
        naverInterestCount: 4200,
        locationScore: 80,
        totalScore: 75,
        rankRegion: 3,
        isLandPermitZone: false,
        investScore2Y: 81,
        investRationale: ["2020년 신축 감가 최소", "동백역 도보5분 초역세권", "2,400세대 메가단지", "기흥 테크노밸리 수요"],
      }
    ),

    // ══════════════════════════════════════════
    // ── 금천 (5 apartments) ──
    // rankRegion by totalScore desc: 시흥동벽산 71, 독산롯데캐슬 72, 독산동주공 68, 금나래대림 64, 가산두산위브 63
    // sorted: 72, 71, 68, 64, 63 => ranks 1,2,3,4,5
    // ══════════════════════════════════════════
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
        rankRegion: 3,
        isLandPermitZone: true,
        investScore2Y: 88,
        investRationale: ["재건축 안전진단 통과 임박", "1,680세대 대규모 재건축", "독산역 1호선 역세권", "서울 최저가 상승 여력"],
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
        investRationale: ["가산디지털단지 확장 개발", "서울 소형 매수 기회", "더블 역세권 인접", "토허제 해제 시 급등 기대"],
      }
    ),
    createApartment(
      {
        id: "gc-003",
        name: "금나래 대림아파트",
        region: "금천",
        address: "서울시 금천구 독산동 1015",
        totalHouseholds: 640,
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
        rankRegion: 4,
        isLandPermitZone: true,
        investScore2Y: 73,
        investRationale: ["가산·독산 재정비 계획", "강남 30분대 가성비", "IT 직주근접 수요", "최근 3개월 상승 추세"],
      }
    ),
    // 독산 롯데캐슬 (NEW - 84.8㎡)
    // priceChange: 57000-55000=2000, priceChangeRate: (2000/55000)*100=3.6
    // gap: 57000-36000=21000, jeonseRate: (36000/57000)*100=63.2
    // acquisitionTax: round(57000*0.011)=627, brokerageFee: round(57000*0.004)=228
    // realInvestment(토허제): 57000+627+228=57855
    createApartment(
      {
        id: "gc-004",
        name: "독산 롯데캐슬",
        region: "금천",
        address: "서울시 금천구 독산동 450",
        totalHouseholds: 890,
        builtYear: 2006,
        hallwayType: "계단식",
        heatingType: "개별난방",
        avgMaintenanceFee: 18,
        roomCount: 3,
        exclusiveArea: 84.8,
        nearestStation: "독산역",
        stationWalkMin: 7,
        gangnamCommuteMin: 33,
        seoulChamberCommuteMin: 38,
        schools: schoolsGeumcheon[3],
      },
      {
        currentPrice: 57000,
        price3MonthsAgo: 55000,
        jeonsePrice: 36000,
        jeonseListingCount: 8,
        naverInterestCount: 3500,
        locationScore: 76,
        totalScore: 72,
        rankRegion: 1,
        isLandPermitZone: true,
        investScore2Y: 77,
        investRationale: ["독산역 역세권 + 2006년식", "가산디지털단지 수혜", "토허제 해제 시 갭투자 유입", "30평 실수요 탄탄"],
      }
    ),
    // 가산 두산위브 (NEW - 84.3㎡)
    // priceChange: 50000-51000=-1000, priceChangeRate: (-1000/51000)*100=-2.0
    // gap: 50000-33000=17000, jeonseRate: (33000/50000)*100=66.0
    // acquisitionTax: round(50000*0.011)=550, brokerageFee: round(50000*0.004)=200
    // realInvestment(토허제): 50000+550+200=50750
    createApartment(
      {
        id: "gc-005",
        name: "가산 두산위브",
        region: "금천",
        address: "서울시 금천구 가산동 371",
        totalHouseholds: 750,
        builtYear: 2010,
        hallwayType: "계단식",
        heatingType: "개별난방",
        avgMaintenanceFee: 16,
        roomCount: 3,
        exclusiveArea: 84.3,
        nearestStation: "가산디지털단지역",
        stationWalkMin: 10,
        gangnamCommuteMin: 30,
        seoulChamberCommuteMin: 35,
        schools: schoolsGeumcheon[4],
      },
      {
        currentPrice: 50000,
        price3MonthsAgo: 51000,
        jeonsePrice: 33000,
        jeonseListingCount: 6,
        naverInterestCount: 2200,
        locationScore: 68,
        totalScore: 63,
        rankRegion: 5,
        isLandPermitZone: true,
        investScore2Y: 75,
        investRationale: ["가산디지털단지역 도보10분", "IT직주근접 수요 증가", "강남 30분 접근성", "서울 5억대 30평 희소"],
      }
    ),

    // ══════════════════════════════════════════
    // ── 중랑 (5 apartments) ──
    // rankRegion by totalScore desc: 상봉프레미어스엠코 80, 상봉동동아 77, 면목한양수자인 76, 면목동한신 74, 중화동건영 62
    // sorted: 80, 77, 76, 74, 62 => ranks 1,2,3,4,5
    // ══════════════════════════════════════════
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
        rankRegion: 4,
        isLandPermitZone: true,
        investScore2Y: 86,
        investRationale: ["면목선 경전철 착공", "면목동 재개발 인접", "최근 3개월 +6.5% 급등", "서울 3.3억 소형 상승 여력"],
      }
    ),
    createApartment(
      {
        id: "jn-002",
        name: "상봉동 동아아파트",
        region: "중랑",
        address: "서울시 중랑구 상봉동 108",
        totalHouseholds: 1080,
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
        investRationale: ["GTX-B 상봉역 정차 확정", "트리플 역세권", "망우역 환승센터", "토허제 해제 시 급등"],
      }
    ),
    createApartment(
      {
        id: "jn-003",
        name: "중화동 건영아파트",
        region: "중랑",
        address: "서울시 중랑구 중화동 330",
        totalHouseholds: 920,
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
        rankRegion: 5,
        isLandPermitZone: true,
        investScore2Y: 70,
        investRationale: ["서울 2.9억 최저가 진입", "중화역 정비사업", "면목선 연장 수혜", "저점 매수 기회"],
      }
    ),
    // 면목 한양수자인 (NEW - 84.6㎡)
    // priceChange: 64000-62000=2000, priceChangeRate: (2000/62000)*100=3.2
    // gap: 64000-43000=21000, jeonseRate: (43000/64000)*100=67.2
    // acquisitionTax: round(64000*0.011)=704, brokerageFee: round(64000*0.004)=256
    // realInvestment(토허제): 64000+704+256=64960
    createApartment(
      {
        id: "jn-004",
        name: "면목 한양수자인",
        region: "중랑",
        address: "서울시 중랑구 면목동 780",
        totalHouseholds: 680,
        builtYear: 2019,
        hallwayType: "계단식",
        heatingType: "개별난방",
        avgMaintenanceFee: 18,
        roomCount: 3,
        exclusiveArea: 84.6,
        nearestStation: "면목역",
        stationWalkMin: 5,
        gangnamCommuteMin: 43,
        seoulChamberCommuteMin: 33,
        schools: schoolsJungnang[3],
      },
      {
        currentPrice: 64000,
        price3MonthsAgo: 62000,
        jeonsePrice: 43000,
        jeonseListingCount: 12,
        naverInterestCount: 4500,
        locationScore: 82,
        totalScore: 76,
        rankRegion: 3,
        isLandPermitZone: true,
        investScore2Y: 82,
        investRationale: ["2019년 준신축 프리미엄", "면목역 도보5분", "면목선 직접 수혜", "면목동 재개발 배후수요"],
      }
    ),
    // 상봉 프레미어스엠코 (NEW - 84.9㎡)
    // priceChange: 70000-68000=2000, priceChangeRate: (2000/68000)*100=2.9
    // gap: 70000-46000=24000, jeonseRate: (46000/70000)*100=65.7
    // acquisitionTax: round(70000*0.011)=770, brokerageFee: round(70000*0.004)=280
    // realInvestment(토허제): 70000+770+280=71050
    createApartment(
      {
        id: "jn-005",
        name: "상봉 프레미어스엠코",
        region: "중랑",
        address: "서울시 중랑구 상봉동 250",
        totalHouseholds: 520,
        builtYear: 2017,
        hallwayType: "계단식",
        heatingType: "개별난방",
        avgMaintenanceFee: 19,
        roomCount: 4,
        exclusiveArea: 84.9,
        nearestStation: "상봉역",
        stationWalkMin: 3,
        gangnamCommuteMin: 40,
        seoulChamberCommuteMin: 30,
        schools: schoolsJungnang[4],
      },
      {
        currentPrice: 70000,
        price3MonthsAgo: 68000,
        jeonsePrice: 46000,
        jeonseListingCount: 10,
        naverInterestCount: 5100,
        locationScore: 85,
        totalScore: 80,
        rankRegion: 1,
        isLandPermitZone: true,
        investScore2Y: 85,
        investRationale: ["GTX-B 상봉역 최대 수혜", "2017년 준신축", "상봉역 도보3분 초역세권", "강남 40분 접근성"],
      }
    ),
  ];
}

export function getMock30LastUpdated(): Date {
  // Simulate last update being earlier today
  const d = new Date();
  d.setHours(6, 0, 0, 0);
  return d;
}
