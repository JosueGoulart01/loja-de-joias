"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import {
  LogOut, User, Moon, Sun, Monitor, ChevronDown, ShoppingBag, LogIn
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context" // <<< O IMPORT CORRETO
import { useTheme } from "next-themes"
import Link from "next/link"

export function UserMenu() {
  const { usuario, isAdmin, logout, isLoading } = useAuth()
  const { setTheme, theme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (isLoading || !isMounted) {
    return (
      <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent/50">
        <User className="h-5 w-5 animate-pulse" />
      </Button>
    )
  }

  const themeConfig = {
    light: { icon: <Sun className="h-4 w-4" />, label: "Claro" },
    dark: { icon: <Moon className="h-4 w-4" />, label: "Escuro" },
    system: { icon: <Monitor className="h-4 w-4" />, label: "Sistema" },
  }
  const currentTheme = (theme as keyof typeof themeConfig) || "system"

  const SettingsSection = () => (
    <DropdownMenuGroup>
      <DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-2 py-1">
        Configurações
      </DropdownMenuLabel>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="cursor-pointer">
          <div className="flex items-center flex-1">
            {themeConfig[currentTheme].icon}
            <span className="ml-2">Tema</span>
          </div>
          <Badge variant="secondary" className="ml-auto text-xs">
            {themeConfig[currentTheme].label}
          </Badge>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
            <Sun className="mr-2 h-4 w-4" /> <span>Claro</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
            <Moon className="mr-2 h-4 w-4" /> <span>Escuro</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
            <Monitor className="mr-2 h-4 w-4" /> <span>Sistema</span>
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  )

  if (usuario) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-foreground hover:bg-accent/50 gap-2 relative group transition-all duration-200">
            <div className="relative">
              <User className="h-5 w-5" />
              {isAdmin && <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full animate-pulse" />}
            </div>
            <span className="hidden lg:inline font-light text-sm">{usuario.nome.split(" ")[0]}</span>
            <ChevronDown className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{usuario.nome}</p>
                <p className="text-xs leading-none text-muted-foreground">{isAdmin ? "Administrador" : "Cliente"}</p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/perfil" className="flex items-center">
                <User className="mr-2 h-4 w-4" /> <span>Meu Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/pedidos" className="flex items-center">
                <ShoppingBag className="mr-2 h-4 w-4" /> <span>Meus Pedidos</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <SettingsSection />
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" /> <span>Sair da Conta</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-foreground hover:bg-accent/50 gap-2">
          <User className="h-5 w-5" />
          <span className="hidden lg:inline font-light text-sm">Login/Cadastro</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/login" className="flex items-center">
              <LogIn className="mr-2 h-4 w-4" /> <span>Entrar na Conta</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/cadastro" className="flex items-center">
              <User className="mr-2 h-4 w-4" /> <span>Criar Conta</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <SettingsSection />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}