import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser, findUserByEmailExact } from "../../../../lib/db";

export async function POST(req: Request) {
  const { email, password, level } = await req.json();

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
  }
  const userLevel = Number.isFinite(Number(level)) ? Number(level) : 0;

  const existing = findUserByEmailExact(email);
  if (existing) return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 409 });

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = createUser(email, passwordHash, userLevel);
  return NextResponse.json({ id: user.id, email: user.email, level: user.level, createdAt: user.createdAt }, { status: 201 });
}

