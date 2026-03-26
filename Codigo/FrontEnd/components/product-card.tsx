"use client"

import type React from "react"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { api } from "@/services/api"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  isOnSale?: boolean
  views?: number
}

export function ProductCard({ id, name, price, originalPrice, image, isOnSale }: ProductCardProps) {
  const router = useRouter()

  const formatPrice = (price: number) => {
    if (typeof price !== "number" || isNaN(price)) return "R$ 0,00"
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
  }

  // Unifiquei a lógica: tanto o clique no card quanto no botão levam ao detalhe
  const handleNavigateToDetail = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    
    // Registra visualização (fire-and-forget)
    api.patch(`/produtos/${id}/visualizar`).catch(() => {})
    
    // Navega para a página de detalhes para escolher tamanho
    router.push(`/produtos/${id}`)
  }

  if (!id || !name) return null

  // Lógica para exibir preço original riscado apenas se fizer sentido
  const showOriginalPrice = (originalPrice || 0) > price && (originalPrice || 0) > 0;

  return (
    <Card
      className="product-card group overflow-hidden border-border/50 bg-card hover:border-primary/20 transition-all duration-500 cursor-pointer relative h-full flex flex-col"
      onClick={() => handleNavigateToDetail()}
    >
      <div className="relative aspect-square overflow-hidden bg-muted/30 shrink-0">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-full mx-auto object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 sm:top-3 right-2 sm:right-3 text-muted-foreground hover:text-primary bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black backdrop-blur-sm h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-border/20 opacity-0 group-hover:opacity-100 transition-all duration-300"
          onClick={(e) => { e.stopPropagation(); console.log("Favoritos em breve"); }}
        >
          <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>

        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1.5 sm:gap-2">
            {isOnSale && (
            <Badge className="bg-primary text-primary-foreground px-2 py-0.5 text-xs font-light tracking-wide rounded-sm w-fit">
                OFERTA
            </Badge>
            )}
        </div>
      </div>

      <CardContent className="p-3 sm:p-4 md:p-5 flex flex-col grow">
        <h3 className="font-light text-foreground mb-2 sm:mb-3 line-clamp-2 text-xs sm:text-sm md:text-base leading-relaxed tracking-wide hover:text-primary transition-colors duration-200">
          {name}
        </h3>

        <div className="flex items-baseline gap-2 mb-1.5 sm:mb-2 flex-wrap">
          <span className="luxury-serif text-base sm:text-lg md:text-xl font-normal text-foreground">
            {formatPrice(price)}
          </span>
          
          {showOriginalPrice && (
            <span className="text-xs sm:text-sm text-muted-foreground line-through font-light">
              {formatPrice(originalPrice!)}
            </span>
          )}
        </div>

        <p className="text-[10px] sm:text-xs text-muted-foreground mb-3 sm:mb-4 font-light tracking-wide">
          ou 3x de {formatPrice(price / 3)} s/ juros
        </p>

        <Button
          className="w-full btn-luxury text-[11px] sm:text-xs md:text-sm font-light tracking-wider h-8 sm:h-10 mt-auto"
          onClick={handleNavigateToDetail}
        >
          <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 shrink-0" />
          <span>Ver Opções</span>
        </Button>
      </CardContent>
    </Card>
  )
}