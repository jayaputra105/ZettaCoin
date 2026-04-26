import { NextResponse } from "next/server";

// PAKSA TOTAL JADI DYNAMIC
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  // JANGAN JALANIN LOGIC DB KALAU LAGI BUILD
  if (process.env.NEXT_PHASE === 'phase-production-build' || !process.env.DATABASE_URL?.includes('postgres')) {
    return NextResponse.json([]);
  }

  try {
    // Import DB di dalam fungsi biar gak narik library pas build global
    const { db } = await import("@/db");
    const { users } = await import("@/db/schema");
    const { desc } = await import("drizzle-orm");

    const data = await db.select().from(users).orderBy(desc(users.coins)).limit(50);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json([]);
  }
}
