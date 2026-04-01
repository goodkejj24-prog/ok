"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/waxing/db";
import type { Customer, Reservation } from "@/lib/waxing/types";
import { Button } from "@/components/ui/button";

export default function MessagesPageWrapper() {
  return (
    <Suspense>
      <MessagesPage />
    </Suspense>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdays[d.getDay()];
  return `${month}월 ${day}일(${weekday})`;
}

function addWeeks(dateStr: string, weeks: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + weeks * 7);
  return d.toISOString().split("T")[0];
}

function toDateString(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}

interface TemplateConfig {
  key: string;
  label: string;
  icon: string;
  color: string;
  buildMessage: (name: string, date: string, time: string) => string;
}

const templateConfigs: TemplateConfig[] = [
  {
    key: "booking",
    label: "예약확정",
    icon: "📅",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    buildMessage: (name, date, time) => `${name}님 안녕하세요 💕
${date} ${time}에 왁싱 예약이 확정되었습니다 ✨

혹시 일정 변경이 필요하시면 하루 전까지 편하게 연락주세요! 📞

안내드릴 사항이 하나 있어요 🙏
예약 시간에 맞춰 준비하고 있어서, 당일 무단 불참 시에는 노쇼비 2만원이 발생하는 점 너그러이 양해 부탁드려요 🥺
노쇼비는 시술비에서 차감되어 차액만 결제하시면 되니 부담 갖지 않으셔도 돼요! 😊

💳 카카오뱅크 3333-04-2140067 김*정

🅿️ 참고로 매장 전용 주차장이 없어서, 근처 공영주차장이나 대중교통 이용 부탁드려요!

그럼 당일 뵙겠습니다 🤗
Waxing Artist, Eunjeong 💜`,
  },
  {
    key: "dayBefore",
    label: "전날안내",
    icon: "⏰",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    buildMessage: (name, date, time) => `${name}님 안녕하세요 💕
내일 ${date} ${time} 왁싱 예약 안내드려요! 📅

시술 전 참고사항 알려드릴게요 📝
✔️ 시술 부위 면도는 하지 말아주세요 (모발 길이 0.5cm 이상 유지)
✔️ 시술 당일 보습제/오일 사용을 삼가주세요
✔️ 편한 옷차림으로 오시면 좋아요

내일 뵙겠습니다! 🤗
일정 변경이 필요하시면 오늘 중으로 연락 부탁드려요 📞
Waxing Artist, Eunjeong 💜`,
  },
  {
    key: "aftercare",
    label: "시술후 안내",
    icon: "💆",
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    buildMessage: (name) => `${name}님, 오늘 시술 감사합니다 🥰
왁싱 후 주의사항 간단히 안내드려요! 📝

🚿 24시간 내 뜨거운 물(사우나, 반신욕) 삼가주세요
👗 시술 부위 꽉 끼는 옷 피해주세요
🏊 2~3일간 격한 운동, 수영장 이용 삼가주세요
🧴 인그로운 헤어 방지를 위해 3일 후부터 부드럽게 각질 관리해주세요
💧 보습제 꾸준히 발라주시면 좋아요!

궁금한 점 있으시면 편하게 연락주세요 😊
Waxing Artist, Eunjeong 💜`,
  },
  {
    key: "reminder",
    label: "5주 뒤 재예약",
    icon: "🔔",
    color: "bg-amber-50 border-amber-200 text-amber-700",
    buildMessage: (name) => `${name}님 안녕하세요 💕
지난 시술 후 벌써 5주가 지났네요! ⏰

왁싱은 약 5주 주기로 관리해주시면 더 깔끔한 결과를 유지하실 수 있어요 ✨
편하신 시간에 예약 잡아주시면 감사하겠습니다! 🗓️

Waxing Artist, Eunjeong 💜`,
  },
];

function MessagesPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("booking");
  const [editedMessages, setEditedMessages] = useState<Record<string, string>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    db.customers.toArray().then((custs) => {
      setCustomers(custs);
      const paramId = searchParams.get("customerId");
      if (paramId) setSelectedCustomerId(paramId);
    });
    db.reservations.toArray().then(setReservations);
  }, [searchParams]);

  const selectedCustomer = customers.find((c) => String(c.id) === selectedCustomerId);
  const customerReservation = selectedCustomer
    ? reservations.find((r) => r.customerId === selectedCustomer.id && r.status === "reserved")
    : null;

  const reservationDate = customerReservation ? formatDate(customerReservation.date) : "예약일";
  const reservationTime = customerReservation ? customerReservation.time : "시간";
  const reminderDate = customerReservation
    ? formatDate(addWeeks(customerReservation.date, 5))
    : "5주 뒤 날짜";
  const customerName = selectedCustomer ? selectedCustomer.name : "고객명";

  const getMessage = (key: string) => {
    if (editedMessages[key]) return editedMessages[key];
    const config = templateConfigs.find((t) => t.key === key)!;
    return config.buildMessage(customerName, reservationDate, reservationTime);
  };

  const handleCopy = async (key: string) => {
    await navigator.clipboard.writeText(getMessage(key));
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleEditSave = (key: string, value: string) => {
    setEditedMessages((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = (key: string) => {
    setEditedMessages((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setEditingKey(null);
  };

  // 고객 선택 시 편집 내용 초기화
  const handleCustomerChange = (id: string) => {
    setSelectedCustomerId(id);
    setEditedMessages({});
    setEditingKey(null);
  };

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 px-4 py-3 backdrop-blur">
        <h1 className="text-lg font-bold">문자 템플릿</h1>
        <p className="text-xs text-muted-foreground">고객 선택 → 문자 유형 선택 → 복사 후 발송</p>
      </header>

      {/* 고객 선택 */}
      <div className="px-4 pt-4 pb-2">
        <label className="mb-1 block text-xs font-medium text-muted-foreground">고객 선택</label>
        <select
          value={selectedCustomerId}
          onChange={(e) => handleCustomerChange(e.target.value)}
          className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
        >
          <option value="">고객을 선택하세요</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.phone})
            </option>
          ))}
        </select>
        {selectedCustomer && customerReservation && (
          <div className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
            📅 예약일: {reservationDate} {reservationTime} · 5주 뒤: {reminderDate}
          </div>
        )}
        {selectedCustomer && !customerReservation && (
          <div className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-muted-foreground">
            예약 정보가 없습니다. 시술후/재예약 문자는 바로 사용 가능해요.
          </div>
        )}
      </div>

      {/* 문자 유형 탭 */}
      <div className="flex gap-1.5 overflow-x-auto px-4 py-2 scrollbar-hide">
        {templateConfigs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setSelectedType(t.key); setOpenKey(t.key); }}
            className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedType === t.key
                ? "bg-pink-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* 템플릿 카드 */}
      <div className="flex flex-col gap-3 px-4 py-3">
        {templateConfigs.map((t) => (
          <div
            key={t.key}
            className={`rounded-xl border bg-card shadow-sm overflow-hidden ${
              selectedType === t.key ? "" : "hidden"
            }`}
          >
            <div className="flex items-center gap-3 p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-lg">
                {t.icon}
              </div>
              <div className="flex-1">
                <span className="text-sm font-semibold">{t.label}</span>
                <span className="ml-2 text-[11px] text-muted-foreground">
                  {selectedCustomer ? selectedCustomer.name + "님" : "고객 미선택"}
                </span>
              </div>
            </div>

            <div className={`border-t px-4 py-4 ${t.color.split(" ")[0]}`}>
              {editingKey === t.key ? (
                <div>
                  <textarea
                    value={editedMessages[t.key] || getMessage(t.key)}
                    onChange={(e) => handleEditSave(t.key, e.target.value)}
                    className="w-full rounded-xl border-2 border-pink-200 bg-white p-3.5 text-sm leading-relaxed outline-none focus:border-pink-400"
                    rows={Math.max(8, getMessage(t.key).split("\n").length + 2)}
                    autoFocus
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => setEditingKey(null)}
                      className="rounded-lg bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      수정 완료
                    </button>
                    <button
                      onClick={() => handleReset(t.key)}
                      className="text-xs text-muted-foreground underline"
                    >
                      원본으로 되돌리기
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-lg bg-white p-3.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm cursor-pointer hover:border-pink-200"
                  onClick={() => setEditingKey(t.key)}
                >
                  {getMessage(t.key)}
                  <div className="mt-2 text-[10px] text-muted-foreground/60 text-center">
                    탭하여 수정
                  </div>
                </div>
              )}

              {editingKey !== t.key && (
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => setEditingKey(t.key)}
                  >
                    ✏️ 수정
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-pink-600 hover:bg-pink-700 text-white text-xs"
                    onClick={() => handleCopy(t.key)}
                  >
                    {copied === t.key ? "✅ 복사됨!" : "📋 전체 복사"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
