"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Import komponen secara dinamis (Anti-SSR)
const ShootingStars = dynamic(() => import("@/components/ShootingStars"), { ssr: false });
const BottomNav = dynamic(() => import("@/components/BottomNav"), { ssr: false });

export default function LeaderboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    // Fetch data cuma pas udah di browser (HP user)
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // JURUS ANTI-MERAH: Pas build, Next.js cuma liat layar hitam
  if (!isClient) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col" style={{ background: "radial-gradient(ellipse at 50% 0%, #0d0d1a 0%, #050508 60%, #000 100%)" }}>
      <ShootingStars />
      
      <div className="relative z-10 flex flex-col min-h-screen max-w-md mx-auto w-full px-4 pb-28">
        <header className="pt-8 pb-4">
          <h1 className="font-black text-4xl italic tracking-tighter" style={{ color: "#FFD700", textShadow: "0 0 20px rgba(255,215,0,0.6)" }}>
            LEADERBOARD
          </h1>
          <div className="h-1 w-20 bg-yellow-500 rounded-full mt-1" />
        </header>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-4">
            {users.map((user: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-2xl"
                style={{ 
                  background: "rgba(15, 15, 15, 0.7)", 
                  border: "1px solid rgba(255, 215, 0, 0.2)",
                  backdropFilter: "blur(10px)"
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="font-black text-lg italic" style={{ color: i < 3 ? "#FFD700" : "#444" }}>
                    #{i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                    <p className="text-[10px] text-gray-500 mt-1">@{user.username || 'player'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-yellow-500">🪙 {user.coins?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
