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

  if (loading) return <p className="text-gray-600">Carregando...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
          onClick={() => signOut()}
        >
          Sair
        </button>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {docs.map(d => (
          <li key={d.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="font-medium">{d.title}</p>
            <p className="text-sm text-gray-600">Nível {d.level}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
