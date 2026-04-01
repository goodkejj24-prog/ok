import { Dashboard } from "@/components/Dashboard";
import { getMockApartments, getMockLastUpdated } from "@/lib/mock-data";
import { REGIONS } from "@/lib/constants";

export default function Home() {
  const apartments = getMockApartments();
  const lastUpdated = getMockLastUpdated();

  return (
    <Dashboard
      apartments={apartments}
      lastUpdated={lastUpdated}
      title="부동산 시세 임장리스트 (25평 이하)"
      defaultRegion="평촌"
      regions={REGIONS}
    />
  );
}
