import { Dashboard } from "@/components/Dashboard";
import { getMockSeoulApartments, getMockSeoulLastUpdated } from "@/lib/mock-data-seoul";
import { REGIONS } from "@/lib/constants-seoul";

export default function SeoulPage() {
  const apartments = getMockSeoulApartments();
  const lastUpdated = getMockSeoulLastUpdated();

  return (
    <Dashboard
      apartments={apartments}
      lastUpdated={lastUpdated}
      title="서울 실거주 임장리스트 (25평 이하)"
      defaultRegion="강남·서초"
      regions={REGIONS}
    />
  );
}
