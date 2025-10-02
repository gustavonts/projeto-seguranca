"use client";
import { useEffect, useState } from "react";

interface Resource {
  id: number;
  title: string;
  level: number;
}

export default function Dashboard() {
  const [docs, setDocs] = useState<Resource[]>([]);

  useEffect(() => {
    fetch("/api/resources")
      .then(res => res.json())
      .then(setDocs);
  }, []);

  return (
    <div style={{ padding:20 }}>
      <h1>Dashboard</h1>
      <ul>
        {docs.map(d => (
          <li key={d.id}>{d.title} (Nível {d.level})</li>
        ))}
      </ul>
    </div>
  );
}
