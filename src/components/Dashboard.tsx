"use client";

import { useState, useMemo } from "react";
import { RegionTabs } from "@/components/RegionTabs";
import { SortSelector } from "@/components/SortSelector";
import { ApartmentCard } from "@/components/ApartmentCard";
import { LastUpdated } from "@/components/LastUpdated";
import type { ApartmentCardData, Region, SortOption } from "@/lib/types";

interface DashboardProps {
  apartments: ApartmentCardData[];
  lastUpdated: Date | null;
  title?: string;
  defaultRegion?: Region;
  regions?: { value: Region; label: string }[];
}

const DESCENDING_SORTS: SortOption[] = ["naverInterestCount", "jeonseRate"];

const REGION_STRATEGIES: Record<string, { title: string; strategy: string; keywords: string[]; color: string }> = {
  // 25평/30평 regions
  "평촌": {
    title: "단기 투자 유망 지역",
    strategy: "평촌은 4호선+신분당선 연장 호재, 학군 수요가 탄탄하여 단기 시세 차익을 노리기 좋은 지역입니다. 전세가율이 높고 갭이 적어 소액 갭투자에 유리하며, 재건축 기대감이 있는 구축 아파트를 노려볼 만합니다. 평촌 스마트스퀘어, 범계역 상권 확장 등 개발 호재가 있어 1~2년 내 시세 상승 여력이 있습니다.",
    keywords: ["단기 차익", "소액 갭투자", "재건축 기대", "학군 수요"],
    color: "blue"
  },
  "용인": {
    title: "중장기 안정 투자 지역",
    strategy: "용인은 신분당선 역세권 중심으로 꾸준한 수요가 있으나, 입주 물량이 많아 단기 차익보다는 중장기 보유 전략이 적합합니다. 수지·기흥구 역세권 위주로 전세 수요가 안정적이며, GTX-A 개통 시 강남 접근성이 크게 개선될 예정입니다. 평촌 대비 매매가가 낮아 진입 장벽은 낮지만 시세 상승 속도는 느린 편입니다.",
    keywords: ["중장기 보유", "GTX-A 호재", "낮은 진입장벽", "안정적 전세수요"],
    color: "green"
  },
  "금천": {
    title: "실거주 + 장기 투자 지역 (토허제)",
    strategy: "금천구는 서울 내 상대적 저평가 지역으로, 가산디지털단지·독산역 개발과 함께 가치 상승이 기대됩니다. 토허제 지역이라 갭투자는 불가하고 실거주 목적 매수만 가능합니다. 서울 내에서 매매가가 낮은 편이라 내 집 마련 첫 진입 지역으로 적합하며, 1호선·7호선 더블 역세권과 강남 30분대 접근성이 강점입니다.",
    keywords: ["토허제 실거주", "저평가 서울", "내집마련 입문", "개발 호재"],
    color: "orange"
  },
  "중랑": {
    title: "실거주 + 교통 호재 투자 지역 (토허제)",
    strategy: "중랑구는 면목선(경전철) 개통 예정, 망우역 GTX-B 호재로 중장기 시세 상승이 기대됩니다. 토허제 지역이라 갭투자 불가, 실거주 매수만 가능합니다. 서울 동북권에서 상대적으로 저렴하며, 상봉·중화역 일대는 이미 교통 편의성이 확보되어 있어 실거주 만족도가 높습니다. 면목동·상봉동 위주로 재개발 기대감도 있습니다.",
    keywords: ["토허제 실거주", "면목선 호재", "GTX-B", "재개발 기대"],
    color: "purple"
  },
  // Seoul regions
  "강남·서초": {
    title: "프리미엄 실거주 지역 (토허제)",
    strategy: "강남·서초는 대한민국 부동산 최고 입지로, 학군·교통·상권 모두 최상급입니다. 토허제 지역이라 실거주 의무가 있으며 매매가가 높아 자본 부담이 큽니다. 그러나 하방 경직성이 강하고 장기적으로 꾸준히 우상향하는 지역입니다. 25평 이하 소형은 상대적으로 진입가가 낮아 강남 입성 전략으로 활용할 수 있습니다. 재건축 단지는 추가 상승 여력이 있습니다.",
    keywords: ["토허제 실거주", "최고 입지", "하방 경직", "재건축 프리미엄"],
    color: "red"
  },
  "동작·관악": {
    title: "강남 생활권 가성비 실거주 (토허제)",
    strategy: "동작·관악은 강남까지 20분대로 접근 가능한 가성비 좋은 실거주 지역입니다. 사당·이수역 일대는 교통 허브이며, 서울대입구·봉천 일대는 학원가와 생활 인프라가 잘 갖춰져 있습니다. 강남 대비 매매가가 절반 수준이라 서울 내 내 집 마련 1순위로 추천됩니다. 흑석 뉴타운, 노량진 개발 등 주변 호재도 있습니다.",
    keywords: ["토허제 실거주", "강남 20분", "가성비 내집마련", "개발 호재"],
    color: "blue"
  },
  "용산·성동": {
    title: "교통 최강 실거주 지역 (토허제)",
    strategy: "용산·성동은 강남·여의도·종로 3대 업무지구 모두 20분 내 접근 가능한 교통 최강 지역입니다. 옥수·금호·행당은 한강 조망과 역세권을 동시에 갖춘 단지가 많으며, 용산 국제업무지구 개발이 완성되면 추가 상승이 기대됩니다. 을지로·서울상공회의소도 15분대로 직장인 실거주에 최적입니다.",
    keywords: ["토허제 실거주", "3대 업무지구 접근", "한강 조망", "용산 개발"],
    color: "green"
  },
  "송파·강동": {
    title: "강남 동측 확장 실거주 지역 (토허제)",
    strategy: "송파·강동은 잠실 MICE 개발, 위례신도시 인접, 9호선 연장 등 대형 호재가 집중된 지역입니다. 잠실 주공5단지 재건축은 서울 최대 규모 재건축으로 주목받고 있으며, 가락·문정은 법조타운·위례 연계로 수요가 꾸준합니다. 강동은 상대적으로 저렴하지만 5호선·9호선 접근성이 좋아 실거주 만족도가 높습니다.",
    keywords: ["토허제 실거주", "잠실 재건축", "MICE 개발", "9호선 연장"],
    color: "orange"
  },
  // 5억 이하 regions
  "금천·관악": {
    title: "서울 5억 이하 실거주 최적 지역 (토허제)",
    strategy: "금천·관악은 서울에서 5억 이하로 25평 아파트를 매수할 수 있는 몇 안 되는 지역입니다. 독산역·시흥역은 1호선 강남 30분대, 봉천·신림은 2호선 강남 직통 20분대로 출퇴근이 편리합니다. 가산디지털단지 IT기업 직주근접 수요와 재건축·재개발 호재가 있어 2년 내 시세 상승이 기대됩니다. 토허제 지역이지만 실거주 목적이라면 가장 합리적인 선택입니다.",
    keywords: ["서울 5억 이하", "강남 30분대", "재건축 호재", "IT직주근접"],
    color: "orange"
  },
  "중랑·노원": {
    title: "서울 최저가 실거주 + 재건축 지역 (토허제)",
    strategy: "중랑·노원은 서울에서 가장 저렴하게 25평 아파트를 매수할 수 있는 지역입니다. 노원 상계·중계는 2.5~3.5억대로 서울 최저가이며, 대규모 재건축(2,000세대+) 추진으로 장기 시세 상승이 기대됩니다. 중랑구는 GTX-B 상봉역, 면목선 경전철 등 교통 호재가 확정되어 있어 2년 내 상승 모멘텀이 강합니다. 중계동 학군 프리미엄도 건재합니다.",
    keywords: ["서울 최저가", "대규모 재건축", "GTX-B 호재", "학군 프리미엄"],
    color: "purple"
  },
};

