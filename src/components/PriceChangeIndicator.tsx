"use client";

interface PriceChangeIndicatorProps {
  change: number;
  changeRate: number;
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

export function PriceChangeIndicator({
  change,
  changeRate,
}: PriceChangeIndicatorProps) {
  if (change > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-red-500 font-medium">
        ▲ +{formatPrice(change)} (+{changeRate.toFixed(1)}%)
      </span>
    );
  }

  if (change < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-blue-500 font-medium">
        ▼ -{formatPrice(Math.abs(change))} (-{Math.abs(changeRate).toFixed(1)}%)
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-muted-foreground font-medium">
      - 0 (0%)
    </span>
  );
}
