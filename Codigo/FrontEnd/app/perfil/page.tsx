"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function PerfilRootPage() {
  const { usuario, isAdmin, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 1. Se ainda estiver carregando o contexto, aguarda.
    if (isLoading) return

    // 2. Se não tiver usuário, manda para login
    if (!usuario) {
      router.replace("/login")
      return
    }

    // 3. Lógica de Redirecionamento por Role
    if (isAdmin) {
      // Se for ADMIN, vai para o painel geral
      router.replace("/perfil/admin")
    } else {
      // Se for USER, só pode ver configurações
      router.replace("/perfil/configuracoes")
    }
  }, [usuario, isAdmin, isLoading, router])

  // Loading state visual enquanto decide
  return (
    <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground animate-pulse">Redirecionando...</p>
    </div>
  )
}