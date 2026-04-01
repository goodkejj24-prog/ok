"use client";

import { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/waxing/db";
import type { Customer, Reservation, MessageTarget, MessageType } from "@/lib/waxing/types";
import { bookingMessage, dayBeforeMessage, aftercareMessage, reminderMessage } from "@/lib/waxing/message-templates";
import { isReminderDue, isTomorrow, weeksAgo, daysSince } from "@/lib/waxing/date-utils";
import MessagePreview from "@/components/waxing/MessagePreview";

type Tab = "all" | "booking" | "dayBefore" | "aftercare" | "reminder";

interface CustomerSchedule {
  customer: Customer;
  reservation?: Reservation;       // 가장 최근 예약
  lastCompleted?: Reservation;     // 가장 최근 시술완료
  nextVisitDate?: string;          // 5주 뒤 날짜
  daysUntilNext?: number;          // 5주 뒤까지 남은 일수
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return `${month}/${day}(${weekdays[d.getDay()]})`;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function DashboardPage() {
  const [targets, setTargets] = useState<MessageTarget[]>([]);
  const [schedules, setSchedules] = useState<CustomerSchedule[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [selectedTarget, setSelectedTarget] = useState<MessageTarget | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSchedule, setShowSchedule] = useState(true);

  const loadTargets = useCallback(async () => {
    const customers = await db.customers.toArray();
    const customerMap = new Map(customers.map((c) => [c.id!, c]));
    const reservations = await db.reservations.toArray();

    // 문자 대상 목록
    const result: MessageTarget[] = [];

    for (const r of reservations) {
      const customer = customerMap.get(r.customerId);
      if (!customer) continue;

      if (r.status === "reserved" && r.msgBooking === "pending") {
        result.push({ type: "booking", customer, reservation: r, message: bookingMessage(customer, r) });
      }
      if (r.status === "reserved" && r.msgDayBefore === "pending" && isTomorrow(r.date)) {
        result.push({ type: "dayBefore", customer, reservation: r, message: dayBeforeMessage(customer, r) });
      }
      if (r.status === "completed" && r.msgAftercare === "pending") {
        result.push({ type: "aftercare", customer, reservation: r, message: aftercareMessage(customer) });
      }
      if (r.status === "completed" && r.completedAt && r.msgReminder === "pending" && isReminderDue(r.completedAt)) {
        const hasNew = reservations.some((o) => o.customerId === r.customerId && o.id !== r.id && o.status === "reserved");
        if (!hasNew) {
          result.push({ type: "reminder", customer, reservation: r, message: reminderMessage(customer) });
        }
      }
    }

    // 고객별 스케줄
    const scheduleList: CustomerSchedule[] = [];
    for (const customer of customers) {
      const custReservations = reservations.filter((r) => r.customerId === customer.id);
      const reserved = custReservations
        .filter((r) => r.status === "reserved")
        .sort((a, b) => a.date.localeCompare(b.date));
      const completed = custReservations
        .filter((r) => r.status === "completed" && r.completedAt)
        .sort((a, b) => (b.completedAt || "").localeCompare(a.completedAt || ""));

      const latestReservation = reserved[0];
      const lastCompleted = completed[0];

      let nextVisitDate: string | undefined;
      let daysUntilNext: number | undefined;

      if (lastCompleted?.completedAt) {
        nextVisitDate = addDays(lastCompleted.completedAt.split("T")[0], 35);
        daysUntilNext = -daysSince(nextVisitDate);
      }

      scheduleList.push({
        customer,
        reservation: latestReservation,
        lastCompleted,
        nextVisitDate,
        daysUntilNext,
      });
    }

    // 5주 뒤 날짜 가까운 순 정렬
    scheduleList.sort((a, b) => {
      if (a.daysUntilNext === undefined && b.daysUntilNext === undefined) return 0;
      if (a.daysUntilNext === undefined) return 1;
      if (b.daysUntilNext === undefined) return -1;
      return a.daysUntilNext - b.daysUntilNext;
    });

    setTargets(result);
    setSchedules(scheduleList);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTargets();
  }, [loadTargets]);

  const handleMarkSent = async (target: MessageTarget) => {
    const fieldMap: Record<MessageType, string> = {
      booking: "msgBooking",
      dayBefore: "msgDayBefore",
      aftercare: "msgAftercare",
      reminder: "msgReminder",
    };
    await db.reservations.update(target.reservation.id!, { [fieldMap[target.type]]: "sent" });
    loadTargets();
  };

  const filtered = activeTab === "all" ? targets : targets.filter((t) => t.type === activeTab);

  const counts: Record<Tab, number> = {
    all: targets.length,
    booking: targets.filter((t) => t.type === "booking").length,
    dayBefore: targets.filter((t) => t.type === "dayBefore").length,
    aftercare: targets.filter((t) => t.type === "aftercare").length,
    reminder: targets.filter((t) => t.type === "reminder").length,
  };

  const tabs: { key: Tab; label: string; color: string; activeColor: string }[] = [
    { key: "all", label: "전체", color: "bg-gray-100 text-gray-600", activeColor: "bg-pink-600 text-white" },
    { key: "booking", label: "예약확정", color: "bg-blue-50 text-blue-600", activeColor: "bg-blue-600 text-white" },
    { key: "dayBefore", label: "전날안내", color: "bg-purple-50 text-purple-600", activeColor: "bg-purple-600 text-white" },
    { key: "aftercare", label: "시술후", color: "bg-emerald-50 text-emerald-600", activeColor: "bg-emerald-600 text-white" },
    { key: "reminder", label: "재예약", color: "bg-amber-50 text-amber-600", activeColor: "bg-amber-600 text-white" },
  ];

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 px-4 py-3 backdrop-blur">
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-pink-600">EJ</span> Waxing
        </h1>
        <p className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
        </p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-1.5 px-4 py-3">
        <SummaryCard count={counts.booking} label="예약확정" color="blue" />
        <SummaryCard count={counts.dayBefore} label="전날안내" color="purple" />
        <SummaryCard count={counts.aftercare} label="시술후" color="emerald" />
        <SummaryCard count={counts.reminder} label="재예약" color="amber" />
      </div>

      {/* 고객 관리 스케줄 */}
      <div className="px-4 pb-2">
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="flex w-full items-center justify-between rounded-lg bg-pink-50 px-3 py-2"
        >
          <span className="text-xs font-bold text-pink-700">📋 고객별 관리 현황</span>
          <svg
            className={`size-4 text-pink-400 transition-transform ${showSchedule ? "rotate-180" : ""}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {showSchedule && (
          <div className="mt-2 flex flex-col gap-1.5">
            {schedules.length === 0 ? (
              <div className="py-4 text-center text-xs text-muted-foreground">등록된 고객이 없습니다</div>
            ) : (
              schedules.map((s) => (
                <div key={s.customer.id} className="flex items-center gap-2.5 rounded-lg border bg-card px-3 py-2.5 shadow-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xs font-bold text-pink-600">
                    {s.customer.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold">{s.customer.name}</span>
                      {s.daysUntilNext !== undefined && s.daysUntilNext <= 0 && (
                        <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-600">재예약 필요</span>
                      )}
                      {s.daysUntilNext !== undefined && s.daysUntilNext > 0 && s.daysUntilNext <= 7 && (
                        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-600">{s.daysUntilNext}일 후</span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-0.5 text-[10px] text-muted-foreground">
                      {s.reservation && (
                        <span className="text-blue-600">📅 예약 {formatDate(s.reservation.date)}</span>
                      )}
                      {s.lastCompleted?.completedAt && (
                        <span className="text-emerald-600">✅ 시술 {formatDate(s.lastCompleted.completedAt.split("T")[0])}</span>
                      )}
                      {s.nextVisitDate && (
                        <span className={s.daysUntilNext !== undefined && s.daysUntilNext <= 0 ? "text-red-600 font-semibold" : "text-amber-600"}>
                          🔔 {formatDate(s.nextVisitDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Tab Filter */}
      <div className="flex gap-1.5 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === tab.key ? tab.activeColor : tab.color
            }`}
          >
            {tab.label}
            {counts[tab.key] > 0 && (
              <span className={`inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                activeTab === tab.key ? "bg-white/25 text-white" : "bg-current/10"
              }`}>
                {counts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Message Target List */}
      <div className="flex flex-col gap-2 px-4 py-2">
        {loading ? (
          <div className="py-20 text-center text-sm text-muted-foreground">불러오는 중...</div>
        ) : filtered.length === 0 ? (
          <EmptyState activeTab={activeTab} />
        ) : (
          filtered.map((target, i) => (
            <MessageCard
              key={`${target.reservation.id}-${target.type}`}
              target={target}
              onSelect={() => setSelectedTarget(target)}
              index={i}
            />
          ))
        )}
      </div>

      {/* Message Preview Modal */}
      {selectedTarget && (
        <MessagePreview
          target={selectedTarget}
          onClose={() => setSelectedTarget(null)}
          onMarkSent={() => handleMarkSent(selectedTarget)}
        />
      )}
    </div>
  );
}

function SummaryCard({ count, label, color }: { count: number; label: string; color: string }) {
  const colors: Record<string, { bg: string; text: string; accent: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-700", accent: "text-blue-600" },
    purple: { bg: "bg-purple-50", text: "text-purple-700", accent: "text-purple-600" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", accent: "text-emerald-600" },
    amber: { bg: "bg-amber-50", text: "text-amber-700", accent: "text-amber-600" },
  };
  const c = colors[color];

  return (
    <div className={`rounded-xl ${c.bg} p-2.5 text-center`}>
      <div className={`text-xl font-bold ${c.accent}`}>{count}</div>
      <div className={`text-[10px] font-medium ${c.text}`}>{label}</div>
    </div>
  );
}

function MessageCard({
  target,
  onSelect,
  index,
}: {
  target: MessageTarget;
  onSelect: () => void;
  index: number;
}) {
  const config: Record<MessageType, { badge: string; badgeColor: string; icon: string; desc: string }> = {
    booking: {
      badge: "예약확정",
      badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
      icon: "📅",
      desc: `${target.reservation.date} ${target.reservation.time} 예약`,
    },
    dayBefore: {
      badge: "전날안내",
      badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
      icon: "⏰",
      desc: `내일 ${target.reservation.time} 예약 - 전날 안내`,
    },
    aftercare: {
      badge: "시술후",
      badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: "💆",
      desc: "시술 완료 - 주의사항 안내",
    },
    reminder: {
      badge: "재예약",
      badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
      icon: "🔔",
      desc: target.reservation.completedAt
        ? `시술 후 ${weeksAgo(target.reservation.completedAt)}주 경과`
        : "재예약 안내",
    },
  };
  const c = config[target.type];

  return (
    <button
      onClick={onSelect}
      className="flex items-center gap-3 rounded-xl border bg-card p-3.5 text-left shadow-sm transition-all active:scale-[0.98] active:bg-muted/50"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-lg">
        {c.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold truncate">{target.customer.name}</span>
          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${c.badgeColor}`}>
            {c.badge}
          </span>
        </div>
        <div className="text-xs text-muted-foreground truncate">{c.desc}</div>
      </div>
      <div className="shrink-0 text-muted-foreground">
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </button>
  );
}

function EmptyState({ activeTab }: { activeTab: Tab }) {
  const messages: Record<Tab, string> = {
    all: "오늘 보낼 문자가 없습니다",
    booking: "예약확정 안내 대상이 없습니다",
    dayBefore: "내일 예약 고객이 없습니다",
    aftercare: "시술 후 안내 대상이 없습니다",
    reminder: "재예약 리마인더 대상이 없습니다",
  };
  const icons: Record<Tab, string> = {
    all: "✨",
    booking: "📅",
    dayBefore: "⏰",
    aftercare: "💆",
    reminder: "🔔",
  };
  return (
    <div className="flex flex-col items-center py-20 text-muted-foreground">
      <div className="mb-3 text-4xl">{icons[activeTab]}</div>
      <p className="text-sm">{messages[activeTab]}</p>
    </div>
  );
}
