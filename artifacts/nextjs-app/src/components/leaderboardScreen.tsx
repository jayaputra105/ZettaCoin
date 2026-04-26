"use client";
import { motion } from "framer-motion";

export default function LeaderboardScreen({ users }: { users: any[] }) {
  return (
    <div className="flex flex-col gap-3 mt-6">
      {users.map((user, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-between p-4 rounded-2xl"
          style={{ background: "rgba(20,20,20,0.8)", border: "1px solid #FFD70033" }}
        >
          <div className="flex items-center gap-4">
            <span className="font-black italic text-yellow-500">#{i + 1}</span>
            <span className="font-bold text-white uppercase tracking-tighter text-sm">{user.name}</span>
          </div>
          <span className="font-black text-yellow-500">🪙 {user.coins?.toLocaleString()}</span>
        </motion.div>
      ))}
    </div>
  );
}
