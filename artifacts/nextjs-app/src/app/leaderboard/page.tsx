"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Kita bungkus SEMUA yang ada UI-nya ke dalam dynamic import
const LeaderboardScreen = dynamic(() => import("@/components/LeaderboardScreen"), { 
  ssr: false,
  loading: () => <div className="min-h-screen bg-black" /> 
});

export default function LeaderboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pas build, Next.js cuma liat null. Dia gak bakal nemu alasan buat error.
  if (!mounted) return null;

  return <LeaderboardScreen />;
}
