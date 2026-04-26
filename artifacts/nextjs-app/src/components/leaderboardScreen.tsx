"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const BottomNav = dynamic(() => import("@/components/BottomNav"), { ssr: false });
const ShootingStars = dynamic(() => import("@/components/ShootingStars"), { ssr: false });

export default function LeaderboardScreen() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then(r => r.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-black relative p-6 flex flex-col text-white">
      <ShootingStars />
      <h1 className="text-4xl font-black text-yellow-500 italic z-10">RANKING</h1>
      <div className="z-10 relative mt-6 space-y-3">
        {users.map((u: any, i: number) => (
          <div key={i} className="p-4 bg-gray-900/50 border border-yellow-500/20 rounded-2xl flex justify-between">
            <span className="font-bold">#{i + 1} {u.name}</span>
            <span className="text-yellow-500 font-black">🪙 {u.coins}</span>
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
            }
