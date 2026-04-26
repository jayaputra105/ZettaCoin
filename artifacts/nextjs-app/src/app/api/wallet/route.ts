import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, transactions } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

const MOCK_TELEGRAM_ID = "mock_001";
const MIN_WITHDRAW_COINS = 10000;

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const [user] = await db.select().from(users).where(eq(users.telegramId, MOCK_TELEGRAM_ID)).limit(1);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Ambil riwayat transaksi terbaru
    const txHistory = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, user.id))
      .orderBy(desc(transactions.createdAt))
      .limit(50); // Naikin limit dikit biar history lebih panjang

    // Hitung saldo USDT dari history transaksi
    const usdtBalance = txHistory
      .filter((t) => t.type === "spin_reward" && t.currency === "USDT" && t.status === "completed")
      .reduce((s, t) => s + parseFloat(t.amount || "0"), 0);

    return NextResponse.json({
      coins: user.coins,
      usdtBalance: Number(usdtBalance.toFixed(2)), // Fix angka desimal
      minWithdrawCoins: MIN_WITHDRAW_COINS,
      transactions: txHistory,
    });
  } catch (e) {
    return NextResponse.json({ error: "Gagal mengambil data wallet" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { method, amount, walletAddress, currency } = body;
    const amtNum = Number(amount);

    const [user] = await db.select().from(users).where(eq(users.telegramId, MOCK_TELEGRAM_ID)).limit(1);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Logika Penarikan Koin
    if (currency === "COINS") {
      if (amtNum < MIN_WITHDRAW_COINS) {
        return NextResponse.json({ error: `Minimal WD adalah ${MIN_WITHDRAW_COINS.toLocaleString()} koin` }, { status: 400 });
      }
      if (user.coins < amtNum) {
        return NextResponse.json({ error: "Saldo koin tidak cukup" }, { status: 400 });
      }

      // Potong saldo koin secara atomic
      await db.update(users)
        .set({ coins: sql`${users.coins} - ${amtNum}` })
        .where(and(eq(users.id, user.id), sql`${users.coins} >= ${amtNum}`));
    }

    // Catat transaksi penarikan ke database
    const [tx] = await db
      .insert(transactions)
      .values({
        userId: user.id,
        type: "withdrawal",
        amount: String(amtNum),
        currency: currency || "COINS",
        method: method || "TON",
        walletAddress: walletAddress || "",
        status: "pending",
      })
      .returning();

    return NextResponse.json({ 
      success: true,
      transaction: tx, 
      message: "WD diproses! Tunggu konfirmasi admin." 
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Gagal memproses penarikan" }, { status: 500 });
  }
}
