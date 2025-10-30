import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "../../../../lib/auth";
import { findUserByEmailExact } from "../../../../lib/db";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const dbUser = typeof email === "string" ? findUserByEmailExact(email) : undefined;
  if (!dbUser) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 });
  }

  const valid = typeof password === "string" && bcrypt.compareSync(password, dbUser.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  const token = signToken({ id: dbUser.id, email: dbUser.email, level: dbUser.level });

  const res = NextResponse.json({ message: "Login ok", level: dbUser.level });
  res.cookies.set("app_token", token, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    // Persistente por 7 dias
    maxAge: 7 * 24 * 60 * 60,
    // Em produção exige HTTPS
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
