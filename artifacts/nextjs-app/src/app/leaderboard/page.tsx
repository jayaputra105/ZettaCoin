"use client"; // CUKUP SATU DI SINI

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Komponen luar di-import secara dinamis biar gak rewel pas build
const BottomNav = dynamic(() => import("@/components/BottomNav"), { ssr: false });
const ShootingStars = dynamic(() => import("@/components/ShootingStars"), { ssr: false });

export default function LeaderboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setIsClient(true);
    // Fetch data hanya jalan di browser (Client Side)
    fetch("/api/leaderboard")
      .then(r => r.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Selama proses build di server, dia cuma ngerender div kosong hitam ini
  if (!isClient) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col">
      <ShootingStars />
      <div className="relative z-10 p-6 flex-1 max-w-md mx-auto w-full">
        <h1 className="text-3xl font-black text-yellow-500 italic tracking-tighter shadow-gold">
          RANKING
        </h1>
        <div className="mt-8 space-y-3">
          {users.map((u: any, i: number) => (
            <div 
              key={i} 
              className="p-4 rounded-2xl flex justify-between items-center"
              style={{ 
                background: "rgba(20,20,20,0.7)", 
                border: "1px solid rgba(255,215,0,0.2)",
                backdropFilter: "blur(10px)"
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-500 font-bold">#{i + 1}</span>
                <span className="font-semibold">{u.name}</span>
              </div>
              <span className="text-yellow-500 font-black">🪙 {u.coins?.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
