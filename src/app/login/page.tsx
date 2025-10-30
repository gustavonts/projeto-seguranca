"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">Entrar</h2>
        <button
          className="w-full inline-flex items-center justify-center rounded-md bg-black text-white hover:bg-gray-800 transition-colors px-4 py-2"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          Entrar com Google
        </button>
      </div>
    </div>
  );
}
