"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Panggil semua komponen mewah lu di sini
const ShootingStars = dynamic(() => import("@/components/ShootingStars"), { ssr: false });
const CoinClicker = dynamic(() => import("@/components/CoinClicker"), { ssr: false });
const BottomNav = dynamic(() => import("@/components/BottomNav"), { ssr: false });

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // JANGAN KASIH NEXT.JS LIAT KODINGAN MEWAH LU PAS BUILD
  if (!isClient) {
    return <div className="min-h-screen bg-black" />;
  }

  // SEMUA TAMPILAN MEWAH TARO DI SINI
  return (
    <main className="relative min-h-screen w-full bg-black overflow-hidden flex flex-col">
      <ShootingStars />
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black text-yellow-500 italic mb-10">ZETTA GOLD</h1>
        <CoinClicker onCoin={() => {}} locked={false} />
      </div>
      <BottomNav />
    </main>
  );
}
