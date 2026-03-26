"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import { api } from "@/services/api" // Importe sua api configurada

interface DecodedToken {
  sub: string 
  nome: string
  role: "ADMIN" | "USER" 
  exp: number
}

interface AuthContextType {
  usuario: DecodedToken | null
  isAdmin: boolean
  login: (token: string) => void // Mantivemos a assinatura, mas o login real acontece na página
  logout: () => void
  isLoading: boolean 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<DecodedToken | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token)
        if (decoded.exp * 1000 > Date.now()) {
          setUsuario(decoded)
        } else {
          localStorage.removeItem("authToken")
        }
      } catch (error) {
        console.error("Token inválido:", error)
        localStorage.removeItem("authToken")
      }
    }
    setIsLoading(false)
  }, [])

  const login = (token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token)
      localStorage.setItem("authToken", token)
      setUsuario(decoded)
      
      // Força recarregamento do carrinho após login para pegar os itens mesclados
      // Se você tiver acesso ao CartContext aqui, chame fetchCart(). 
      // Senão, o reload da página ou navegação resolve.
      
      router.push("/") 
      router.refresh() // Importante para atualizar os componentes de servidor/cliente
    } catch (error) {
      console.error("Falha ao processar token:", error)
    }
  }

  const logout = useCallback(() => {
    localStorage.removeItem("authToken")
    // Opcional: limpar sessão do carrinho também se quiser resetar tudo
    // localStorage.removeItem("detalheprata:cart-session-id") 
    setUsuario(null)
    router.push("/")
    router.refresh()
  }, [router])

  const isAdmin = usuario?.role === "ADMIN"

  const value = { usuario, isAdmin, login, logout, isLoading }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}