"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/perfil")
    }
  }, [isAdmin, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Verificando permissões de administrador...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
            <h2 className="mt-4 font-serif text-2xl font-bold">Acesso Negado</h2>
            <p className="mt-2 text-muted-foreground">Você não tem permissão para acessar esta área.</p>
            <Link href="/perfil">
              <Button className="mt-6">Voltar para o Perfil</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
