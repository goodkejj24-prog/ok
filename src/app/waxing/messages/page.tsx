"use client";

import { useState } from "react";

const templates = [
  {
    key: "booking",
    label: "예약확정",
    icon: "📅",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    message: `홍길동님 안녕하세요 💕
4월 10일(목) 14:00에 왁싱 예약이 확정되었습니다 ✨

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
    message: `홍길동님 안녕하세요 💕
내일 4월 10일(목) 14:00 왁싱 예약 안내드려요! 📅

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
    message: `홍길동님, 오늘 시술 감사합니다 🥰
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
    message: `홍길동님 안녕하세요 💕
지난 시술 후 벌써 5주가 지났네요! ⏰

왁싱은 약 5주 주기로 관리해주시면 더 깔끔한 결과를 유지하실 수 있어요 ✨
편하신 시간에 예약 잡아주시면 감사하겠습니다! 🗓️

Waxing Artist, Eunjeong 💜`,
  },
];

export default function MessagesPage() {
  const [openKey, setOpenKey] = useState<string | null>("booking");

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 px-4 py-3 backdrop-blur">
        <h1 className="text-lg font-bold">문자 템플릿</h1>
        <p className="text-xs text-muted-foreground">4종 안내 문자 미리보기</p>
      </header>

      <div className="flex flex-col gap-3 px-4 py-4">
        {templates.map((t) => (
          <div key={t.key} className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <button
              onClick={() => setOpenKey(openKey === t.key ? null : t.key)}
              className="flex w-full items-center gap-3 p-3.5 text-left"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-lg">
                {t.icon}
              </div>
              <div className="flex-1">
                <span className="text-sm font-semibold">{t.label}</span>
              </div>
              <svg
                className={`size-4 text-muted-foreground transition-transform ${openKey === t.key ? "rotate-180" : ""}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {openKey === t.key && (
              <div className={`border-t px-4 py-4 ${t.color.split(" ")[0]}`}>
                <div className="mb-2">
                  <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${t.color}`}>
                    {t.label}
                  </span>
                </div>
                <div className="rounded-lg bg-white p-3.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm">
                  {t.message}
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  * 실제 발송 시 고객명, 날짜, 시간이 자동으로 채워집니다
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
