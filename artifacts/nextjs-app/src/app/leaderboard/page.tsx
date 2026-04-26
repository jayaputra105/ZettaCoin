"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// PAKSA JANGAN RENDER DI SERVER
const ShootingStars = dynamic(() => import("@/components/ShootingStars"), { ssr: false });
const CoinClicker = dynamic(() => import("@/components/CoinClicker"), { ssr: false });
const AdModal = dynamic(() => import("@/components/AdModal"), { ssr: false });
const BottomNav = dynamic(() => import("@/components/BottomNav"), { ssr: false });

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Pas build, dia cuma bakal liat div item ini, gak bakal nyentuh komponen dalemnya
  if (!isClient) return <div className="min-h-screen bg-black" />;

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-black overflow-hidden">
      <ShootingStars />
      <div className="relative z-10 flex flex-col min-h-screen max-w-md mx-auto w-full px-4 pt-10">
        <h1 className="text-3xl font-black text-yellow-500 text-center shadow-gold">ZETTA GOLD</h1>
        <div className="flex-1 flex items-center justify-center">
           <CoinClicker onCoin={() => {}} locked={false} />
        </div>
      </div>
      <BottomNav />
      <AdModal open={false} onComplete={() => {}} onClose={() => {}} />
    </div>
  );
           }
