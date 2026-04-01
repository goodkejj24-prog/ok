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

// ── Schools ──

const schoolsGeumcheonGwanak: School[][] = [
  // 독산동 주공
  [
    { name: "독산초", distance: "200m", type: "초" },
    { name: "독산중", distance: "400m", type: "중" },
  ],
  // 시흥동 벽산
  [
    { name: "시흥초", distance: "350m", type: "초" },
    { name: "시흥중", distance: "500m", type: "중" },
    { name: "금천고", distance: "700m", type: "고" },
  ],
  // 금나래 대림
  [
    { name: "금나래초", distance: "250m", type: "초" },
    { name: "문성중", distance: "600m", type: "중" },
  ],
  // 신림 벽산
  [
    { name: "신림초", distance: "300m", type: "초" },
    { name: "신림중", distance: "500m", type: "중" },
  ],
  // 봉천 e편한세상
  [
    { name: "봉천초", distance: "300m", type: "초" },
    { name: "관악중", distance: "450m", type: "중" },
  ],
];

const schoolsJungnangNowon: School[][] = [
  // 면목동 한신
  [
    { name: "면목초", distance: "200m", type: "초" },
    { name: "면목중", distance: "350m", type: "중" },
    { name: "면목고", distance: "500m", type: "고" },
  ],
  // 상봉동 동아
  [
    { name: "상봉초", distance: "300m", type: "초" },
    { name: "상봉중", distance: "450m", type: "중" },
  ],
  // 중화동 건영
  [
    { name: "중화초", distance: "250m", type: "초" },
    { name: "중랑중", distance: "400m", type: "중" },
    { name: "중랑고", distance: "650m", type: "고" },
  ],
  // 상계주공5단지
  [
    { name: "상계초", distance: "200m", type: "초" },
    { name: "상계중", distance: "350m", type: "중" },
    { name: "노원고", distance: "600m", type: "고" },
  ],
  // 중계그린1단지
  [
    { name: "중계초", distance: "150m", type: "초" },
    { name: "중계중", distance: "300m", type: "중" },
    { name: "대진고", distance: "500m", type: "고" },
  ],
];

const schoolsPyeongchon: School[][] = [
  // 목련1단지
  [
    { name: "귀인초", distance: "200m", type: "초" },
    { name: "평촌중", distance: "400m", type: "중" },
    { name: "평촌고", distance: "600m", type: "고" },
  ],
  // 한가람
  [
    { name: "평촌초", distance: "200m", type: "초" },
    { name: "평촌중", distance: "350m", type: "중" },
    { name: "범계고", distance: "600m", type: "고" },
  ],
  // 초원
  [
    { name: "범계초", distance: "200m", type: "초" },
    { name: "범계중", distance: "400m", type: "중" },
  ],
  // 귀인마을 삼성래미안
  [
    { name: "귀인초", distance: "300m", type: "초" },
    { name: "평촌중", distance: "500m", type: "중" },
    { name: "범계고", distance: "800m", type: "고" },
  ],
  // 대림e편한세상
  [
    { name: "범계초", distance: "150m", type: "초" },
    { name: "범계중", distance: "350m", type: "중" },
    { name: "평촌고", distance: "500m", type: "고" },
  ],
];

const schoolsYongin: School[][] = [
  // 성복역 롯데캐슬
  [
    { name: "성복초", distance: "250m", type: "초" },
    { name: "수지중", distance: "450m", type: "중" },
  ],
  // 풍덕천 주공
  [
    { name: "풍덕초", distance: "250m", type: "초" },
    { name: "풍덕중", distance: "400m", type: "중" },
  ],
  // 영덕 e편한세상
  [
    { name: "영덕초", distance: "200m", type: "초" },
    { name: "영덕중", distance: "350m", type: "중" },
    { name: "기흥고", distance: "500m", type: "고" },
  ],
  // 동천 현대홈타운
  [
    { name: "동천초", distance: "200m", type: "초" },
    { name: "동천중", distance: "400m", type: "중" },
  ],
  // 구갈 삼성래미안
  [
    { name: "구갈초", distance: "300m", type: "초" },
    { name: "구갈중", distance: "500m", type: "중" },
  ],
];

