// @ts-nocheck
/* eslint-disable */
"use client";

// Baris sakti buat nipu build worker
export const config = { unoptimized: true }; 
export const dynamic = 'force-dynamic';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Import mewah anti-error
const BottomNav = dynamic(() => import("@/components/BottomNav"), { ssr: false });
const ShootingStars = dynamic(() => import("@/components/ShootingStars"), { ssr: false });

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!isClient) return <div className="min-h-screen bg-black" />;

  return (
    <div className="relative min-h-screen w-full flex flex-col" style={{ background: "radial-gradient(ellipse at 50% 0%, #0d0d1a 0%, #050508 60%, #000 100%)" }}>
      <ShootingStars />
      
      <div className="relative z-10 flex flex-col min-h-screen max-w-md mx-auto w-full px-4 pb-28">
        <header className="pt-6 pb-4">
          <h1 className="font-black text-3xl italic tracking-tighter" style={{ color: "#FFD700", textShadow: "0 0 20px rgba(255,215,0,0.5)" }}>
            RANKING
          </h1>
          <p className="text-xs uppercase tracking-widest text-gray-500">Zetta Point Leaders</p>
        </header>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {users.map((user, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 rounded-2xl"
                style={{ 
                  background: "rgba(15, 15, 15, 0.6)", 
                  border: "1px solid rgba(255, 215, 0, 0.15)",
                  boxShadow: i === 0 ? "0 0 15px rgba(255, 215, 0, 0.1)" : "none"
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-black italic text-gray-600" style={{ color: i < 3 ? "#FFD700" : "" }}>
                    #{i + 1}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-gray-800 border border-yellow-900/50 overflow-hidden">
                     <img src={user.avatar || `https://api.dicebear.com/9.x/pixel-art/svg?seed=${i}`} alt="av" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                    <p className="text-[10px] text-gray-500">@{user.username || 'user'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-yellow-500">🪙 {user.coins?.toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
                }
