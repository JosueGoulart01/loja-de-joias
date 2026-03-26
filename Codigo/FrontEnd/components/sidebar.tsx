"use client"

// <<< AQUI ESTÁ A CORREÇÃO >>>
import { Menu, Sparkles, Syringe as Ring, Gem, Heart, Replace as Necklace, Users, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCategories } from "@/contexts/category-context"
import { Skeleton } from "@/components/ui/skeleton"

// Dicionário para mapear o nome da categoria (do backend) para o ícone
const iconMap: { [key: string]: React.ElementType } = {
  "Lançamento/Reposição": Sparkles, // Corrigido para bater com o nome do seu backend
  "Aneis": Ring,
  "Brincos": Gem,
  "Colares": Necklace,
  "Conjuntos": Heart,
  "Pulseiras": Ring,
  "Berloques": Sparkles,
  "Masculino": Users,
  "Suprimentos": Wrench,
}

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

// Componente de Skeletons para o estado de carregamento
function LoadingSkeleton({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3">
          <Skeleton className="h-5 w-5 rounded" />
          {isOpen && <Skeleton className="h-4 w-32 rounded" />}
        </div>
      ))}
    </div>
  )
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { categories, isLoading } = useCategories()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      <aside
        className={`
        fixed left-0 top-0 h-full bg-card/95 backdrop-blur-sm border-r border-border/50 z-50 transition-all duration-500 ease-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isOpen ? "w-72" : "md:w-20"}
        shadow-xl md:shadow-none
      `}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-start p-6 border-b border-border/30">
            <Button
              variant="ghost"
              onClick={onToggle}
              className="flex items-center gap-3 text-foreground hover:bg-accent/50 px-4 py-3 h-auto rounded-sm transition-all duration-300"
            >
              <Menu className="h-5 w-5" />
              {isOpen && <span className="luxury-subtitle text-xs">Categorias</span>}
            </Button>
          </div>

          <nav className="flex-1 p-6 overflow-y-auto">
            {isLoading ? (
              <LoadingSkeleton isOpen={isOpen} />
            ) : (
              <div className="space-y-1">
                {categories
                  .filter(category => category.ativa) // Mostra apenas categorias ativas
                  .map((category) => {
                    const IconComponent = iconMap[category.nome] || Gem // Pega o ícone
                    
                    return (
                      <Link
                        key={category.id}
                        href={`/produtos?category=${encodeURIComponent(category.nome)}`}
                        onClick={isOpen ? onToggle : undefined} // Fecha o menu mobile ao clicar
                        className={`
                          group flex items-center gap-4 px-4 py-3 rounded-sm text-sm font-light transition-all duration-300
                          hover:bg-accent/50 hover:text-foreground text-muted-foreground
                          hover:translate-x-1 hover:shadow-sm
                          ${isOpen ? "justify-start" : "justify-center md:justify-center"}
                        `}
                        title={!isOpen ? category.nome : undefined}
                      >
                        <IconComponent className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                        {isOpen && (
                          <span className="tracking-wide group-hover:tracking-wider transition-all duration-300">
                            {category.nome}
                          </span>
                        )}
                      </Link>
                    )
                  })}
              </div>
            )}
          </nav>

          {isOpen && (
            <div className="p-6 border-t border-border/30">
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-light tracking-wide">Detalhe Prata</p>
                <p className="text-xs text-muted-foreground/70 font-light mt-1">Elegância em cada detalhe</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}