export function Dashboard({ apartments, lastUpdated, title = "부동산 시세 임장리스트", defaultRegion, regions }: DashboardProps) {
  const firstRegion = defaultRegion ?? (apartments[0]?.master.region as Region) ?? "평촌";
  const [selectedRegion, setSelectedRegion] = useState<Region>(firstRegion);
  const [sortBy, setSortBy] = useState<SortOption>("rankRegion");

  const filteredAndSorted = useMemo(() => {
    const filtered = apartments.filter(
      (apt) => apt.master.region === selectedRegion
    );

    const sorted = [...filtered].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (DESCENDING_SORTS.includes(sortBy)) {
        return (bVal as number) - (aVal as number);
      }
      return (aVal as number) - (bVal as number);
    });

    return sorted;
  }, [apartments, selectedRegion, sortBy]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {title}
        </h1>
        <LastUpdated date={lastUpdated} />
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <RegionTabs
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          regions={regions}
        />
        <SortSelector sortBy={sortBy} onSortChange={setSortBy} />
      </div>

      {/* Count */}
      <p className="mb-4 text-sm text-muted-foreground">
        총{" "}
        <span className="font-semibold text-foreground">
          {filteredAndSorted.length}
        </span>
        개 매물
      </p>

      {/* Investment Strategy */}
      {REGION_STRATEGIES[selectedRegion] && (
        <div className={`mb-4 rounded-lg border-l-4 p-4 ${
          REGION_STRATEGIES[selectedRegion].color === 'blue' ? 'border-l-blue-500 bg-blue-50' :
          REGION_STRATEGIES[selectedRegion].color === 'green' ? 'border-l-green-500 bg-green-50' :
          REGION_STRATEGIES[selectedRegion].color === 'orange' ? 'border-l-orange-500 bg-orange-50' :
          REGION_STRATEGIES[selectedRegion].color === 'red' ? 'border-l-red-500 bg-red-50' :
          'border-l-purple-500 bg-purple-50'
        }`}>
          <h3 className={`mb-1 text-sm font-bold ${
            REGION_STRATEGIES[selectedRegion].color === 'blue' ? 'text-blue-800' :
            REGION_STRATEGIES[selectedRegion].color === 'green' ? 'text-green-800' :
            REGION_STRATEGIES[selectedRegion].color === 'orange' ? 'text-orange-800' :
            REGION_STRATEGIES[selectedRegion].color === 'red' ? 'text-red-800' :
            'text-purple-800'
          }`}>
            📊 {REGION_STRATEGIES[selectedRegion].title}
          </h3>
          <p className="mb-2 text-sm text-gray-700 leading-relaxed">
            {REGION_STRATEGIES[selectedRegion].strategy}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {REGION_STRATEGIES[selectedRegion].keywords.map((kw) => (
              <span key={kw} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                REGION_STRATEGIES[selectedRegion].color === 'blue' ? 'bg-blue-100 text-blue-700' :
                REGION_STRATEGIES[selectedRegion].color === 'green' ? 'bg-green-100 text-green-700' :
                REGION_STRATEGIES[selectedRegion].color === 'orange' ? 'bg-orange-100 text-orange-700' :
                REGION_STRATEGIES[selectedRegion].color === 'red' ? 'bg-red-100 text-red-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Card list */}
      {filteredAndSorted.length > 0 ? (
        <div className="space-y-4">
          {filteredAndSorted.map((apt) => (
            <ApartmentCard key={apt.masterId} data={apt} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            해당 지역의 매물이 없습니다
          </p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            다른 지역을 선택해 주세요
          </p>
        </div>
      )}
    </div>
  );
}
