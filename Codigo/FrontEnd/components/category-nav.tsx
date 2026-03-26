"use client"

import { Sparkles, CircleDot, Gem, Replace as Necklace, Heart, Watch, Star, Users, Wrench, LucideIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useCategories } from "@/contexts/category-context"
import { useEffect, useState } from "react"

// 1. Mapeamento de nomes de categorias para Ícones
// A chave deve bater exatamente com o nome que você salva no banco (Case Insensitive no código abaixo)
const ICON_MAP: Record<string, LucideIcon> = {
  "lançamentos": Sparkles,
  "aneis": CircleDot,
  "anéis": CircleDot, // Tratando acentuação
  "brincos": Gem,
  "colares": Necklace,
  "conjuntos": Heart,
  "pulseiras": Watch,
  "berloques": Star,
  "masculino": Users,
  "suprimentos": Wrench,
}

// Ícone padrão para novas categorias criadas pelo admin que não estão no mapa acima
const DEFAULT_ICON = Sparkles 

export function CategoryNav() {
  // 2. Consumindo os dados reais do contexto
  const { categories, isLoading } = useCategories()
  
  // Estado local para garantir que a hidratação do HTML seja correta
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 3. Filtrar apenas as categorias ativas
  // Se o contexto ainda estiver carregando, mostramos uma lista vazia ou esqueleto
  const activeCategories = categories ? categories.filter((cat) => cat.ativa) : []

  // Função auxiliar para gerar URL amigável (ex: "Anéis de Ouro" -> "aneis-de-ouro")
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/\s+/g, "-")
  }

  // Função para pegar o ícone com base no nome
  const getIcon = (name: string) => {
    const normalizedName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    return ICON_MAP[normalizedName] || DEFAULT_ICON
  }

  // Evita flash de conteúdo incorreto antes do cliente carregar
  if (!mounted) return null 

  return (
    <nav
      className="sticky top-16 sm:top-20 md:top-24 z-40 bg-card/60 backdrop-blur-sm border-b border-border/50 shadow-sm"
      aria-label="Navegação de categorias"
    >
      <div className="container mx-auto px-2 sm:px-4 md:px-6">
        <div className="flex items-center justify-start lg:justify-center gap-0.5 sm:gap-1 overflow-x-auto scrollbar-hide py-2 sm:py-3">
          
          {/* Opcional: Se estiver carregando, você pode colocar um skeleton aqui */}
          {isLoading && activeCategories.length === 0 && (
            <div className="text-xs sm:text-sm text-muted-foreground animate-pulse">Carregando categorias...</div>
          )}

          {activeCategories.map((category) => {
            const IconComponent = getIcon(category.nome)
            const slug = generateSlug(category.nome)

            return (
              <Link
                key={category.id || category.nome}
                href={`/?category=${slug}`}
                className={cn(
                  "group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-light whitespace-nowrap shrink-0",
                  "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                  "transition-all duration-300 hover:scale-105",
                  "border border-transparent hover:border-border/30",
                )}
                aria-label={`Ver produtos da categoria ${category.nome}`}
              >
                <IconComponent 
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5 shrink-0 group-hover:scale-110 transition-transform duration-300" 
                />
                <span className="tracking-wide capitalize text-[11px] sm:text-xs md:text-sm">{category.nome}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}