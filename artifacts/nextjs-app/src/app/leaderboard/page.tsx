"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Panggil LeaderboardScreen, bukan Leaderboard doang!
const LeaderboardComponent = dynamic(() => import("@/components/LeaderboardScreen"), { 
  ssr: false,
  loading: () => <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Sultan...</div>
});

export default function LeaderboardPage() {
  return <LeaderboardComponent />;
}
