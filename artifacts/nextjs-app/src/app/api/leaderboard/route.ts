import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";

// PAKSA JADI DYNAMIC BIAR GAK ERROR PAS BUILD
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  // JURUS PAMUNGKAS: Kalau lagi fase build, langsung skip manggil DB
  if (process.env.NEXT_PHASE === 'phase-production-build' || !process.env.DATABASE_URL?.startsWith('postgres')) {
    return NextResponse.json([]);
  }

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

    const withRank = top.map((u, i) => ({ ...u, position: i + 1 }));
    return NextResponse.json(withRank);
  } catch (e) {
    return NextResponse.json([], { status: 200 }); // Balikin array kosong aja biar gak crash
  }
}
