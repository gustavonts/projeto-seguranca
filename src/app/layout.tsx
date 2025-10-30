// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Projeto Segurança",
  description: "Sistema simples com Bell-LaPadula",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="min-h-screen flex flex-col">
          <header className="border-b bg-white/80 backdrop-blur">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <h1 className="text-xl font-semibold">Projeto Segurança</h1>
            </div>
          </header>
          <main className="flex-1">
            <div className="max-w-4xl mx-auto px-4 py-8">{children}</div>
          </main>
          <footer className="border-t bg-white/80">
            <div className="max-w-4xl mx-auto px-4 py-4 text-sm text-gray-600">
              <span>© {new Date().getFullYear()} Projeto Segurança</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
