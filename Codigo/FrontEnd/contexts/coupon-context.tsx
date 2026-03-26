"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { api } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context" // Importar Auth

export interface Coupon {
  id: number
  codigo: string
  tipoDesconto: "PORCENTAGEM" | "VALOR_FIXO"
  valor: number
  valorMinimoPedido: number
  quantidadeUsos: number
  usosRestantes: number
  ativo: boolean
  tipoCNPJ: boolean
}

interface CouponContextType {
  coupons: Coupon[]
  isLoading: boolean
  error: string | null
  getCoupon: (codigo: string) => Promise<Coupon | null>
  createCoupon: (couponData: Omit<Coupon, "id" | "usosRestantes">) => Promise<void>
  updateCoupon: (id: number, couponData: Partial<Omit<Coupon, "id">>) => Promise<void>
  deleteCoupon: (id: number) => Promise<void>
  toggleCouponStatus: (id: number) => Promise<void>
  refreshCoupons: () => Promise<void>
  validateCoupon: (
    codigo: string,
    valorPedido: number,
    usuarioId?: number // Opcional
  ) => Promise<{ valid: boolean; coupon?: Coupon; message?: string }>
}

const CouponContext = createContext<CouponContextType | undefined>(undefined)

export function CouponProvider({ children }: { children: ReactNode }) {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { isAdmin } = useAuth() // Verifica se é admin

  const fetchCoupons = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      // LÓGICA INTELIGENTE:
      // Se for Admin, busca TODOS (/api/cupons)
      // Se for Cliente, busca apenas ATIVOS (/api/cupons/ativos)
      // Isso evita o erro 403 Forbidden no console
      const endpoint = isAdmin ? "/cupons" : "/cupons/ativos"
      
      const response = await api.get(endpoint)
      setCoupons(response.data)
    } catch (err: any) {
      // Se mesmo assim der erro (ex: rede), tratamos silenciando se não for admin
      if (err.response?.status === 403 && !isAdmin) {
         setCoupons([]) // Cliente vê lista vazia sem erro
      } else {
         setError("Não foi possível carregar os cupons.")
         console.error("Falha ao buscar cupons:", err)
      }
    } finally {
      setIsLoading(false)
    }
  }, [isAdmin]) // Re-executa se o status de admin mudar

  useEffect(() => {
    fetchCoupons()
  }, [fetchCoupons])

  const getCoupon = async (codigo: string): Promise<Coupon | null> => {
    try {
      const response = await api.get(`/cupons/codigo/${codigo}`)
      return response.data
    } catch (error) {
      // Silencia erro 404 (cupom não encontrado)
      return null
    }
  }

  // ... MÉTODOS DE ADMIN (CREATE, UPDATE, DELETE) ...
  const createCoupon = async (couponData: Omit<Coupon, "id" | "usosRestantes">) => {
    try {
      await api.post("/cupons", couponData)
      toast({ title: "Sucesso!", description: `Cupom "${couponData.codigo}" criado.` })
      await fetchCoupons()
    } catch (error: any) {
      const msg = error.response?.data?.message || "Erro ao criar cupom."
      toast({ title: "Erro", description: msg, variant: "destructive" })
      throw error
    }
  }

  const updateCoupon = async (id: number, couponData: Partial<Omit<Coupon, "id">>) => {
    try {
      await api.put(`/cupons/${id}`, couponData)
      toast({ title: "Sucesso!", description: "Cupom atualizado." })
      await fetchCoupons()
    } catch (error: any) {
        const msg = error.response?.data?.message || "Erro ao atualizar."
        toast({ title: "Erro", description: msg, variant: "destructive" })
      throw error
    }
  }

  const deleteCoupon = async (id: number) => {
    try {
      await api.delete(`/cupons/${id}`)
      toast({ title: "Sucesso!", description: "Cupom excluído." })
      setCoupons((prev) => prev.filter((c) => c.id !== id))
    } catch (error: any) {
      toast({ title: "Erro", description: "Erro ao excluir.", variant: "destructive" })
    }
  }

  const toggleCouponStatus = async (id: number) => {
  try {
    // Use PUT em vez de PATCH
    await api.put(`/cupons/${id}/ativo`)
    await fetchCoupons()
    toast({ title: "Sucesso!", description: "Status do cupom alterado." })
  } catch (error: any) {
    toast({ 
      title: "Erro", 
      description: error.response?.data?.message || "Erro ao alterar status.", 
      variant: "destructive" 
    })
  }
}

  const validateCoupon = async (
    codigo: string,
    valorPedido: number,
    usuarioId?: number
  ): Promise<{ valid: boolean; coupon?: Coupon; message?: string }> => {
    try {
      // Usamos o endpoint de validação do backend que agora suporta usuarioId
      const payload = { codigo, valorPedido, usuarioId }
      
      const response = await api.post("/cupons/validar", payload)
      const data = response.data

      if (data.valido) {
          return { valid: true, coupon: data.cupom }
      } else {
          return { valid: false, message: data.mensagem }
      }
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || "Erro ao validar cupom"
      return { valid: false, message: msg }
    }
  }

  const value: CouponContextType = {
    coupons,
    isLoading,
    error,
    getCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus,
    refreshCoupons: fetchCoupons,
    validateCoupon,
  }

  return <CouponContext.Provider value={value}>{children}</CouponContext.Provider>
}

export function useCoupons() {
  const context = useContext(CouponContext)
  if (context === undefined) {
    throw new Error("useCoupons must be used within a CouponProvider")
  }
  return context
}