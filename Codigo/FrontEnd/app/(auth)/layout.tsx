import Link from "next/link";
import React from "react";

// Este é um layout específico para as páginas de autenticação.
// Ele cria um ambiente limpo, com o fundo e as fontes do seu tema de luxo.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    // Aplicando as variáveis de cor --background e --foreground do seu CSS global.
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Cabeçalho Simplificado com cores do tema */}
      <header className="py-4 px-8 border-b border-border bg-card shadow-sm">
        <Link href="/" className="text-2xl font-serif font-semibold text-primary">
          Detalhe Prata
        </Link>
      </header>

      {/* Conteúdo Principal com animação de entrada suave */}
      <main className="flex-grow flex items-center justify-center p-4 fade-in">
        {children}
      </main>
    </div>
  );
}