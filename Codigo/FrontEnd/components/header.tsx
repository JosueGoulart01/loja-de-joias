"use client"

import Link from "next/link"
import Image from "next/image" 
import { ShoppingBag, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"

export function Header() {
  const { cart, isOpen, setIsOpen } = useCart()
  const { usuario, isAdmin, logout } = useAuth()
  const totalItems = cart?.quantidadeTotal || 0

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 sm:h-20 md:h-24 items-center justify-between px-3 sm:px-4 md:px-6">
        
        <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
          {/* Menu Mobile */}
          <Sheet>
            {/* CORREÇÃO: Removido 'asChild' e usado o Button diretamente como trigger sem envolver lógica complexa de ref */}
            <SheetTrigger className="lg:hidden shrink-0 h-10 w-10 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
            </SheetTrigger>

            <SheetContent side="left">
              <SheetHeader>
                  <SheetTitle className="text-left luxury-serif text-lg">Menu</SheetTitle>
                  <SheetDescription className="sr-only">Navegação principal</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">Home</Link>
                
                {isAdmin && (
                <>
                  <div className="h-px bg-border my-2" />
                  <span className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Administração</span>
                  <Link href="/perfil/admin" className="pl-2 text-base hover:text-primary">Painel Geral</Link>
                  <Link href="/perfil/admin/pedidos" className="pl-2 text-base hover:text-primary">Pedidos</Link>
                  <Link href="/perfil/admin/produtos" className="pl-2 text-base hover:text-primary">Produtos</Link>
                  <Link href="/perfil/admin/estoque" className="pl-2 text-base hover:text-primary">Estoque</Link>
                </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 md:gap-3 group select-none shrink-0">
            <div className="relative h-8 w-6 sm:h-12 sm:w-8 md:h-16 md:w-10 transition-transform duration-300 group-hover:scale-105">
               <Image
                 src="/logo-detalhe-colar.svg"
                 alt="Logo Detalhe Prata"
                 fill
                 className="object-contain"
                 priority
               />
            </div>
            <span className="luxury-title text-base sm:text-lg md:text-2xl text-foreground tracking-wider mt-1 transition-colors group-hover:text-primary/90">
              Detalhes em Prata
            </span>
          </Link>
        </div>

        {/* Lado Direito */}
        <div className="flex items-center justify-end gap-1 sm:gap-2">
          {/* Botão Carrinho */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-10 w-10 sm:h-12 sm:w-12 hover:bg-primary/5 transition-colors" 
            onClick={() => setIsOpen(!isOpen)}
          >            
            <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-foreground/80" />
            {totalItems > 0 && (
              <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-primary text-[10px] sm:text-xs text-primary-foreground flex items-center justify-center font-bold border-2 border-background shadow-sm">
                {totalItems}
              </span>
            )}
            <span className="sr-only">Abrir Carrinho</span>
          </Button>

          {/* Menu Usuário */}
          {usuario ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                 {/* CORREÇÃO: Evitar asChild aqui também se o Button não tiver forwardRef */}
                 <div className="h-10 w-10 sm:h-12 sm:w-12 inline-flex items-center justify-center rounded-md hover:bg-primary/5 transition-colors cursor-pointer">
                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-foreground/80" />
                    <span className="sr-only">Menu Usuário</span>
                 </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/perfil" className="cursor-pointer w-full block">Minha Conta</Link>
                </DropdownMenuItem>
                {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/perfil/admin" className="cursor-pointer w-full block font-medium">Painel Admin</Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer focus:text-destructive">
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" size="sm" className="text-sm sm:text-base font-medium px-4 h-10 hover:bg-primary/5">
              <Link href="/login">Entrar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}