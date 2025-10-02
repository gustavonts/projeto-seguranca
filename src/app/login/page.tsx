"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div>
      <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
        Entrar com Google
      </button>
    </div>
  );
}
