import { Dashboard } from "@/components/Dashboard";
import { getMockUnder5Apartments, getMockUnder5LastUpdated } from "@/lib/mock-data-under5";
import { REGIONS } from "@/lib/constants-under5";

export default function Under5Page() {
  const apartments = getMockUnder5Apartments();
  const lastUpdated = getMockUnder5LastUpdated();

  return (
    <Dashboard
      apartments={apartments}
      lastUpdated={lastUpdated}
      title="실거주 임장리스트 (25평 이하 · 5억 이하)"
      defaultRegion="금천·관악"
      regions={REGIONS}
    />
  );
}
