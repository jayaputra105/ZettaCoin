"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// INI RAHASIANYA: Load UI-nya cuma pas udah di tangan user (HP)
const LeaderboardContent = dynamic(() => import("@/components/LeaderboardContent"), { ssr: false });
const BottomNav = dynamic(() => import("@/components/BottomNav"), { ssr: false });
const ShootingStars = dynamic(() => import("@/components/ShootingStars"), { ssr: false });

export default function LeaderboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setIsClient(true);
    fetch("/api/leaderboard")
      .then(r => r.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Pas Build: Next.js cuma liat div kosong hitam. Gak ada yang perlu diprotes.
  if (!isClient) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black relative p-6">
      <ShootingStars />
      <h1 className="text-3xl font-black text-yellow-500 italic z-10">LEADERBOARD</h1>
      <div className="z-10 relative">
        <LeaderboardContent users={users} />
      </div>
      <BottomNav />
    </div>
  );
            }
