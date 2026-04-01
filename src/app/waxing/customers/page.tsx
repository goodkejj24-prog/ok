"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/waxing/db";
import type { Customer, Reservation } from "@/lib/waxing/types";
import { Button } from "@/components/ui/button";

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [reservationCounts, setReservationCounts] = useState<Map<number, number>>(new Map());
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", memo: "" });

  const load = async () => {
    const list = await db.customers.orderBy("createdAt").reverse().toArray();
    setCustomers(list);
    const reservations = await db.reservations.toArray();
    const counts = new Map<number, number>();
    for (const r of reservations) {
      counts.set(r.customerId, (counts.get(r.customerId) || 0) + 1);
    }
    setReservationCounts(counts);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    if (editingCustomer) {
      await db.customers.update(editingCustomer.id!, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        memo: form.memo.trim() || undefined,
      });
    } else {
      await db.customers.add({
        name: form.name.trim(),
        phone: form.phone.trim(),
        memo: form.memo.trim() || undefined,
        createdAt: new Date().toISOString(),
      });
    }
    setForm({ name: "", phone: "", memo: "" });
    setShowForm(false);
    setEditingCustomer(null);
    load();
  };

  const handleEdit = (c: Customer) => {
    setEditingCustomer(c);
    setForm({ name: c.name, phone: c.phone, memo: c.memo || "" });
    setShowForm(true);
  };

  const handleDelete = async (c: Customer) => {
    if (!confirm(`${c.name}님을 삭제하시겠습니까? 관련 예약도 모두 삭제됩니다.`)) return;
    await db.reservations.where("customerId").equals(c.id!).delete();
    await db.customers.delete(c.id!);
    load();
  };

  const handleSendMessage = (c: Customer) => {
    router.push(`/waxing/messages?customerId=${c.id}`);
  };

  const filtered = customers.filter(
    (c) => c.name.includes(search) || c.phone.includes(search)
  );

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur">
        <h1 className="text-lg font-bold">고객 관리</h1>
        <Button
          size="sm"
          className="bg-pink-600 hover:bg-pink-700 text-white"
          onClick={() => {
            setEditingCustomer(null);
            setForm({ name: "", phone: "", memo: "" });
            setShowForm(true);
          }}
        >
          + 신규 등록
        </Button>
      </header>

      {/* Search */}
      <div className="px-4 py-3">
        <input
          type="text"
          placeholder="이름 또는 연락처 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
        />
      </div>

      {/* Customer List */}
      <div className="flex flex-col gap-2 px-4">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-sm text-muted-foreground">
            {customers.length === 0 ? "등록된 고객이 없습니다" : "검색 결과가 없습니다"}
          </div>
        ) : (
          filtered.map((c) => (
            <div key={c.id} className="rounded-xl border bg-card p-3.5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-600">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{c.name}</span>
                    <span className="text-[11px] text-muted-foreground">
                      시술 {reservationCounts.get(c.id!) || 0}회
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">{c.phone}</div>
                  {c.memo && <div className="mt-0.5 text-xs text-muted-foreground/70 truncate">{c.memo}</div>}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => handleEdit(c)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(c)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500">
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                  </button>
                </div>
              </div>
              {/* 문자 보내기 버튼 */}
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white text-xs"
                  onClick={() => handleSendMessage(c)}
                >
                  💬 문자 보내기
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md rounded-t-2xl bg-background p-5 pb-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-base font-bold">
              {editingCustomer ? "고객 정보 수정" : "신규 고객 등록"}
            </h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">이름 *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="고객 이름"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                  autoFocus
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">연락처 *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="010-0000-0000"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">메모</label>
                <input
                  type="text"
                  value={form.memo}
                  onChange={(e) => setForm({ ...form, memo: e.target.value })}
                  placeholder="특이사항, 알레르기 등"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                />
              </div>
              <Button
                size="lg"
                className="mt-2 h-11 w-full bg-pink-600 text-base text-white hover:bg-pink-700"
                onClick={handleSubmit}
              >
                {editingCustomer ? "수정 완료" : "등록하기"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
