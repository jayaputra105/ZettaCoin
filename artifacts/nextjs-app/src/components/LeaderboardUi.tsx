"use client";
import { motion } from "framer-motion";

export default function LeaderboardUI({ users }: { users: any[] }) {
  return (
    <div className="flex flex-col gap-3 mt-4">
      {users.map((user, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-2xl bg-gray-900/70 border border-yellow-500/20"
        >
          <div className="flex items-center gap-4">
            <span className="font-black text-yellow-500 italic">#{i + 1}</span>
            <span className="font-bold text-white">{user.name}</span>
          </div>
          <p className="font-black text-yellow-500">🪙 {user.coins?.toLocaleString()}</p>
        </motion.div>
      ))}
    </div>
  );
}
