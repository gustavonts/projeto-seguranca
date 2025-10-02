import { NextResponse } from "next/server";
import { verifyToken } from "../../../lib/auth";
import { canRead, canWrite } from "../../../lib/blp";
import { cookies } from "next/headers";

interface Resource {
  id: number;
  title: string;
  level: number;
}

const resources: Resource[] = [
  { id: 1, title: "Doc Unclassified", level: 0 },
  { id: 2, title: "Doc Confidential", level: 1 },
  { id: 3, title: "Doc Secret", level: 2 },
  { id: 4, title: "Doc TopSecret", level: 3 },
];

export async function GET() {
  const cookieStore = await cookies(); // ✅ await
  const token = cookieStore.get("app_token")?.value; 
  const user = verifyToken(token);

  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const visible = resources.filter(r => canRead(user.level, r.level));
  return NextResponse.json(visible);
}

export async function POST(req: Request) {
  const cookieStore = await cookies(); // ✅ await
  const token = cookieStore.get("app_token")?.value; 
  const user = verifyToken(token);

  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { title, level } = await req.json();

  if (!canWrite(user.level, level)) {
    return NextResponse.json({ error: "No Write Down" }, { status: 403 });
  }

  return NextResponse.json({ message: "Recurso criado", title, level });
}
