"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/waxing/db";
import type { Customer, Reservation } from "@/lib/waxing/types";
import { Button } from "@/components/ui/button";
import { toDateString } from "@/lib/waxing/date-utils";

type Filter = "all" | "reserved" | "completed";

export default function ReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<(Reservation & { customerName: string; customerId: number })[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [showForm, setShowForm] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [form, setForm] = useState({
    customerId: "",
    newName: "",
    newPhone: "",
    date: toDateString(),
    time: "14:00",
    area: "브라질리언",
  });

  const load = async () => {
    const custs = await db.customers.toArray();
    setCustomers(custs);
    const custMap = new Map(custs.map((c) => [c.id!, c.name]));
    const list = await db.reservations.orderBy("date").reverse().toArray();
    setReservations(
      list.map((r) => ({ ...r, customerName: custMap.get(r.customerId) || "알 수 없음" }))
    );
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    let customerId: number;

    if (isNewCustomer) {
      if (!form.newName.trim() || !form.newPhone.trim()) return;
      customerId = await db.customers.add({
        name: form.newName.trim(),
        phone: form.newPhone.trim(),
        createdAt: new Date().toISOString(),
      }) as number;
    } else {
      if (!form.customerId) return;
      customerId = Number(form.customerId);
    }

    if (!form.date || !form.time) return;

    await db.reservations.add({
      customerId,
      date: form.date,
      time: form.time,
      area: form.area.trim() || "왁싱",
      status: "reserved",
      msgBooking: "pending",
      msgDayBefore: "pending",
      msgAftercare: "na",
      msgReminder: "na",
      createdAt: new Date().toISOString(),
    });
    setForm({ customerId: "", newName: "", newPhone: "", date: toDateString(), time: "14:00", area: "브라질리언" });
    setIsNewCustomer(false);
    setShowForm(false);
    load();
  };

  const handleComplete = async (r: Reservation) => {
    // 예약일을 시술일로 사용 (예약일에 시술한 것으로 체크)
    await db.reservations.update(r.id!, {
      status: "completed",
      completedAt: r.date + "T00:00:00",
      msgAftercare: "pending",
      msgReminder: "pending",
    });
    load();
  };

  const handleNoShow = async (r: Reservation) => {
    if (!confirm("노쇼 처리하시겠습니까?")) return;
    await db.reservations.update(r.id!, { status: "noshow" });
    load();
  };

  const handleCancel = async (r: Reservation) => {
    if (!confirm("예약을 취소하시겠습니까?")) return;
    await db.reservations.update(r.id!, { status: "cancelled" });
    load();
  };

  const filtered = reservations.filter((r) => {
    if (filter === "reserved") return r.status === "reserved";
    if (filter === "completed") return r.status === "completed";
    return true;
  });

  const statusConfig: Record<string, { label: string; color: string }> = {
    reserved: { label: "예약중", color: "bg-blue-100 text-blue-700" },
    completed: { label: "시술완료", color: "bg-emerald-100 text-emerald-700" },
    cancelled: { label: "취소", color: "bg-gray-100 text-gray-500" },
    noshow: { label: "노쇼", color: "bg-red-100 text-red-600" },
  };

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "전체" },
    { key: "reserved", label: "예약중" },
    { key: "completed", label: "시술완료" },
  ];

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur">
        <h1 className="text-lg font-bold">예약 관리</h1>
        <Button
          size="sm"
          className="bg-pink-600 hover:bg-pink-700 text-white"
          onClick={() => {
            setForm({ customerId: "", newName: "", newPhone: "", date: toDateString(), time: "14:00", area: "브라질리언" });
            setIsNewCustomer(false);
            setShowForm(true);
          }}
        >
          + 새 예약
        </Button>
      </header>

      {/* Filter */}
      <div className="flex gap-2 px-4 py-3">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              filter === f.key ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Reservation List */}
      <div className="flex flex-col gap-2 px-4">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-sm text-muted-foreground">예약이 없습니다</div>
        ) : (
          filtered.map((r) => {
            const sc = statusConfig[r.status];
            return (
              <div key={r.id} className="rounded-xl border bg-card p-3.5 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{r.customerName}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${sc.color}`}>
                        {sc.label}
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {r.date} {r.time} · {r.area}
                    </div>
                  </div>
                </div>
                {r.status === "reserved" && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                      onClick={() => handleComplete(r)}
                    >
                      ✅ 시술 완료
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-pink-600 hover:bg-pink-700 text-white text-xs"
                      onClick={() => router.push(`/waxing/messages?customerId=${r.customerId}`)}
                    >
                      💬 문자
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => handleNoShow(r)}>
                      노쇼
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => handleCancel(r)}>
                      취소
                    </Button>
                  </div>
                )}
                {r.status === "completed" && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-pink-600 hover:bg-pink-700 text-white text-xs"
                      onClick={() => router.push(`/waxing/messages?customerId=${r.customerId}`)}
                    >
                      💬 문자 보내기
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* New Reservation Form */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md rounded-t-2xl bg-background p-5 pb-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-base font-bold">새 예약 등록</h2>
            <div className="flex flex-col gap-3">

              {/* Customer toggle: 기존 / 신규 */}
              <div className="flex gap-2 mb-1">
                <button
                  onClick={() => setIsNewCustomer(false)}
                  className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                    !isNewCustomer ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  기존 고객
                </button>
                <button
                  onClick={() => setIsNewCustomer(true)}
                  className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                    isNewCustomer ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  + 신규 고객
                </button>
              </div>

              {isNewCustomer ? (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">이름 *</label>
                    <input
                      type="text"
                      value={form.newName}
                      onChange={(e) => setForm({ ...form, newName: e.target.value })}
                      placeholder="고객 이름"
                      className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">연락처 *</label>
                    <input
                      type="tel"
                      value={form.newPhone}
                      onChange={(e) => setForm({ ...form, newPhone: e.target.value })}
                      placeholder="010-0000-0000"
                      className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">고객 선택 *</label>
                  <select
                    value={form.customerId}
                    onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                  >
                    <option value="">고객을 선택하세요</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">예약일 *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">시간 *</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">시술 부위</label>
                <select
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                >
                  <option value="브라질리언">브라질리언</option>
                  <option value="겨드랑이">겨드랑이</option>
                  <option value="팔">팔</option>
                  <option value="다리">다리</option>
                  <option value="등">등</option>
                  <option value="페이스">페이스</option>
                  <option value="전신">전신</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <Button
                size="lg"
                className="mt-2 h-11 w-full bg-pink-600 text-base text-white hover:bg-pink-700"
                onClick={handleSubmit}
              >
                예약 등록
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
