import { NextResponse } from "next/server";
import { db } from "@/db";
import { spinRecords, users, transactions } from "@/db/schema";
import { eq } from "drizzle-orm";


const MOCK_TELEGRAM_ID = "mock_001";
const FREE_SPIN_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const MAX_ADS_SPINS = 5;

const PRIZES = [
  { label: "50 Koin", coins: 50, usdt: 0, weight: 35 },
  { label: "100 Koin", coins: 100, usdt: 0, weight: 25 },
  { label: "200 Koin", coins: 200, usdt: 0, weight: 18 },
  { label: "500 Koin", coins: 500, usdt: 12, weight: 12 }, // Perbaikan label koin
  { label: "1000 Koin", coins: 1000, usdt: 0, weight: 7 },
  { label: "10 USDT", coins: 0, usdt: 10, weight: 0 }, // Weight 0 berarti gak bakal dapet kecuali lu ubah
];
const databaseUrl = process.env.DATABASE_URL;

  // Kalau kuncinya gak ada (pas build di Termux), jangan panggil neon()!
  if (!databaseUrl) {
    console.log("Database URL skip dulu buat build...");
    return NextResponse.json([], { status: 200 }); // Balikin array kosong aja
  }

function weightedRandom(prizes: typeof PRIZES) {
  const total = prizes.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  for (let i = 0; i < prizes.length; i++) {
    r -= prizes[i].weight;
    if (r <= 0) return i;
  }
  return 0;
}
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const [user] = await db.select().from(users).where(eq(users.telegramId, MOCK_TELEGRAM_ID)).limit(1);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const [spin] = await db.select().from(spinRecords).where(eq(spinRecords.userId, user.id)).limit(1);

    const now = Date.now();
    const lastFree = spin?.lastFreeSpinAt ? new Date(spin.lastFreeSpinAt).getTime() : 0;
    const isFreeAvailable = now - lastFree >= FREE_SPIN_COOLDOWN_MS;

    const adsResetAt = spin?.adsResetAt ? new Date(spin.adsResetAt).getTime() : 0;
    const adsReset = now - adsResetAt >= FREE_SPIN_COOLDOWN_MS;
    const adsSpinsToday = adsReset ? 0 : (spin?.adsSpinsToday ?? 0);
    const adsRemaining = Math.max(0, MAX_ADS_SPINS - adsSpinsToday);

    return NextResponse.json({
      isFreeAvailable,
      adsRemaining,
      maxAds: MAX_ADS_SPINS,
      nextFreeIn: isFreeAvailable ? 0 : FREE_SPIN_COOLDOWN_MS - (now - lastFree),
      prizes: PRIZES.map((p, i) => ({ ...p, index: i })),
    });
  } catch (e) {
    return NextResponse.json({ error: "Gagal mengambil data spin" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { useAd } = await req.json();
    const [user] = await db.select().from(users).where(eq(users.telegramId, MOCK_TELEGRAM_ID)).limit(1);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Pastikan record spin ada, kalau gak ada buat baru
    let [spin] = await db.select().from(spinRecords).where(eq(spinRecords.userId, user.id)).limit(1);
    if (!spin) {
      await db.insert(spinRecords).values({ userId: user.id });
      [spin] = await db.select().from(spinRecords).where(eq(spinRecords.userId, user.id)).limit(1);
    }

    const now = Date.now();
    const lastFree = spin.lastFreeSpinAt ? new Date(spin.lastFreeSpinAt).getTime() : 0;
    const isFreeAvailable = now - lastFree >= FREE_SPIN_COOLDOWN_MS;

    const adsResetAt = spin.adsResetAt ? new Date(spin.adsResetAt).getTime() : 0;
    const adsReset = now - adsResetAt >= FREE_SPIN_COOLDOWN_MS;
    const adsSpinsToday = adsReset ? 0 : (spin.adsSpinsToday ?? 0);
    const adsRemaining = MAX_ADS_SPINS - adsSpinsToday;

    // Validasi jatah spin
    if (!useAd && !isFreeAvailable) return NextResponse.json({ error: "Belum waktunya spin gratis" }, { status: 400 });
    if (useAd && adsRemaining <= 0) return NextResponse.json({ error: "Jatah iklan hari ini habis" }, { status: 400 });

    const prizeIndex = weightedRandom(PRIZES);
    const prize = PRIZES[prizeIndex];

    // Update Status Spin
    if (useAd) {
      await db.update(spinRecords)
        .set({ 
          adsSpinsToday: adsReset ? 1 : adsSpinsToday + 1, 
          adsResetAt: new Date() // Selalu update timestamp reset agar logic cooldown jalan
        })
        .where(eq(spinRecords.userId, user.id));
    } else {
      await db.update(spinRecords)
        .set({ lastFreeSpinAt: new Date() })
        .where(eq(spinRecords.userId, user.id));
    }

    // Update Koin User
    const newCoins = user.coins + prize.coins;
    await db.update(users).set({ coins: newCoins }).where(eq(users.id, user.id));

    // Catat Transaksi
    await db.insert(transactions).values({
      userId: user.id,
      type: "spin_reward",
      amount: prize.usdt > 0 ? String(prize.usdt) : String(prize.coins),
      currency: prize.usdt > 0 ? "USDT" : "COINS",
      status: "completed",
    });

    return NextResponse.json({ prize, prizeIndex, newCoins });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Gagal memproses hadiah" }, { status: 500 });
  }
}
