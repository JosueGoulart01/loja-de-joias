"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { api } from "../services/api" // ✅ Usamos a API configurada com Token

export interface Category {
  id: number
  nome: string
  ativa: boolean
  produtosAssociados: number
}

interface CategoryContextType {
  categories: Category[]
  isLoading: boolean
  error: string | null
  fetchCategories: () => Promise<void>
  getCategory: (id: number) => Category | undefined
  updateCategory: (id: number, categoryData: { nome: string; ativa: boolean }) => Promise<void>
  createCategory: (categoryData: { nome: string; ativa: boolean }) => Promise<void>
  deleteCategory: (id: number) => Promise<void>
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined)

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log("🔄 Buscando categorias...")
      
      const response = await api.get("/categorias")
      
      const data = response.data
      console.log("✅ Categorias carregadas:", Array.isArray(data) ? data.length : 0)
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("❌ Erro ao buscar categorias:", err)
      setError("Erro ao carregar categorias")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getCategory = (id: number) => {
    return categories.find((category) => category.id === id)
  }

  const updateCategory = async (id: number, categoryData: { nome: string; ativa: boolean }): Promise<void> => {
    try {
      const response = await api.put(`/categorias/${id}`, categoryData)

      const updatedCategory = response.data
      setCategories(prev => prev.map((cat) => cat.id === id ? updatedCategory : cat))
      toast({ 
        title: "Sucesso", 
        description: "Categoria atualizada com sucesso." 
      })
    } catch (err: any) {
      console.error("Erro ao atualizar categoria:", err)
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data ||
                          "Não foi possível atualizar a categoria."
      
      toast({ 
        title: "Erro ao atualizar", 
        description: errorMessage, 
        variant: "destructive" 
      })
      throw new Error(errorMessage)
    }
  }

  const createCategory = async (categoryData: { nome: string; ativa: boolean }): Promise<void> => {
    try {
      const response = await api.post("/categorias", categoryData)

      const newCategory = response.data
      setCategories(prev => [...prev, newCategory])
      toast({ 
        title: "Sucesso", 
        description: "Categoria criada com sucesso." 
      })
    } catch (err: any) {
      console.error("Erro ao criar categoria:", err)
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data ||
                          "Não foi possível criar a categoria."
      
      toast({ 
        title: "Erro ao criar", 
        description: errorMessage, 
        variant: "destructive" 
      })
      throw new Error(errorMessage)
    }
  }

  const deleteCategory = async (id: number): Promise<void> => {
    try {
      await api.delete(`/categorias/${id}`)
      
      setCategories(prev => prev.filter(category => category.id !== id))
      toast({ 
        title: "Sucesso", 
        description: "Categoria removida com sucesso." 
      })
    } catch (err: any) {
      console.error("Erro ao deletar categoria:", err)
      
      // Captura a mensagem de erro específica do backend
      const errorMessage = err.response?.data?.message || 
                          err.response?.data ||
                          "Não foi possível deletar a categoria."
      
      toast({ 
        title: "Erro ao deletar", 
        description: errorMessage, 
        variant: "destructive" 
      })
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const value: CategoryContextType = {
    categories,
    isLoading,
    error,
    getCategory,
    updateCategory,
    createCategory,
    deleteCategory,
    fetchCategories,
  }

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>
}

export function useCategories() {
  const context = useContext(CategoryContext)
  if (context === undefined) {
    throw new Error("useCategories deve ser usado dentro de um CategoryProvider")
  }
  return context
}