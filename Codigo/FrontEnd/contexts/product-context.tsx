"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api } from "@/services/api"

export interface ProductSize {
  id: string
  size: string
  stock: number
}

export interface Product {
  id: string
  name: string
  categoriaId: string
  categoriaNome: string
  material: string
  code: string
  generalStock: number
  currentPrice: number
  originalPrice: number
  onSale: boolean
  description: string
  imageUrl: string
  details: string[]
  sizes: ProductSize[]
  category?: string
  active?: boolean
}

export interface ProductFormData {
  name: string
  categoriaId: string
  categoriaNome: string
  material: string
  code: string
  generalStock: number
  currentPrice: number
  originalPrice: number
  onSale: boolean
  description: string
  imageUrl: string
  details: string[]
  sizes: ProductSize[]
}

interface ProductContextType {
  products: Product[]
  isLoading: boolean
  getProduct: (id: string) => Product | undefined
  createProduct: (productData: ProductFormData) => Promise<void>
  updateProduct: (id: string, productData: Partial<ProductFormData>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  fetchProducts: () => Promise<void>
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // --- TRADUTOR: BACKEND (Java) -> FRONTEND (React) ---
  const mapBackendToFrontend = (item: any): Product => {
    
    // Traduz as variantes
    const mappedSizes = item.variantes?.map((variante: any) => ({
      id: variante.id?.toString() || Date.now().toString(),
      size: variante.tamanho || "Único",
      stock: variante.estoque || 0
    })) || [];

    // --- CÁLCULO FORÇADO ---
    // O estoque geral visualizado será sempre a soma das variantes.
    const calculatedTotal = mappedSizes.reduce((acc: number, curr: any) => acc + (curr.stock || 0), 0);

    return {
      id: item.id?.toString() || '',
      name: item.nome || '',
      categoriaId: item.categoria?.id?.toString() || '',
      categoriaNome: item.categoria?.nome || '',
      material: item.material || '',
      code: item.code || '',
      generalStock: calculatedTotal, // <--- Aqui garantimos a sincronia
      currentPrice: item.precoBase ? Number(item.precoBase) : 0,
      originalPrice: item.precoOriginal ? Number(item.precoOriginal) : 0,
      onSale: item.emPromocao || false,
      description: item.descricao || '',
      imageUrl: item.imagemPrincipal || item.imagens?.[0] || '',
      details: item.details || item.detalhes || [],
      sizes: mappedSizes,
      category: item.categoria?.nome || '',
      active: item.ativo !== false
    }
  }

  const fetchProducts = async (): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await api.get("/produtos")
      const mappedProducts = response.data.map(mapBackendToFrontend)
      setProducts(mappedProducts)
    } catch (error) {
      console.error("❌ Erro ao buscar produtos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getProduct = (id: string): Product | undefined => {
    return products.find(product => product.id === id)
  }

  // --- CRIAR PRODUTO ---
  const createProduct = async (productData: ProductFormData): Promise<void> => {
    try {
      setIsLoading(true)
      
      const backendData = {
        nome: productData.name,
        categoriaId: Number(productData.categoriaId),
        material: productData.material,
        code: productData.code,
        descricao: productData.description,
        precoBase: productData.currentPrice,
        precoOriginal: productData.originalPrice || null,
        ativo: true,
        imagemPrincipal: productData.imageUrl || '',
        imagens: productData.imageUrl ? [productData.imageUrl] : [],
        details: productData.details || [],
        variantes: productData.sizes.map((size: ProductSize) => ({
          tamanho: size.size,
          cor: "Padrão",
          estoque: size.stock,
          precoAdicional: 0
        }))
      }

      await api.post("/produtos", backendData)
      await fetchProducts()
      
    } catch (error) {
      console.error("❌ Erro ao criar produto:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // --- ATUALIZAR PRODUTO ---
  const updateProduct = async (id: string, productData: Partial<ProductFormData>): Promise<void> => {
    try {
      setIsLoading(true)
      
      const backendData = {
        nome: productData.name,
        categoriaId: Number(productData.categoriaId),
        material: productData.material,
        code: productData.code,
        descricao: productData.description,
        precoBase: productData.currentPrice,
        precoOriginal: productData.originalPrice || null,
        ativo: true,
        imagemPrincipal: productData.imageUrl || '',
        imagens: productData.imageUrl ? [productData.imageUrl] : [],
        details: productData.details || [],
        variantes: productData.sizes?.map((size: ProductSize) => ({
          id: size.id && !isNaN(Number(size.id)) ? Number(size.id) : null,
          tamanho: size.size,
          cor: "Padrão",
          estoque: size.stock,
          precoAdicional: 0
        })) || []
      }

      await api.put(`/produtos/${id}`, backendData)
      await fetchProducts()
      
    } catch (error) {
      console.error("❌ Erro ao atualizar produto:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      setIsLoading(true)
      await api.delete(`/produtos/${id}`)
      await fetchProducts()
    } catch (error) {
      console.error("❌ Erro ao deletar produto:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const value: ProductContextType = {
    products,
    isLoading,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
  }

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProducts deve ser usado dentro de um ProductProvider")
  }
  return context
}