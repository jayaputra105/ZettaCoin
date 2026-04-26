import { NextResponse } from 'next/server';
import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const top = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        avatar: users.avatar,
        coins: users.coins,
      })
      .from(users)
      .orderBy(desc(users.coins))
      .limit(100);

    // Tambahkan nomor peringkat (index + 1)
    const withRank = top.map((u, i) => ({ 
      ...u, 
      rank: i + 1 
    }));
    const databaseUrl = process.env.DATABASE_URL;

  // Kalau kuncinya gak ada (pas build di Termux), jangan panggil neon()!
  if (!databaseUrl) {
    console.log("Database URL skip dulu buat build...");
    return NextResponse.json([], { status: 200 }); // Balikin array kosong aja
      }

    return NextResponse.json(withRank);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}
