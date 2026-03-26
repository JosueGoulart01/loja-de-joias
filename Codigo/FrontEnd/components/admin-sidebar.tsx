"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  Users, 
  ShoppingBag, 
  Package, 
  Tag, 
  Gift, 
  BarChart3, 
  Settings, 
  Truck, 
  Warehouse,
  Megaphone // <--- Ícone adicionado para Marketing
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

export function AdminSidebar() {
  const pathname = usePathname()
  const { isAdmin } = useAuth()

  // Lista de links exclusivos para ADMIN
  const adminLinks = [
    { href: "/perfil/admin", label: "Visão Geral", icon: Home },
    { href: "/perfil/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
    { href: "/perfil/admin/produtos", label: "Produtos", icon: Package },
    { href: "/perfil/admin/estoque", label: "Estoque", icon: Warehouse },
    { href: "/perfil/admin/categorias", label: "Categorias", icon: Tag },
    // 👇 Novo link adicionado aqui
    { href: "/perfil/admin/marketing", label: "Marketing", icon: Megaphone },
    { href: "/perfil/admin/cupons", label: "Cupons", icon: Gift },
    { href: "/perfil/admin/usuarios", label: "Usuários", icon: Users },
    { href: "/perfil/admin/relatorios", label: "Relatórios", icon: BarChart3 },
  ]

  // Lista de links para usuários comuns (Clientes)
  const userOnlyLinks = [
    { href: "/perfil/pedidos", label: "Meus Pedidos", icon: Truck },
  ]

  // Links comuns a todos
  const commonLinks = [
    { href: "/perfil/configuracoes", label: "Configurações", icon: Settings },
  ]

  // Função para verificar se o link está ativo
  const isActive = (path: string) => pathname === path || (path !== "/perfil/admin" && pathname.startsWith(path))

  return (
    <aside className="w-64 shrink-0 hidden lg:block border-r pr-6 py-6">
       <div className="sticky top-24 space-y-8">
         <div>
           <h2 className="text-lg font-semibold font-serif">{isAdmin ? "Painel Admin" : "Minha Conta"}</h2>
           <p className="text-sm text-muted-foreground">{isAdmin ? "Gerencie sua loja" : "Seus dados e pedidos"}</p>
         </div>

         <nav className="space-y-1">
            {/* SEÇÃO DO ADMIN */}
            {isAdmin && (
                <>
                    <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4">Loja</p>
                    {adminLinks.map((link) => (
                        <Link key={link.href} href={link.href} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", isActive(link.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                            <link.icon className="h-4 w-4" /> {link.label}
                        </Link>
                    ))}
                </>
            )}

            {/* SEÇÃO DO USUÁRIO COMUM */}
            {!isAdmin && (
                <>
                    <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4">Compras</p>
                    {userOnlyLinks.map((link) => (
                        <Link key={link.href} href={link.href} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", isActive(link.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                            <link.icon className="h-4 w-4" /> {link.label}
                        </Link>
                    ))}
                </>
            )}
             
            {/* SEÇÃO GERAL (TODOS) */}
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4">Geral</p>
            {commonLinks.map((link) => (
                <Link key={link.href} href={link.href} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", isActive(link.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                    <link.icon className="h-4 w-4" /> {link.label}
                </Link>
            ))}
         </nav>
       </div>
    </aside>
  )
}