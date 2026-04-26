"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function LeaderboardScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then(r => r.json())
      .then(data => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center pt-20 text-yellow-500 animate-pulse font-bold">LOADING RANK...</div>;

  return (
    <div className="flex flex-col gap-3 mt-6">
      {users.map((user: any, i: number) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-between p-4 rounded-2xl bg-gray-900/80 border border-yellow-500/20"
        >
          <div className="flex items-center gap-4">
            <span className="font-black italic text-yellow-500">#{i + 1}</span>
            <span className="font-bold text-white uppercase text-sm">{user.name}</span>
          </div>
          <span className="font-black text-yellow-500">🪙 {user.coins?.toLocaleString()}</span>
        </motion.div>
      ))}
    </div>
  );
                 }
