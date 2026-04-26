"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const BottomNav = dynamic(() => import("@/components/BottomNav"), { ssr: false });
const ShootingStars = dynamic(() => import("@/components/ShootingStars"), { ssr: false });
// INI KUNCINYA: UI-nya di-load pas di browser doang
const LeaderboardUI = dynamic(() => import("@/components/LeaderboardUI"), { ssr: false });

export default function LeaderboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setIsClient(true);
    fetch("/api/leaderboard")
      .then(r => r.json())
      .then(data => setUsers(data))
      .catch(() => {});
  }, []);

  if (!isClient) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black relative flex flex-col p-4">
      <ShootingStars />
      <h1 className="text-3xl font-black text-yellow-500 italic z-10 pt-4">LEADERBOARD</h1>
      <div className="z-10 flex-1">
        <LeaderboardUI users={users} />
      </div>
      <BottomNav />
    </div>
  );
}
