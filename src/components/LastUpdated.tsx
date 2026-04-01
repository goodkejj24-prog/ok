"use client";

interface LastUpdatedProps {
  date: Date | null;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day} 기준`;
}

export function LastUpdated({ date }: LastUpdatedProps) {
  const displayDate = date ?? new Date();

  return (
    <span className="text-sm text-muted-foreground">
      {formatDate(displayDate)}
    </span>
  );
}
