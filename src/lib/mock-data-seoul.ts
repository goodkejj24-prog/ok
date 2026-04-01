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

// ── 강남·서초 학교 ──
const schoolsGangnamSeocho: School[][] = [
  [
    { name: "개포초", distance: "200m", type: "초" },
    { name: "개포중", distance: "400m", type: "중" },
    { name: "개포고", distance: "600m", type: "고" },
  ],
  [
    { name: "대치초", distance: "300m", type: "초" },
    { name: "대청중", distance: "500m", type: "중" },
  ],
  [
    { name: "서초초", distance: "150m", type: "초" },
    { name: "서운중", distance: "350m", type: "중" },
    { name: "서초고", distance: "500m", type: "고" },
  ],
  [
    { name: "반포초", distance: "300m", type: "초" },
    { name: "세화중", distance: "450m", type: "중" },
  ],
];

// ── 동작·관악 학교 ──
const schoolsDonjakGwanak: School[][] = [
  [
    { name: "사당초", distance: "250m", type: "초" },
    { name: "남성중", distance: "400m", type: "중" },
  ],
  [
    { name: "상도초", distance: "200m", type: "초" },
    { name: "상도중", distance: "500m", type: "중" },
    { name: "동작고", distance: "700m", type: "고" },
  ],
  [
    { name: "봉천초", distance: "300m", type: "초" },
    { name: "관악중", distance: "450m", type: "중" },
  ],
  [
    { name: "신림초", distance: "350m", type: "초" },
    { name: "신림중", distance: "500m", type: "중" },
  ],
];

// ── 용산·성동 학교 ──
const schoolsYongsanSeongdong: School[][] = [
  [
    { name: "금호초", distance: "200m", type: "초" },
    { name: "금호중", distance: "400m", type: "중" },
  ],
  [
    { name: "행당초", distance: "250m", type: "초" },
    { name: "무학중", distance: "350m", type: "중" },
    { name: "성동고", distance: "600m", type: "고" },
  ],
  [
    { name: "옥수초", distance: "200m", type: "초" },
    { name: "옥정중", distance: "450m", type: "중" },
  ],
  [
    { name: "이촌초", distance: "300m", type: "초" },
    { name: "용산중", distance: "500m", type: "중" },
  ],
];

// ── 송파·강동 학교 ──
const schoolsSongpaGangdong: School[][] = [
  [
    { name: "잠실초", distance: "200m", type: "초" },
    { name: "잠실중", distance: "350m", type: "중" },
    { name: "잠신고", distance: "500m", type: "고" },
  ],
  [
    { name: "가락초", distance: "250m", type: "초" },
    { name: "가락중", distance: "400m", type: "중" },
  ],
  [
    { name: "문정초", distance: "300m", type: "초" },
    { name: "문정중", distance: "500m", type: "중" },
  ],
  [
    { name: "명일초", distance: "200m", type: "초" },
    { name: "명일중", distance: "450m", type: "중" },
    { name: "강동고", distance: "700m", type: "고" },
  ],
];

