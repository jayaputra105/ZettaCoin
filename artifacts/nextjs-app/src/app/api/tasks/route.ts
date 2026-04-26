import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Pasang baris sakti biar build gak error
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Ambil daftar tugas dari tabel tasks
    const tasks = await sql`SELECT * FROM tasks ORDER BY id ASC`;
    
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Tasks GET Error:", error);
    return NextResponse.json({ error: "Gagal ambil list tugas" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, taskId } = await request.json();
    const sql = neon(process.env.DATABASE_URL!);

    // Logika simpan tugas yang sudah selesai (misal masuk ke tabel user_tasks)
    await sql`
      INSERT INTO user_tasks (user_id, task_id, completed_at)
      VALUES (${userId}, ${taskId}, NOW())
      ON CONFLICT (user_id, task_id) DO NOTHING
    `;

    return NextResponse.json({ message: "Task berhasil diselesaikan!" });
  } catch (error) {
    console.error("Tasks POST Error:", error);
    return NextResponse.json({ error: "Gagal klaim tugas" }, { status: 500 });
  }
}
