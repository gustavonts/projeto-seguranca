"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error);
    }
  }

  return (
    <div style={{ display:"flex",justifyContent:"center",alignItems:"center",height:"100vh" }}>
      <form onSubmit={handleSubmit} style={{ padding:20,border:"1px solid #ccc",borderRadius:10 }}>
        <h1>Login</h1>
        {error && <p style={{color:"red"}}>{error}</p>}
        <input type="email" placeholder="Email"
          value={email} onChange={e=>setEmail(e.target.value)} required /><br/>
        <input type="password" placeholder="Senha"
          value={password} onChange={e=>setPassword(e.target.value)} required /><br/>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
