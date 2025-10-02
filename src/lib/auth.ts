import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "segredo_local";

export interface UserToken {
  id: number;
  email: string;
  level: number;
}

// Gera JWT
export function signToken(user: UserToken): string {
  return jwt.sign(user, SECRET, { expiresIn: "1h" });
}

// Verifica JWT
export function verifyToken(token: string | undefined): UserToken | null {
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET) as UserToken;
  } catch {
    return null;
  }
}
