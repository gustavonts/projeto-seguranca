"use client";

import { useEffect, useState } from "react";
import { getSession, signOut } from "next-auth/react";

interface Resource {
  id: number;
  title: string;
  level: number;
}

export default function Dashboard() {
  const [docs, setDocs] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then(session => {
      if (!session) {
        window.location.href = "/login";
      } else {
        // Aqui você poderia passar level para API, ou manter o level no token
        fetch("/api/resources")
          .then(res => res.json())
          .then(d => {
            setDocs(d);
            setLoading(false);
          });
      }
    });
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div style={{ padding:20 }}>
      <h1>Dashboard</h1>
      <button onClick={() => signOut()}>Sair</button>
      <ul>
        {docs.map(d => (
          <li key={d.id}>{d.title} (Nível {d.level})</li>
        ))}
      </ul>
    </div>
  );
}
