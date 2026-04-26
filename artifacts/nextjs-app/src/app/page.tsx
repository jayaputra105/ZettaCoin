"use client";
import { useState, useEffect } from "react";
import MainGame from '@/components/CoinClicker';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  // Fungsi penambah koin (masukin logic lu di sini nanti)
  const handleCoin = () => {
    console.log("Koin nambah!");
  };

  useEffect(() => { 
    setMounted(true); 
  }, []);

  if (!mounted) return <div className="bg-black min-h-screen" />;
  
  return (
    <main className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-black relative">
      <div className="flex flex-col items-center justify-center w-full max-w-md p-4">
        <MainGame onCoin={handleCoin} />
      </div>
    </main>
  );
            }
