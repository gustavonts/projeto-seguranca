import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "../../../../lib/auth";

const fakeUser = {
  id: 1,
  email: "admin@local",
  passwordHash: bcrypt.hashSync("123456", 10), // senha
  level: 2, // SECRET
};

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email !== fakeUser.email) 
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 });

  const valid = bcrypt.compareSync(password, fakeUser.passwordHash);
  if (!valid) 
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });

  const token = signToken(fakeUser);

  const res = NextResponse.json({ message: "Login ok", level: fakeUser.level });
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
