import type { Metadata, Viewport } from "next";
import BottomNav from "@/components/waxing/BottomNav";

export const metadata: Metadata = {
  title: "Eunjeong Waxing - 고객관리",
  description: "왁싱샵 고객관리 시스템",
  manifest: "/waxing-manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EJ Waxing",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#db2777",
};

export default function WaxingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-dvh max-w-md bg-background pb-16">
      {children}
      <BottomNav />
    </div>
  );
}
