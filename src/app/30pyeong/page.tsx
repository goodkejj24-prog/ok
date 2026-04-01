import { Dashboard } from "@/components/Dashboard";
import { getMock30Apartments, getMock30LastUpdated } from "@/lib/mock-data-30";
import { REGIONS } from "@/lib/constants";

export default function Page30() {
  const apartments = getMock30Apartments();
  const lastUpdated = getMock30LastUpdated();

  return (
    <Dashboard
      apartments={apartments}
      lastUpdated={lastUpdated}
      title="부동산 시세 임장리스트 (30평 이하)"
      defaultRegion="평촌"
      regions={REGIONS}
    />
  );
}
