// contexts/cart-context.tsx
"use client"

import type React from "react"
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { api } from "@/services/api"
import { useToast } from "@/hooks/use-toast"

// 1. Interface alinhada com o DTO do Backend
export interface CartItemResponse {
  id: number
  produtoId: number
  varianteId?: number
  nomeProduto: string
  precoUnitario: number
  precoOriginalUnitario?: number
  quantidade: number
  tamanho?: string
  cor?: string
  imagemUrl: string
  subtotal: number
}

export interface CartResponse {
  id: number
  sessaoId: string
  itens: CartItemResponse[]
  cupomCodigo?: string
  desconto: number
  cepFrete?: string
  valorFrete: number
  subtotal: number
  total: number
  quantidadeTotal: number
  finalizado: boolean
}

// Interface para o que o contexto vai prover
interface CartContextType {
  cart: CartResponse | null
  isLoading: boolean
  error: string | null
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  addItem: (item: { produtoId: number; varianteId?: number; quantidade: number }) => Promise<void>
  removeItem: (produtoId: number, varianteId?: number) => Promise<void>
  updateQuantity: (produtoId: number, varianteId: number | undefined, quantidade: number) => Promise<void>
  applyCoupon: (codigo: string) => Promise<void>
  removeCoupon: () => Promise<void>
  clearCart: () => Promise<void>
}

// 2. Criação do Contexto
const CartContext = createContext<CartContextType | undefined>(undefined)

// 3. O novo Provider
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  // Função para buscar o carrinho do backend
  const fetchCart = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await api.get("/carrinho")
      setCart(response.data)
      setError(null)
    } catch (err: any) {
      console.error("Falha ao buscar carrinho:", err)
      setError("Não foi possível carregar seu carrinho.")
      toast({
        title: "Erro no Carrinho",
        description: "Não foi possível carregar seu carrinho. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // 4. Busca o carrinho na primeira vez que o app carrega
  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // 5. Funções assíncronas que chamam a API
  const addItem = async (item: { produtoId: number; varianteId?: number; quantidade: number }) => {
    try {
      // O backend já retorna o carrinho atualizado
      const response = await api.post<CartResponse>("/carrinho/itens", item)
      setCart(response.data)
      setIsOpen(true) // Abre o carrinho ao adicionar
    } catch (err: any) {
      console.error("Falha ao adicionar item:", err)
      toast({
        title: "Erro",
        description: err.response?.data?.message || "Não foi possível adicionar o item.",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (produtoId: number, varianteId?: number) => {
    try {
      const response = await api.delete<CartResponse>("/carrinho/itens", {
        params: { produtoId, varianteId },
      })
      setCart(response.data)
      toast({
        title: "Item removido",
      })
    } catch (err: any) {
      console.error("Falha ao remover item:", err)
      toast({
        title: "Erro",
        description: "Não foi possível remover o item.",
        variant: "destructive",
      })
    }
  }

  const updateQuantity = async (produtoId: number, varianteId: number | undefined, quantidade: number) => {
    if (quantidade <= 0) {
      await removeItem(produtoId, varianteId)
      return
    }
    try {
      const response = await api.put<CartResponse>("/carrinho/itens", null, {
        params: { produtoId, varianteId, quantidade },
      })
      setCart(response.data)
    } catch (err: any) {
      console.error("Falha ao atualizar quantidade:", err)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a quantidade.",
        variant: "destructive",
      })
    }
  }

  const applyCoupon = async (codigo: string) => {
    try {
      const response = await api.post<CartResponse>("/carrinho/cupom", null, {
        params: { codigoCupom: codigo },
      })
      setCart(response.data)
      toast({
        title: "Cupom aplicado!",
      })
    } catch (err: any) {
      console.error("Falha ao aplicar cupom:", err)
      toast({
        title: "Cupom Inválido",
        description: err.response?.data?.message || "Não foi possível aplicar este cupom.",
        variant: "destructive",
      })
    }
  }

  const removeCoupon = async () => {
  try {
    const response = await api.delete<CartResponse>("/carrinho/cupom")
    setCart(response.data)
    toast({
      title: "Cupom removido",
      description: "Cupom removido com sucesso do carrinho",
    })
  } catch (err: any) {
    console.error("Falha ao remover cupom:", err)
    toast({
      title: "Erro",
      description: err.response?.data?.message || "Não foi possível remover o cupom.",
      variant: "destructive",
    })
  }
}

  const clearCart = async () => {
    try {
      await api.delete("/carrinho")
      // Recarrega o carrinho vazio do backend
      await fetchCart()
      toast({
        title: "Carrinho limpo",
      })
    } catch (err: any) {
      console.error("Falha ao limpar carrinho:", err)
      toast({
        title: "Erro",
        description: "Não foi possível limpar o carrinho.",
        variant: "destructive",
      })
    }
  }

  // 6. Valor do contexto
  const value: CartContextType = {
    cart,
    isLoading,
    error,
    isOpen,
    setIsOpen,
    addItem,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// 7. Hook 'useCart'
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}