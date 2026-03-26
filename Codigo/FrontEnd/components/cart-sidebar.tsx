"use client"

import { X, Minus, Plus, Trash2, ShoppingBag, Tag, Truck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Link from "next/link"
import { useCart, type CartItemResponse } from "@/contexts/cart-context"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet" // IMPORTANTE

export function CartSidebar() {
  const {
    cart,
    isOpen,
    setIsOpen,
    isLoading,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCart()

  const [couponInput, setCouponInput] = useState("")
  const [cepInput, setCepInput] = useState("") 
  const [couponError, setCouponError] = useState("")
  const [isValidating, setIsValidating] = useState(false)

  const formatPrice = (price: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)

  const subtotal = cart?.subtotal || 0
  const discountAmount = cart?.desconto || 0
  const total = cart?.total || 0
  const items = cart?.itens || [] 

  const handleApplyCoupon = async () => {
    setCouponError("")
    if (!couponInput.trim()) {
      setCouponError("Digite um cupom")
      return
    }
    setIsValidating(true)
    try {
      await applyCoupon(couponInput.toUpperCase())
      setCouponInput("") 
    } catch (error: any) {
      setCouponError(error.response?.data?.message || "Erro ao validar cupom")
    } finally {
      setIsValidating(false)
    }
  }

  const handleQuantityChange = async (item: CartItemResponse, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(item.produtoId, item.varianteId)
    } else {
      await updateQuantity(item.produtoId, item.varianteId, newQuantity)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-border/50">
        
        {/* CORREÇÃO BUG-03: Título e Descrição Obrigatórios para Acessibilidade */}
        <SheetHeader className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-border/30 bg-background/50 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
            <SheetTitle className="luxury-serif text-base sm:text-lg text-foreground font-normal">Minha Sacola</SheetTitle>
          </div>
          <SheetDescription className="sr-only">
            Seus itens selecionados para compra
          </SheetDescription>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full -mr-1 sm:-mr-2 h-8 w-8 sm:h-10 sm:w-10">
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </SheetHeader>

        {isLoading ? (
           <div className="flex-1 flex items-center justify-center">
             <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary animate-spin" />
           </div>
        ) : !cart || items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 rounded-full bg-muted/50 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
            <h3 className="luxury-serif text-base sm:text-lg md:text-xl text-foreground mb-2 sm:mb-3">Sua sacola está vazia</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 max-w-xs mx-auto leading-relaxed">
              Descubra nossa coleção exclusiva de semijoias em prata e adicione suas peças favoritas
            </p>
            <Button onClick={() => setIsOpen(false)} className="btn-luxury px-4 sm:px-6 h-9 sm:h-10 text-xs sm:text-sm">
              Explorar Coleção
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
              <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-6 sm:mb-8">
                {items.map((item: CartItemResponse) => (
                  <div key={item.id} className="flex gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-4 border border-border/30 rounded-sm bg-background/30 text-xs sm:text-sm">
                    <img src={item.imagemUrl || "/placeholder.svg"} alt={item.nomeProduto} className="w-14 h-14 sm:w-20 sm:h-20 object-cover rounded-sm bg-secondary/20 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-light text-xs sm:text-sm text-foreground mb-0.5 sm:mb-1 truncate">{item.nomeProduto}</h3>
                      {item.tamanho && <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-2">Tamanho: {item.tamanho}</p>}
                      
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 sm:gap-2 bg-muted/30 rounded-sm p-0.5">
                          <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7 hover:bg-accent/50" onClick={() => handleQuantityChange(item, item.quantidade - 1)} disabled={isLoading}>
                            <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          </Button>
                          <span className="w-4 text-center text-xs font-medium">{item.quantidade}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7 hover:bg-accent/50" onClick={() => handleQuantityChange(item, item.quantidade + 1)} disabled={isLoading}>
                            <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground hover:text-destructive shrink-0" onClick={() => removeItem(item.produtoId, item.varianteId)} disabled={isLoading}>
                          <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        </Button>
                      </div>
                      <div className="flex justify-end mt-1 sm:mt-2">
                        <span className="luxury-serif text-xs sm:text-sm font-medium">{formatPrice(item.subtotal)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cupom */}
              <div className="mb-4 sm:mb-6 p-2.5 sm:p-3 md:p-4 bg-accent/10 rounded-sm border border-border/30 text-xs sm:text-sm">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                  <h3 className="font-light text-xs sm:text-sm text-foreground">Cupom de desconto</h3>
                </div>
                <div className="flex gap-1.5 sm:gap-2">
                  <Input placeholder="Código" value={couponInput} onChange={(e) => { setCouponInput(e.target.value); setCouponError("") }} className="flex-1 h-8 sm:h-9 text-xs bg-background/50" disabled={!!cart.cupomCodigo || isValidating} />
                  <Button onClick={handleApplyCoupon} variant="outline" size="sm" className="h-8 sm:h-9 px-2 sm:px-3 text-xs shrink-0" disabled={!!cart.cupomCodigo || isValidating}>
                    {isValidating ? <Loader2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 animate-spin" /> : "Aplicar"}
                  </Button>
                </div>
                {couponError && <p className="text-[10px] sm:text-xs text-destructive mt-1.5 font-light">{couponError}</p>}
                {cart.cupomCodigo && (
                  <div className="flex items-center justify-between mt-1.5 sm:mt-2 bg-green-500/10 p-1.5 sm:p-2 rounded text-xs">
                    <p className="text-[10px] sm:text-xs text-green-600 font-medium truncate">Cupom "{cart.cupomCodigo}" ativo</p>
                    <Button variant="ghost" size="sm" onClick={removeCoupon} className="h-5 text-[10px] text-muted-foreground hover:text-destructive px-1.5 shrink-0">Remover</Button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border/30 p-3 sm:p-4 md:p-6 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
              <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-light">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base sm:text-lg pt-1.5 sm:pt-2 border-t">
                  <span className="luxury-serif">Total</span>
                  <span className="luxury-serif">{formatPrice(total)}</span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground text-center">
                    Frete calculado no checkout
                </p>
              </div>
              <Link href="/checkout" onClick={() => setIsOpen(false)} className="block">
                <Button className="w-full btn-luxury h-9 sm:h-10 md:h-12 text-xs sm:text-sm tracking-wider uppercase">
                  Finalizar Compra
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}