"use client";
import { motion } from "framer-motion";

export default function LeaderboardContent({ users }: { users: any[] }) {
  return (
    <div className="flex flex-col gap-3 mt-6">
      {users.map((user, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between p-4 rounded-2xl bg-gray-900/80 border border-yellow-500/20"
        >
          <div className="flex items-center gap-4">
            <span className="font-black italic text-yellow-500">#{i + 1}</span>
            <span className="font-bold text-white">{user.name}</span>
          </div>
          <span className="font-black text-yellow-500">🪙 {user.coins?.toLocaleString()}</span>
        </motion.div>
      ))}
    </div>
  );
}
