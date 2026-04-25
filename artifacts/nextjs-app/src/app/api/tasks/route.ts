import { NextResponse } from "next/server";
import { db } from "@/db";
import { spinRecords, users, transactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

const MOCK_TELEGRAM_ID = "mock_001";
const FREE_SPIN_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const MAX_ADS_SPINS = 5;

const PRIZES = [
  { label: "50 Koin", coins: 50, usdt: 0, weight: 35 },
  { label: "100 Koin", coins: 100, usdt: 0, weight: 25 },
  { label: "200 Koin", coins: 200, usdt: 0, weight: 18 },
  { label: "500 Koin", coins: 500, usdt: 0, weight: 12 },
  { label: "1000 Koin", coins: 1000, usdt: 0, weight: 7 },
  { label: "10 USDT", coins: 0, usdt: 10, weight: 0 },
];

export async function POST(req: Request) {
  try {
    const { useAd } = await req.json();
    const [user] = await db.select().from(users).where(eq(users.telegramId, MOCK_TELEGRAM_ID)).limit(1);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    let [spin] = await db.select().from(spinRecords).where(eq(spinRecords.userId, user.id)).limit(1);
    if (!spin) {
        await db.insert(spinRecords).values({ userId: user.id });
        [spin] = await db.select().from(spinRecords).where(eq(spinRecords.userId, user.id)).limit(1);
    }

    const now = new Date();
    // Logika spin dan update... (Gunakan Atomic Update seperti di bawah)
    
    const prize = PRIZES[0]; // Contoh ambil prize
    
    await db.update(users)
      .set({ coins: sql`${users.coins} + ${prize.coins}` })
      .where(eq(users.id, user.id));

    return NextResponse.json({ success: true, prize });
  } catch (e) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}