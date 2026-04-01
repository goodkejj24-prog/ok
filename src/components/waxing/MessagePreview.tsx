"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { MessageTarget } from "@/lib/waxing/types";

interface Props {
  target: MessageTarget;
  onClose: () => void;
  onMarkSent: () => void;
}

export default function MessagePreview({ target, onClose, onMarkSent }: Props) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(target.message);

  const currentMessage = editing ? editedMessage : target.message;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setEditedMessage(target.message);
  };

  const typeLabel = {
    booking: "예약확정 안내",
    dayBefore: "예약 전날 안내",
    aftercare: "시술 후 주의사항",
    reminder: "재예약 리마인더",
  }[target.type];

  const typeColor = {
    booking: "bg-blue-50 text-blue-700 border-blue-200",
    dayBefore: "bg-purple-50 text-purple-700 border-purple-200",
    aftercare: "bg-emerald-50 text-emerald-700 border-emerald-200",
    reminder: "bg-amber-50 text-amber-700 border-amber-200",
  }[target.type];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-md animate-in slide-in-from-bottom rounded-t-2xl bg-background p-5 pb-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${typeColor}`}>
              {typeLabel}
            </span>
            <span className="text-sm font-medium">{target.customer.name}님</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Phone number + Edit toggle */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            받는 사람: {target.customer.phone}
          </span>
          <button
            onClick={() => setEditing(!editing)}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
              editing
                ? "bg-pink-100 text-pink-700"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
            {editing ? "수정중" : "수정"}
          </button>
        </div>

        {/* Message content - view or edit */}
        {editing ? (
          <div className="mb-2">
            <textarea
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              className="w-full rounded-xl border-2 border-pink-200 bg-white p-4 text-sm leading-relaxed outline-none focus:border-pink-400 transition-colors"
              rows={Math.max(8, editedMessage.split("\n").length + 2)}
              autoFocus
            />
            <div className="flex justify-end mt-1">
              <button
                onClick={handleReset}
                className="text-[11px] text-muted-foreground hover:text-foreground underline"
              >
                원래 내용으로 되돌리기
              </button>
            </div>
          </div>
        ) : (
          <div
            className="mb-4 max-h-[50vh] overflow-y-auto rounded-xl border bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap cursor-pointer hover:border-pink-200 transition-colors"
            onClick={() => setEditing(true)}
          >
            {currentMessage}
            <div className="mt-2 text-[10px] text-muted-foreground/60 text-center">
              탭하여 수정
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 h-11 text-base"
            onClick={handleCopy}
          >
            {copied ? "복사됨!" : "문자 복사"}
          </Button>
          <Button
            size="lg"
            className="flex-1 h-11 text-base bg-pink-600 hover:bg-pink-700 text-white"
            onClick={() => {
              onMarkSent();
              onClose();
            }}
          >
            발송 완료
          </Button>
        </div>
      </div>
    </div>
  );
}
