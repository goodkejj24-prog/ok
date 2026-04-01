"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PriceChangeIndicator } from "@/components/PriceChangeIndicator";
import type { ApartmentCardData } from "@/lib/types";

interface ApartmentCardProps {
  data: ApartmentCardData;
}

function formatPrice(price: number): string {
  const abs = Math.abs(price);
  const eok = Math.floor(abs / 10000);
  const man = abs % 10000;

  if (eok > 0 && man > 0) {
    return `${eok}억 ${man.toLocaleString()}만`;
  } else if (eok > 0) {
    return `${eok}억`;
  } else {
    return `${man.toLocaleString()}만`;
  }
}

function m2ToPyeong(m2: number): string {
  return (m2 / 3.3058).toFixed(1);
}

function getRankStyle(rank: number): string {
  if (rank === 1) return "bg-yellow-500 text-white";
  if (rank === 2) return "bg-gray-400 text-white";
  if (rank === 3) return "bg-amber-700 text-white";
  return "bg-muted text-muted-foreground";
}

export function ApartmentCard({ data }: ApartmentCardProps) {
  const { master } = data;
  const isGap = data.investType === "갭투자 가능";

  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start gap-3">
          {/* Rank badge */}
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${getRankStyle(data.rankRegion)}`}
          >
            #{data.rankRegion}
          </div>

          <div className="min-w-0 flex-1">
            {/* Name and meta */}
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg font-semibold">
                {master.name}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <span>{master.builtYear}년</span>
                <span className="text-border">|</span>
                <span>{master.totalHouseholds.toLocaleString()}세대</span>
                <span className="text-border">|</span>
                <span>{master.hallwayType}</span>
              </div>
            </div>

            {/* Address */}
            <p className="mt-0.5 text-sm text-muted-foreground truncate">
              {master.address}
            </p>

            {/* Invest type badge */}
            <div className="mt-2">
              {isGap ? (
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                  갭투자 가능
                </Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800">
                  실거주(토허제지역)
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Popularity row */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">관심도</span>
            <span className="text-sm font-semibold">
              {data.naverInterestCount.toLocaleString()}명
            </span>
          </div>
          <div className="flex flex-1 items-center gap-2">
            <span className="text-sm text-muted-foreground">입지점수</span>
            <div className="flex flex-1 items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
                  style={{ width: `${Math.min(data.locationScore, 100)}%` }}
                />
              </div>
              <span className="text-sm font-semibold tabular-nums">
                {data.locationScore}
              </span>
            </div>
          </div>
        </div>

        {/* 2년 투자 적합도 */}
        {data.investScore2Y > 0 && (
          <>
            <Separator />
            <div className="px-4 py-3">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-gray-600">📈 2년 투자 적합도</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  data.investScore2Y >= 80 ? 'bg-green-100 text-green-700' :
                  data.investScore2Y >= 70 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {data.investScore2Y >= 80 ? '상승 유망' : data.investScore2Y >= 70 ? '보통' : '관망'}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      data.investScore2Y >= 80 ? 'bg-green-500' :
                      data.investScore2Y >= 70 ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`}
                    style={{ width: `${data.investScore2Y}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-800 w-8">{data.investScore2Y}</span>
              </div>
              {data.investRationale && data.investRationale.length > 0 && (
                <ul className="space-y-0.5">
                  {data.investRationale.map((r, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        <Separator />

        {/* Price section */}
        <div className="grid gap-3">
          {/* 매매가 */}
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                매매가
              </span>
              <span className="text-lg font-bold">
                {formatPrice(data.currentPrice)}
              </span>
            </div>
            <PriceChangeIndicator
              change={data.priceChange}
              changeRate={data.priceChangeRate}
            />
          </div>

          {/* 전세가 + 매물수 */}
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                전세가
              </span>
              <span className="text-base font-semibold">
                {formatPrice(data.jeonsePrice)}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              매물{" "}
              <span className="font-medium text-foreground">
                {data.jeonseListingCount}건
              </span>
            </span>
          </div>

          {/* 갭 + 전세가율 */}
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                갭
              </span>
              <span className="text-base font-semibold text-violet-600 dark:text-violet-400">
                {formatPrice(data.gap)}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                전세가율
              </span>
              <span className="text-base font-semibold">
                {data.jeonseRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Real investment */}
        <div className="rounded-lg bg-muted/60 px-3 py-2.5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-sm font-medium">
              {isGap ? "실투자금 (갭투자)" : "필요자본 (토허제)"}
            </span>
            <span className="text-lg font-bold text-violet-600 dark:text-violet-400">
              {formatPrice(data.realInvestment)}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            <span>
              갭: {formatPrice(data.gap)}
            </span>
            <span>
              취득세: {formatPrice(data.acquisitionTax)}
            </span>
            <span>
              중개료: {formatPrice(data.brokerageFee)}
            </span>
          </div>
        </div>

        <Separator />

        {/* Details row */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
          <div>
            <span className="text-muted-foreground">난방</span>
            <p className="font-medium">{master.heatingType}</p>
          </div>
          <div>
            <span className="text-muted-foreground">관리비</span>
            <p className="font-medium">
              {master.avgMaintenanceFee.toLocaleString()}원
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">방/면적</span>
            <p className="font-medium">
              {master.roomCount}룸 / {m2ToPyeong(master.exclusiveArea)}평
              <span className="text-xs text-muted-foreground ml-0.5">
                ({master.exclusiveArea}m²)
              </span>
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">총점</span>
            <p className="font-medium">{data.totalScore}점</p>
          </div>
        </div>
      </CardContent>

      {/* Infrastructure footer */}
      <CardFooter className="flex-col items-start gap-2">
        {/* Station */}
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs dark:bg-blue-900/40 dark:text-blue-400">
            🚇
          </span>
          <span className="font-medium">{master.nearestStation}</span>
          <span className="text-muted-foreground">
            도보 {master.stationWalkMin}분
          </span>
        </div>

        {/* Gangnam commute */}
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xs dark:bg-purple-900/40 dark:text-purple-400">
            🏢
          </span>
          <span className="font-medium">강남역 대중교통</span>
          <span className="text-muted-foreground">
            {master.gangnamCommuteMin}분
          </span>
        </div>

        {/* Seoul Chamber of Commerce commute */}
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-600 text-xs dark:bg-teal-900/40 dark:text-teal-400">
            🏛
          </span>
          <span className="font-medium">서울상공회의소 대중교통</span>
          <span className="text-muted-foreground">
            {master.seoulChamberCommuteMin}분
          </span>
        </div>

        {/* Schools */}
        {master.schools.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs dark:bg-green-900/40 dark:text-green-400">
              🏫
            </span>
            {master.schools.map((school, i) => (
              <span key={i} className="text-muted-foreground">
                <span className="font-medium text-foreground">
                  {school.name}
                </span>
                <span className="text-xs">
                  ({school.type}, {school.distance})
                </span>
                {i < master.schools.length - 1 && (
                  <span className="ml-1 text-border">·</span>
                )}
              </span>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
