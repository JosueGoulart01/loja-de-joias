"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function PerfilLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { usuario, isLoading } = useAuth()
  const router = useRouter()

  // Proteção nível 1: Verifica se está logado
  useEffect(() => {
    if (!isLoading && !usuario) {
      router.push("/login")
    }
  }, [usuario, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!usuario) return null

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      {/* Container principal com Sidebar e Conteúdo */}
      <div className="container mx-auto flex flex-1 gap-8 py-8 px-4">
        
        {/* A Sidebar é inteligente: ela se adapta se for User ou Admin */}
        <AdminSidebar />
        
        <main className="flex-1 w-full min-w-0">
          <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}