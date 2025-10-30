import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "../../../lib/auth";
import { findUsersByEmail, findUserById } from "../../../lib/db";

// GET /api/users?id=1 OR /api/users?email=foo@example.com
// Proteções contra SQL Injection: PARAM BINDING ("?"), validação de tipos e saneamento de LIKE
export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("app_token")?.value;
  const user = verifyToken(token);

  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get("id");
  const emailParam = searchParams.get("email") || "";
  const limitParam = searchParams.get("limit") || "10";
  const offsetParam = searchParams.get("offset") || "0";

  // Validação estrita de números (evita injeções em LIMIT/OFFSET)
  const limit = Math.max(1, Math.min(50, Number.parseInt(limitParam, 10) || 10));
  const offset = Math.max(0, Number.parseInt(offsetParam, 10) || 0);

  // Se "id" for informado, busca determinística por ID (parametrizada)
  if (idParam) {
    const id = Number.parseInt(idParam, 10);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: "Parâmetro 'id' inválido" }, { status: 400 });
    }
    const found = findUserById(id);
    if (!found) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    return NextResponse.json(found);
  }

  // Busca por e-mail com LIKE parametrizado e escaping de curingas
  const users = findUsersByEmail(emailParam, limit, offset);
  return NextResponse.json(users);
}

export async function POST() {
  return NextResponse.json({ error: "Método não permitido" }, { status: 405 });
}

