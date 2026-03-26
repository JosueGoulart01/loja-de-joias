"use client"

import { AdminRouteGuard } from "@/components/admin-route-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Ao envolver o children aqui, TODAS as páginas dentro da pasta 'admin'
    // (categorias, cupons, produtos, usuários, etc.) ficam protegidas automaticamente.
    <AdminRouteGuard>
      <div className="w-full animate-in fade-in duration-500">
        {children}
      </div>
    </AdminRouteGuard>
  )
}