"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const LeaderboardScreen = dynamic(() => import("@/components/Leaderboard"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>
});

export default function LeaderboardPage() {
  return <LeaderboardScreen />;
}