export function getMockSeoulApartments(): ApartmentCardData[] {
  return [
    // ── 강남·서초 (4 apartments, 강남역 5~15분) ──
    createApartment(
      {
        id: "gs-001",
        name: "개포주공1단지",
        region: "강남·서초",
        address: "서울시 강남구 개포동 12",
        totalHouseholds: 5040,
        builtYear: 1982,
        hallwayType: "복도식",
        heatingType: "지역난방",
        avgMaintenanceFee: 12,
        roomCount: 2,
        exclusiveArea: 41.3,
        nearestStation: "개포동역",
        stationWalkMin: 5,
        gangnamCommuteMin: 12,
        seoulChamberCommuteMin: 30,
        schools: schoolsGangnamSeocho[0],
      },
      {
        currentPrice: 87000,
        price3MonthsAgo: 85000,
        jeonsePrice: 46000,
        jeonseListingCount: 25,
        naverInterestCount: 8200,
        locationScore: 95,
        totalScore: 93,
        rankRegion: 2,
        isLandPermitZone: true,
        investScore2Y: 90,
        investRationale: ["재건축 사업 추진 중 (개포 프레지던스)", "개포동역 도보5분", "강남 학군 최상급", "5,040세대 메가단지 재건축"],
      }
    ),
    createApartment(
      {
        id: "gs-002",
        name: "대치 쌍용아파트",
        region: "강남·서초",
        address: "서울시 강남구 대치동 316",
        totalHouseholds: 480,
        builtYear: 1988,
        hallwayType: "계단식",
        heatingType: "지역난방",
        avgMaintenanceFee: 15,
        roomCount: 2,
        exclusiveArea: 49.6,
        nearestStation: "대치역",
        stationWalkMin: 8,
        gangnamCommuteMin: 10,
        seoulChamberCommuteMin: 25,
        schools: schoolsGangnamSeocho[1],
      },
      {
        currentPrice: 80000,
        price3MonthsAgo: 78000,
        jeonsePrice: 43000,
        jeonseListingCount: 8,
        naverInterestCount: 6500,
        locationScore: 92,
        totalScore: 90,
        rankRegion: 3,
        isLandPermitZone: true,
        investScore2Y: 82,
        investRationale: ["대치동 학군 프리미엄", "대치역 도보8분", "강남 핵심 입지", "소형 희소성 프리미엄"],
      }
    ),
    createApartment(
      {
        id: "gs-003",
        name: "서초 무지개아파트",
        region: "강남·서초",
        address: "서울시 서초구 서초동 1445",
        totalHouseholds: 1860,
        builtYear: 1985,
        hallwayType: "복도식",
        heatingType: "지역난방",
        avgMaintenanceFee: 14,
        roomCount: 2,
        exclusiveArea: 49.9,
        nearestStation: "서초역",
        stationWalkMin: 10,
        gangnamCommuteMin: 5,
        seoulChamberCommuteMin: 20,
        schools: schoolsGangnamSeocho[2],
      },
      {
        currentPrice: 95000,
        price3MonthsAgo: 93000,
        jeonsePrice: 52000,
        jeonseListingCount: 18,
        naverInterestCount: 7800,
        locationScore: 93,
        totalScore: 94,
        rankRegion: 1,
        isLandPermitZone: true,
        investScore2Y: 85,
        investRationale: ["서초역 도보10분 강남 5분", "1,860세대 대단지", "서초 재건축 추진", "교육·상권 최상급"],
      }
    ),
    createApartment(
      {
        id: "gs-004",
        name: "반포 주공1단지",
        region: "강남·서초",
        address: "서울시 서초구 반포동 18",
        totalHouseholds: 2790,
        builtYear: 1973,
        hallwayType: "복도식",
        heatingType: "지역난방",
        avgMaintenanceFee: 10,
        roomCount: 2,
        exclusiveArea: 39.7,
        nearestStation: "고속터미널역",
        stationWalkMin: 12,
        gangnamCommuteMin: 8,
        seoulChamberCommuteMin: 25,
        schools: schoolsGangnamSeocho[3],
      },
      {
        currentPrice: 98000,
        price3MonthsAgo: 95000,
        jeonsePrice: 50000,
        jeonseListingCount: 15,
        naverInterestCount: 9100,
        locationScore: 94,
        totalScore: 96,
        rankRegion: 4,
        isLandPermitZone: true,
        investScore2Y: 92,
        investRationale: ["반포 재건축 확정 (래미안 원펜타스)", "강남 핵심 반포 입지", "2,790세대 대규모 재건축", "하방 경직성 최강"],
      }
    ),

    // ── 동작·관악 (4 apartments, 강남역 15~25분) ──
    createApartment(
      {
        id: "dg-001",
        name: "사당 삼성래미안",
        region: "동작·관악",
        address: "서울시 동작구 사당동 230",
        totalHouseholds: 640,
        builtYear: 2004,
        hallwayType: "계단식",
        heatingType: "개별난방",
        avgMaintenanceFee: 16,
        roomCount: 3,
        exclusiveArea: 59.9,
        nearestStation: "사당역",
        stationWalkMin: 7,
        gangnamCommuteMin: 18,
        seoulChamberCommuteMin: 30,
        schools: schoolsDonjakGwanak[0],
      },
      {
        currentPrice: 54000,
        price3MonthsAgo: 52000,
        jeonsePrice: 33000,
        jeonseListingCount: 11,
        naverInterestCount: 4800,
        locationScore: 82,
        totalScore: 84,
        rankRegion: 1,
        isLandPermitZone: true,
        investScore2Y: 78,
        investRationale: ["사당역 더블역세권 (2호선+4호선)", "흑석 뉴타운 인접 수혜", "강남 18분 접근성", "2004년식 관리 양호"],
      }
    ),
    createApartment(
      {
        id: "dg-002",
        name: "상도 두산위브",
        region: "동작·관악",
        address: "서울시 동작구 상도동 412",
        totalHouseholds: 380,
        builtYear: 2008,
        hallwayType: "계단식",
        heatingType: "개별난방",
        avgMaintenanceFee: 15,
        roomCount: 3,
        exclusiveArea: 59.5,
        nearestStation: "상도역",
        stationWalkMin: 6,
        gangnamCommuteMin: 20,
        seoulChamberCommuteMin: 30,
        schools: schoolsDonjakGwanak[1],
      },
      {
        currentPrice: 47000,
        price3MonthsAgo: 46000,
        jeonsePrice: 29000,
        jeonseListingCount: 7,
        naverInterestCount: 3200,
        locationScore: 75,
        totalScore: 74,
        rankRegion: 3,
        isLandPermitZone: true,
        investScore2Y: 72,
        investRationale: ["상도역 7호선 역세권", "노량진 개발 수혜", "강남 20분대 가성비", "서울 4.7억 진입 기회"],
      }
    ),
    createApartment(
      {
        id: "dg-003",
        name: "봉천 e편한세상",
        region: "동작·관악",
        address: "서울시 관악구 봉천동 855",
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
        schools: schoolsDonjakGwanak[2],
      },
      {
        currentPrice: 50000,
        price3MonthsAgo: 49000,
        jeonsePrice: 31000,
        jeonseListingCount: 9,
        naverInterestCount: 3600,
        locationScore: 78,
        totalScore: 79,
        rankRegion: 2,
        isLandPermitZone: true,
        investScore2Y: 75,
        investRationale: ["봉천역 2호선 강남 직통", "관악구 재정비 사업", "서울대입구 학원가 수혜", "2010년 준신축"],
      }
    ),
    createApartment(
      {
        id: "dg-004",
        name: "신림 벽산아파트",
        region: "동작·관악",
        address: "서울시 관악구 신림동 1640",
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
        schools: schoolsDonjakGwanak[3],
      },
      {
        currentPrice: 40000,
        price3MonthsAgo: 39000,
        jeonsePrice: 26000,
        jeonseListingCount: 16,
        naverInterestCount: 2900,
        locationScore: 70,
        totalScore: 68,
        rankRegion: 4,
        isLandPermitZone: true,
        investScore2Y: 73,
        investRationale: ["신림선 개통 수혜", "신림역 2호선 역세권", "서울 4억대 최저가", "관악 재개발 기대"],
      }
    ),

    // ── 용산·성동 (4 apartments, 강남역 15~25분) ──
    createApartment(
      {
        id: "ys-001",
        name: "금호 두산위브",
        region: "용산·성동",
        address: "서울시 성동구 금호동 340",
        totalHouseholds: 410,
        builtYear: 2007,
        hallwayType: "계단식",
        heatingType: "개별난방",
        avgMaintenanceFee: 16,
        roomCount: 3,
        exclusiveArea: 59.8,
        nearestStation: "금호역",
        stationWalkMin: 5,
        gangnamCommuteMin: 18,
        seoulChamberCommuteMin: 15,
        schools: schoolsYongsanSeongdong[0],
      },
      {
        currentPrice: 60000,
        price3MonthsAgo: 58000,
        jeonsePrice: 36000,
        jeonseListingCount: 8,
        naverInterestCount: 4500,
        locationScore: 83,
        totalScore: 82,
        rankRegion: 2,
        isLandPermitZone: true,
        investScore2Y: 80,
        investRationale: ["금호역 도보5분 역세권", "한남 뉴타운 인접 수혜", "강남 18분 접근성", "2007년 관리 양호"],
      }
    ),
    createApartment(
      {
        id: "ys-002",
        name: "행당 한진타운",
        region: "용산·성동",
        address: "서울시 성동구 행당동 286",
        totalHouseholds: 680,
        builtYear: 2000,
        hallwayType: "계단식",
        heatingType: "지역난방",
        avgMaintenanceFee: 18,
        roomCount: 3,
        exclusiveArea: 59.4,
        nearestStation: "행당역",
        stationWalkMin: 7,
        gangnamCommuteMin: 20,
        seoulChamberCommuteMin: 15,
        schools: schoolsYongsanSeongdong[1],
      },
      {
        currentPrice: 54000,
        price3MonthsAgo: 53000,
        jeonsePrice: 34000,
        jeonseListingCount: 10,
        naverInterestCount: 3800,
        locationScore: 79,
        totalScore: 78,
        rankRegion: 3,
        isLandPermitZone: true,
        investScore2Y: 76,
        investRationale: ["행당역 5호선 역세권", "왕십리 뉴타운 인접", "성수 IT벨리 직주근접", "서울숲 생활권"],
      }
    ),
    createApartment(
      {
        id: "ys-003",
        name: "옥수 극동아파트",
        region: "용산·성동",
        address: "서울시 성동구 옥수동 384",
        totalHouseholds: 900,
        builtYear: 1983,
        hallwayType: "복도식",
        heatingType: "지역난방",
        avgMaintenanceFee: 12,
        roomCount: 2,
        exclusiveArea: 49.5,
        nearestStation: "옥수역",
        stationWalkMin: 4,
        gangnamCommuteMin: 15,
        seoulChamberCommuteMin: 15,
        schools: schoolsYongsanSeongdong[2],
      },
      {
        currentPrice: 65000,
        price3MonthsAgo: 63000,
        jeonsePrice: 38000,
        jeonseListingCount: 12,
        naverInterestCount: 5100,
        locationScore: 85,
        totalScore: 86,
        rankRegion: 1,
        isLandPermitZone: true,
        investScore2Y: 83,
        investRationale: ["옥수역 도보4분 초역세권", "한강 조망 프리미엄", "강남 15분 최단거리", "재건축 기대감"],
      }
    ),
    createApartment(
      {
        id: "ys-004",
        name: "용산 시범아파트",
        region: "용산·성동",
        address: "서울시 용산구 이촌동 302",
        totalHouseholds: 1590,
        builtYear: 1971,
        hallwayType: "복도식",
        heatingType: "지역난방",
        avgMaintenanceFee: 11,
        roomCount: 2,
        exclusiveArea: 46.8,
        nearestStation: "이촌역",
        stationWalkMin: 8,
        gangnamCommuteMin: 22,
        seoulChamberCommuteMin: 20,
        schools: schoolsYongsanSeongdong[3],
      },
      {
        currentPrice: 73000,
        price3MonthsAgo: 71000,
        jeonsePrice: 40000,
        jeonseListingCount: 14,
        naverInterestCount: 6800,
        locationScore: 86,
        totalScore: 84,
        rankRegion: 4,
        isLandPermitZone: true,
        investScore2Y: 87,
        investRationale: ["용산 국제업무지구 개발", "이촌역 4호선 역세권", "한강변 프리미엄", "1,590세대 재건축 추진"],
      }
    ),

    // ── 송파·강동 (4 apartments, 강남역 15~25분) ──
    createApartment(
      {
        id: "sg-001",
        name: "잠실 주공5단지",
        region: "송파·강동",
        address: "서울시 송파구 잠실동 40",
        totalHouseholds: 3930,
        builtYear: 1978,
        hallwayType: "복도식",
        heatingType: "지역난방",
        avgMaintenanceFee: 12,
        roomCount: 2,
        exclusiveArea: 40.5,
        nearestStation: "잠실역",
        stationWalkMin: 10,
        gangnamCommuteMin: 15,
        seoulChamberCommuteMin: 25,
        schools: schoolsSongpaGangdong[0],
      },
      {
        currentPrice: 90000,
        price3MonthsAgo: 87000,
        jeonsePrice: 47000,
        jeonseListingCount: 20,
        naverInterestCount: 9500,
        locationScore: 92,
        totalScore: 93,
        rankRegion: 1,
        isLandPermitZone: true,
        investScore2Y: 93,
        investRationale: ["서울 최대 재건축 사업 확정", "잠실역 2호선 도보10분", "잠실 MICE 개발", "3,930세대 메가 재건축"],
      }
    ),
    createApartment(
      {
        id: "sg-002",
        name: "가락 쌍용아파트",
        region: "송파·강동",
        address: "서울시 송파구 가락동 75",
        totalHouseholds: 1100,
        builtYear: 1985,
        hallwayType: "복도식",
        heatingType: "지역난방",
        avgMaintenanceFee: 13,
        roomCount: 2,
        exclusiveArea: 49.9,
        nearestStation: "가락시장역",
        stationWalkMin: 6,
        gangnamCommuteMin: 20,
        seoulChamberCommuteMin: 30,
        schools: schoolsSongpaGangdong[1],
      },
      {
        currentPrice: 57000,
        price3MonthsAgo: 55000,
        jeonsePrice: 33000,
        jeonseListingCount: 11,
        naverInterestCount: 4200,
        locationScore: 80,
        totalScore: 79,
        rankRegion: 2,
        isLandPermitZone: true,
        investScore2Y: 77,
        investRationale: ["가락시장역 도보6분", "위례~신사 경전철 수혜", "법조타운 배후 수요", "송파 저평가 구간"],
      }
    ),
    createApartment(
      {
        id: "sg-003",
        name: "문정 훼밀리아파트",
        region: "송파·강동",
        address: "서울시 송파구 문정동 150",
        totalHouseholds: 780,
        builtYear: 1990,
        hallwayType: "복도식",
        heatingType: "지역난방",
        avgMaintenanceFee: 14,
        roomCount: 3,
        exclusiveArea: 58.7,
        nearestStation: "문정역",
        stationWalkMin: 9,
        gangnamCommuteMin: 22,
        seoulChamberCommuteMin: 30,
        schools: schoolsSongpaGangdong[2],
      },
      {
        currentPrice: 50000,
        price3MonthsAgo: 49000,
        jeonsePrice: 31000,
        jeonseListingCount: 8,
        naverInterestCount: 3400,
        locationScore: 76,
        totalScore: 74,
        rankRegion: 3,
        isLandPermitZone: true,
        investScore2Y: 74,
        investRationale: ["문정역 8호선 역세권", "문정법조타운 직주근접", "위례신도시 인접", "송파 4.5억대 진입"],
      }
    ),
    createApartment(
      {
        id: "sg-004",
        name: "명일 삼익아파트",
        region: "송파·강동",
        address: "서울시 강동구 명일동 320",
        totalHouseholds: 1650,
        builtYear: 1987,
        hallwayType: "복도식",
        heatingType: "지역난방",
        avgMaintenanceFee: 11,
        roomCount: 2,
        exclusiveArea: 46.2,
        nearestStation: "명일역",
        stationWalkMin: 5,
        gangnamCommuteMin: 25,
        seoulChamberCommuteMin: 40,
        schools: schoolsSongpaGangdong[3],
      },
      {
        currentPrice: 44000,
        price3MonthsAgo: 43000,
        jeonsePrice: 28000,
        jeonseListingCount: 13,
        naverInterestCount: 3100,
        locationScore: 72,
        totalScore: 70,
        rankRegion: 4,
        isLandPermitZone: true,
        investScore2Y: 71,
        investRationale: ["명일역 5호선 도보5분", "강동 재정비 촉진지구", "9호선 연장 수혜 기대", "서울 4.4억 소형 기회"],
      }
    ),
  ];
}

export function getMockSeoulLastUpdated(): Date {
  const d = new Date();
  d.setHours(6, 0, 0, 0);
  return d;
}
