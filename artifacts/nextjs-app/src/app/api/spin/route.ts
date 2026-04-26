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
  { label: "500 Koin", coins: 500, usdt: 12, weight: 12 },
  { label: "1000 Koin", coins: 1000, usdt: 0, weight: 7 },
];

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json({ prizes: PRIZES.map((p, i) => ({ ...p, index: i })) }, { status: 200 });
  }

  try {
    const [user] = await db.select().from(users).where(eq(users.telegramId, MOCK_TELEGRAM_ID)).limit(1);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    // ... (lanjutkan kodingan sisa GET lu di sini)
    return NextResponse.json({ success: true }); 
  } catch (e) {
    return NextResponse.json({ error: "Gagal" }, { status: 500 });
  }
}
