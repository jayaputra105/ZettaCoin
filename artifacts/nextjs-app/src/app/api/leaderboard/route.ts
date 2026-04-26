import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";

// JIMAT BIAR TERMUX GAK PUSING PAS BUILD
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Proteksi kalau env kosong pas build
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([]);
    }

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

    // Tambahin posisi ranking 1, 2, 3...
    const withRank = top.map((u, i) => ({ ...u, position: i + 1 }));
    
    return NextResponse.json(withRank);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "DB Error" }, { status: 500 });
  }
}
