"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingText { id: number; x: number; y: number; }
interface Ripple { id: number; x: number; y: number; }

interface CoinClickerProps {
  onCoin: () => void;
  pointsPerClick?: number;
  locked?: boolean;
  needsAd?: boolean;
}

export default function CoinClicker({
  onCoin,
  pointsPerClick = 10,
  locked = false,
  needsAd = false,
}: CoinClickerProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [floaters, setFloaters] = useState<FloatingText[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [shake, setShake] = useState(false);
  const nextId = useRef(0);

  // Logic inti dipisah biar gak bawa-bawa objek 'Event'
  const processClick = useCallback((clientX: number, clientY: number, currentTarget: HTMLElement) => {
    const rect = currentTarget.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const id = nextId.current++;

    if (!needsAd) {
      const offsetX = (Math.random() - 0.5) * 80;
      setFloaters((prev) => [...prev, { id, x: x + offsetX, y }]);
      setRipples((prev) => [...prev, { id, x, y }]);
      
      setTimeout(() => {
        setFloaters((prev) => prev.filter((f) => f.id !== id));
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 1000);
    }
    onCoin();
  }, [onCoin, needsAd]);

  const handleInteraction = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    if (locked) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    processClick(clientX, clientY, e.currentTarget);
  };

  const coinStyle = {
    background: locked 
      ? "radial-gradient(circle at 35% 30%, #3a3a3a 0%, #0a0a0a 100%)"
      : "radial-gradient(circle at 35% 30%, #FFFDE0 0%, #B8860B 100%)",
    boxShadow: isPressed
      ? "0 4px 20px rgba(255,215,0,0.4), inset 0 4px 16px rgba(0,0,0,0.4)"
      : "0 0 50px rgba(255,215,0,0.5), 0 20px 60px rgba(0,0,0,0.7)",
    border: locked ? "3px solid rgba(255,50,50,0.2)" : "3px solid rgba(255,240,100,0.6)",
  };

  return (
    <div className="relative flex items-center justify-center select-none">
      <motion.button
        onMouseDown={() => !locked && setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onTouchStart={() => !locked && setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onClick={handleInteraction}
        animate={shake ? { x: [-6, 6, -6, 6, 0] } : { scale: isPressed ? 0.9 : 1 }}
        className="relative w-52 h-52 rounded-full outline-none"
        style={coinStyle}
      >
        <span className="text-6xl font-black text-white/90" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
          {locked ? "🔒" : needsAd ? "🎬" : "₿"}
        </span>

        <AnimatePresence>
          {ripples.map((r) => (
            <motion.span
              key={r.id}
              initial={{ width: 0, height: 0, opacity: 0.5, x: r.x, y: r.y, translateX: "-50%", translateY: "-50%" }}
              animate={{ width: 250, height: 250, opacity: 0 }}
              className="absolute rounded-full border-2 border-yellow-500 pointer-events-none"
            />
          ))}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {floaters.map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 1, y: f.y, x: f.x }}
            animate={{ opacity: 0, y: f.y - 100 }}
            className="absolute font-black text-2xl text-yellow-500 pointer-events-none"
          >
            +{pointsPerClick}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
    }
