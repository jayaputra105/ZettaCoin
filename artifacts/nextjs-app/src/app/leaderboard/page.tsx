"use client";
import dynamic from "next/dynamic";

// INI JURU KUNCI: Kita bener-bener isolasi semua kodingan mewah
const LeaderboardScreen = dynamic(() => import("@/components/LeaderboardScreen"), { ssr: false });
const BottomNav = dynamic(() => import("@/components/BottomNav"), { ssr: false });
const ShootingStars = dynamic(() => import("@/components/ShootingStars"), { ssr: false });

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-black relative p-6 flex flex-col">
      <ShootingStars />
      <h1 className="text-4xl font-black text-yellow-500 italic z-10">RANKING</h1>
      <div className="z-10 relative flex-1">
        <LeaderboardScreen />
      </div>
      <BottomNav />
    </main>
  );
}
