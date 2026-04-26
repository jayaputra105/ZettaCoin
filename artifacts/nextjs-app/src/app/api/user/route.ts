import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

const MOCK_TELEGRAM_ID = "mock_001";

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const [user] = await db.select().from(users).where(eq(users.telegramId, MOCK_TELEGRAM_ID)).limit(1);
    
    if (!user) {
      // Opsi: Kalau user gak ketemu, otomatis buat baru (Auto-Register)
      // Ini ngebantu biar web lu gak nge-blank pas pertama kali dibuka
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: "Gagal mengambil profil" }, { status: 500 });
  }
}

/**
 * WARNING: PATCH ini sangat rawan kalau bisa diakses bebas.
 * Sebaiknya penambahan koin hanya terjadi via rute Spin atau Task.
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const addAmount = Number(body.addCoins ?? 0);

    // Optimasi: Langsung update tanpa select dulu buat ngehemat kuota DB
    const updated = await db
      .update(users)
      .set({ 
        coins: sql`${users.coins} + ${addAmount}` 
      })
      .where(eq(users.telegramId, MOCK_TELEGRAM_ID))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (e) {
    return NextResponse.json({ error: "Gagal update koin" }, { status: 500 });
  }
}
