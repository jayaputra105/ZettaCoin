"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Load komponen utama lewat jalur belakang
// Ganti bagian import lu jadi:
import MainGame from '@/components/CoinClicker';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="bg-black min-h-screen" />;
  return <MainGame />;
}