export function getMockUnder5Apartments(): ApartmentCardData[] {
  return [
    // ── 금천·관악 (5 apartments, 서울 토허제, under 5억) ──
    createApartment(
      {
        id: "u5-gc1",
        name: "독산동 주공아파트",
        region: "금천·관악",
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
        schools: schoolsGeumcheonGwanak[0],
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
        investRationale: ["재건축 안전진단 통과 임박", "1,680세대 대규모 재건축", "독산역 1호선 역세권", "서울 최저가 상승 여력"],
      }
    ),
    createApartment(
      {
        id: "u5-gc2",
        name: "시흥동 벽산아파트",
        region: "금천·관악",
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
        schools: schoolsGeumcheonGwanak[1],
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
        investRationale: ["가산디지털단지 확장 개발", "더블 역세권 인접", "서울 3.3억 소형", "토허제 해제 시 급등 기대"],
      }
    ),
    createApartment(
      {
        id: "u5-gc3",
        name: "금나래 대림아파트",
        region: "금천·관악",
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
        schools: schoolsGeumcheonGwanak[2],
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
        investRationale: ["가산·독산 재정비 계획", "강남 30분대 가성비", "IT직주근접 수요", "최근 상승 추세"],
      }
    ),
    createApartment(
      {
        id: "u5-gk1",
        name: "신림 벽산아파트",
        region: "금천·관악",
        address: "서울시 관악구 신림동 1450",
        totalHouseholds: 1200,
        builtYear: 1997,
        hallwayType: "복도식",
        heatingType: "지역난방",
        avgMaintenanceFee: 13,
        roomCount: 3,
        exclusiveArea: 56.1,
        nearestStation: "신림역",
        stationWalkMin: 10,
        gangnamCommuteMin: 25,
        seoulChamberCommuteMin: 30,
        schools: schoolsGeumcheonGwanak[3],
      },
      {
        currentPrice: 40000,
        price3MonthsAgo: 39000,
        jeonsePrice: 26000,
        jeonseListingCount: 16,
        naverInterestCount: 2900,
        locationScore: 72,
        totalScore: 69,
        rankRegion: 4,
        isLandPermitZone: true,
        investScore2Y: 75,
        investRationale: ["신림선 개통 수혜 (2024)", "신림역 2호선 역세권", "서울 4억대 25평", "관악 재개발 기대"],
      }
    ),
    createApartment(
      {
        id: "u5-gk2",
        name: "봉천 e편한세상",
        region: "금천·관악",
        address: "서울시 관악구 봉천동 980",
        totalHouseholds: 520,
        builtYear: 2010,
        hallwayType: "계단식",
        heatingType: "개별난방",
        avgMaintenanceFee: 17,
        roomCount: 3,
        exclusiveArea: 59.7,
        nearestStation: "봉천역",
        stationWalkMin: 8,
        gangnamCommuteMin: 22,
        seoulChamberCommuteMin: 25,
        schools: schoolsGeumcheonGwanak[4],
      },
      {
        currentPrice: 48000,
        price3MonthsAgo: 47000,
        jeonsePrice: 31000,
        jeonseListingCount: 9,
        naverInterestCount: 3600,
        locationScore: 78,
        totalScore: 75,
        rankRegion: 5,
        isLandPermitZone: true,
        investScore2Y: 77,
        investRationale: ["봉천역 2호선 강남 직통", "관악구 재정비 사업", "서울대입구 학원가 수혜", "2010년 준신축"],
      }
    ),

    // ── 중랑·노원 (5 apartments, 서울 토허제, under 5억) ──
    createApartment(
      {
        id: "u5-jn1",
        name: "면목동 한신아파트",
        region: "중랑·노원",
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
        schools: schoolsJungnangNowon[0],
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
        investRationale: ["면목선 경전철 착공", "면목동 재개발 인접", "최근 3개월 +6.5% 급등", "서울 3.3억 상승 여력"],
      }
    ),
    createApartment(
      {
        id: "u5-jn2",
        name: "상봉동 동아아파트",
        region: "중랑·노원",
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
        schools: schoolsJungnangNowon[1],
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
        id: "u5-jn3",
        name: "중화동 건영아파트",
        region: "중랑·노원",
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
        schools: schoolsJungnangNowon[2],
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
        investRationale: ["서울 2.9억 최저가 진입", "중화역 정비사업", "면목선 연장 수혜", "저점 매수 기회"],
      }
    ),
    createApartment(
      {
        id: "u5-nw1",
        name: "노원 상계주공5단지",
        region: "중랑·노원",
        address: "서울시 노원구 상계동 710",
        totalHouseholds: 2470,
        builtYear: 1988,
        hallwayType: "복도식",
        heatingType: "지역난방",
        avgMaintenanceFee: 12,
        roomCount: 2,
        exclusiveArea: 39.7,
        nearestStation: "상계역",
        stationWalkMin: 7,
        gangnamCommuteMin: 55,
        seoulChamberCommuteMin: 40,
        schools: schoolsJungnangNowon[3],
      },
      {
        currentPrice: 25000,
        price3MonthsAgo: 24000,
        jeonsePrice: 17000,
        jeonseListingCount: 25,
        naverInterestCount: 3500,
        locationScore: 68,
        totalScore: 65,
        rankRegion: 4,
        isLandPermitZone: true,
        investScore2Y: 82,
        investRationale: ["노원 재건축 본격화", "2,470세대 대규모 재건축", "상계역 4호선 역세권", "서울 2.5억 최저가 진입"],
      }
    ),
    createApartment(
      {
        id: "u5-nw2",
        name: "노원 중계그린1단지",
        region: "중랑·노원",
        address: "서울시 노원구 중계동 380",
        totalHouseholds: 1740,
        builtYear: 1992,
        hallwayType: "복도식",
        heatingType: "지역난방",
        avgMaintenanceFee: 14,
        roomCount: 3,
        exclusiveArea: 49.8,
        nearestStation: "하계역",
        stationWalkMin: 8,
        gangnamCommuteMin: 50,
        seoulChamberCommuteMin: 42,
        schools: schoolsJungnangNowon[4],
      },
      {
        currentPrice: 35000,
        price3MonthsAgo: 34000,
        jeonsePrice: 24000,
        jeonseListingCount: 18,
        naverInterestCount: 4200,
        locationScore: 73,
        totalScore: 70,
        rankRegion: 5,
        isLandPermitZone: true,
        investScore2Y: 79,
        investRationale: ["중계동 학군 프리미엄", "하계역 7호선 역세권", "1,740세대 대단지 재건축", "노원 재건축 벨트 수혜"],
      }
    ),

    // ── 평촌 (5 apartments, 비토허제, under 5억) ──
    createApartment(
      {
        id: "u5-pc1",
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
        investRationale: ["재건축 안전진단 추진 중", "신분당선 연장 호재", "평촌 스마트스퀘어 개발", "전세가율 67% 하방 지지"],
      }
    ),
    createApartment(
      {
        id: "u5-pc2",
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
        investRationale: ["평촌 학군 프리미엄 지속", "범계역 상권 확장", "전세가율 67% 안정적", "최근 3개월 상승세"],
      }
    ),
    createApartment(
      {
        id: "u5-pc3",
        name: "평촌 초원아파트",
        region: "평촌",
        address: "경기도 안양시 동안구 범계동 520",
        totalHouseholds: 1100,
        builtYear: 1992,
        hallwayType: "계단식",
        heatingType: "지역난방",
        avgMaintenanceFee: 15,
        roomCount: 3,
        exclusiveArea: 59.4,
        nearestStation: "범계역",
        stationWalkMin: 10,
        gangnamCommuteMin: 40,
        seoulChamberCommuteMin: 46,
        schools: schoolsPyeongchon[2],
      },
      {
        currentPrice: 38000,
        price3MonthsAgo: 37000,
        jeonsePrice: 26000,
        jeonseListingCount: 8,
        naverInterestCount: 2200,
        locationScore: 72,
        totalScore: 69,
        rankRegion: 3,
        isLandPermitZone: false,
        investScore2Y: 76,
        investRationale: ["범계역 상권 확장 수혜", "1,100세대 대단지", "재건축 연한 도래", "평촌 학군 배후 수요"],
      }
    ),
    createApartment(
      {
        id: "u5-pc4",
        name: "평촌 귀인마을 삼성래미안",
        region: "평촌",
        address: "경기도 안양시 동안구 귀인동 320",
        totalHouseholds: 1480,
        builtYear: 2003,
        hallwayType: "계단식",
        heatingType: "지역난방",
        avgMaintenanceFee: 20,
        roomCount: 3,
        exclusiveArea: 59.8,
        nearestStation: "인덕원역",
        stationWalkMin: 12,
        gangnamCommuteMin: 42,
        seoulChamberCommuteMin: 48,
        schools: schoolsPyeongchon[3],
      },
      {
        currentPrice: 48000,
        price3MonthsAgo: 47000,
        jeonsePrice: 32000,
        jeonseListingCount: 11,
        naverInterestCount: 3100,
        locationScore: 75,
        totalScore: 72,
        rankRegion: 4,
        isLandPermitZone: false,
        investScore2Y: 74,
        investRationale: ["인덕원~동탄 복선전철 호재", "1,480세대 대단지", "평촌 학군 프리미엄", "준신축 관리 양호"],
      }
    ),
    createApartment(
      {
        id: "u5-pc5",
        name: "평촌 대림e편한세상",
        region: "평촌",
        address: "경기도 안양시 동안구 범계동 610",
        totalHouseholds: 1050,
        builtYear: 2006,
        hallwayType: "계단식",
        heatingType: "개별난방",
        avgMaintenanceFee: 16,
        roomCount: 3,
        exclusiveArea: 59.6,
        nearestStation: "범계역",
        stationWalkMin: 6,
        gangnamCommuteMin: 39,
        seoulChamberCommuteMin: 45,
        schools: schoolsPyeongchon[4],
      },
      {
        currentPrice: 47000,
        price3MonthsAgo: 46000,
        jeonsePrice: 31000,
        jeonseListingCount: 6,
        naverInterestCount: 3400,
        locationScore: 80,
        totalScore: 77,
        rankRegion: 5,
        isLandPermitZone: false,
        investScore2Y: 80,
        investRationale: ["범계역 도보6분 초역세권", "신분당선 연장 수혜", "2006년식 관리 양호", "평촌 학군 수요 탄탄"],
      }
    ),

    // ── 용인 (5 apartments, 비토허제, under 5억) ──
    createApartment(
      {
        id: "u5-yi1",
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
        id: "u5-yi2",
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
        investRationale: ["재건축 연한 도래", "저평가 구간", "GTX-A 수혜", "전세가율 69% 소액 투자"],
      }
    ),
    createApartment(
      {
        id: "u5-yi3",
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
        investRationale: ["GTX-A 기흥역 환승", "영덕역 초역세권", "2012년 준신축", "기흥 테크노밸리 직주근접"],
      }
    ),
    createApartment(
      {
        id: "u5-yi4",
        name: "수지 동천 현대홈타운",
        region: "용인",
        address: "경기도 용인시 수지구 동천동 550",
        totalHouseholds: 1050,
        builtYear: 2002,
        hallwayType: "계단식",
        heatingType: "개별난방",
        avgMaintenanceFee: 15,
        roomCount: 3,
        exclusiveArea: 59.3,
        nearestStation: "동천역",
        stationWalkMin: 10,
        gangnamCommuteMin: 48,
        seoulChamberCommuteMin: 52,
        schools: schoolsYongin[3],
      },
      {
        currentPrice: 38000,
        price3MonthsAgo: 37000,
        jeonsePrice: 25000,
        jeonseListingCount: 9,
        naverInterestCount: 2400,
        locationScore: 73,
        totalScore: 70,
        rankRegion: 4,
        isLandPermitZone: false,
        investScore2Y: 75,
        investRationale: ["신분당선 동천역 역세권", "GTX-A 수서 환승 수혜", "1,050세대 대단지", "수지 학군 프리미엄"],
      }
    ),
    createApartment(
      {
        id: "u5-yi5",
        name: "기흥 구갈 삼성래미안",
        region: "용인",
        address: "경기도 용인시 기흥구 구갈동 380",
        totalHouseholds: 1380,
        builtYear: 2003,
        hallwayType: "계단식",
        heatingType: "개별난방",
        avgMaintenanceFee: 14,
        roomCount: 3,
        exclusiveArea: 59.1,
        nearestStation: "구갈역",
        stationWalkMin: 7,
        gangnamCommuteMin: 58,
        seoulChamberCommuteMin: 60,
        schools: schoolsYongin[4],
      },
      {
        currentPrice: 30000,
        price3MonthsAgo: 29000,
        jeonsePrice: 21000,
        jeonseListingCount: 10,
        naverInterestCount: 1900,
        locationScore: 68,
        totalScore: 65,
        rankRegion: 5,
        isLandPermitZone: false,
        investScore2Y: 73,
        investRationale: ["구갈역 에버라인+신분당선 환승", "1,380세대 대단지", "용인 3억대 진입 기회", "GTX-A 수혜권"],
      }
    ),
  ];
}

export function getMockUnder5LastUpdated(): Date {
  const d = new Date();
  d.setHours(6, 0, 0, 0);
  return d;
}
