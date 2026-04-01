"use client";

import { useState } from "react";
import { db } from "@/lib/waxing/db";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [importStatus, setImportStatus] = useState<string>("");

  const handleExport = async () => {
    const customers = await db.customers.toArray();
    const reservations = await db.reservations.toArray();
    const data = { customers, reservations, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waxing-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data.customers || !data.reservations) {
        setImportStatus("올바른 백업 파일이 아닙니다.");
        return;
      }
      if (!confirm(`고객 ${data.customers.length}명, 예약 ${data.reservations.length}건을 복원합니다. 기존 데이터가 삭제됩니다. 계속하시겠습니까?`)) return;
      await db.customers.clear();
      await db.reservations.clear();
      await db.customers.bulkAdd(data.customers);
      await db.reservations.bulkAdd(data.reservations);
      setImportStatus(`복원 완료! 고객 ${data.customers.length}명, 예약 ${data.reservations.length}건`);
    } catch {
      setImportStatus("파일을 읽을 수 없습니다.");
    }
    e.target.value = "";
  };

  const handleClearAll = async () => {
    if (!confirm("모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;
    if (!confirm("정말로 삭제하시겠습니까? 백업을 먼저 하셨나요?")) return;
    await db.customers.clear();
    await db.reservations.clear();
    setImportStatus("모든 데이터가 삭제되었습니다.");
  };

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 px-4 py-3 backdrop-blur">
        <h1 className="text-lg font-bold">설정</h1>
      </header>

      <div className="flex flex-col gap-4 px-4 py-4">
        {/* Backup */}
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="mb-1 text-sm font-bold">데이터 백업</h2>
          <p className="mb-3 text-xs text-muted-foreground">
            고객 정보와 예약 데이터를 JSON 파일로 저장합니다.
          </p>
          <Button
            size="lg"
            className="w-full h-11 bg-pink-600 text-white hover:bg-pink-700"
            onClick={handleExport}
          >
            백업 파일 다운로드
          </Button>
        </div>

        {/* Restore */}
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="mb-1 text-sm font-bold">데이터 복원</h2>
          <p className="mb-3 text-xs text-muted-foreground">
            백업 파일에서 데이터를 복원합니다. 기존 데이터는 덮어씌워집니다.
          </p>
          <label className="flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-sm font-medium text-muted-foreground transition-colors hover:border-pink-300 hover:text-pink-600">
            백업 파일 선택
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>

        {importStatus && (
          <div className="rounded-lg bg-muted p-3 text-center text-sm">{importStatus}</div>
        )}

        {/* Danger Zone */}
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
          <h2 className="mb-1 text-sm font-bold text-red-600">데이터 초기화</h2>
          <p className="mb-3 text-xs text-muted-foreground">
            모든 고객 및 예약 데이터가 영구 삭제됩니다.
          </p>
          <Button
            variant="destructive"
            size="lg"
            className="w-full h-11"
            onClick={handleClearAll}
          >
            전체 데이터 삭제
          </Button>
        </div>

        {/* App Info */}
        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p className="font-medium">EJ Waxing CRM v1.0</p>
          <p>by Eunjeong</p>
        </div>
      </div>
    </div>
  );
}
