import { api } from "./api" 
import type { Product, ProductSize } from "@/types/product"

// Interface interna para tipar o que vem do Java (Backend)
interface ProdutoBackend {
  id: number
  nome: string
  categoria: { id: number; nome: string } | null
  material: string
  code: string
  descricao: string
  precoBase: number
  precoOriginal: number
  ativo: boolean
  imagemPrincipal: string
  imagens: string[]
  details: string[]
  // O Java manda "variantes", não "sizes"
  variantes: {
    id: number
    tamanho: string
    estoque: number
    cor: string
    precoAdicional: number
  }[]
  generalStock?: number
}

// --- FUNÇÃO TRADUTORA (BACKEND -> FRONTEND) ---
function adaptarProdutoParaFrontend(produtoBack: ProdutoBackend): Product {
  // Calcula estoque total somando as variantes, se o backend não mandar
  const estoqueTotal = produtoBack.variantes?.reduce((acc, v) => acc + (v.estoque || 0), 0) || 0

  // Traduz "variantes" (Java) para "sizes" (React)
  const sizesAdaptados: ProductSize[] = (produtoBack.variantes || []).map(v => ({
    id: v.id.toString(),     // Java usa number, React usa string
    size: v.tamanho,         // Traduz tamanho -> size
    stock: v.estoque,        // Traduz estoque -> stock
    priceAdditional: v.precoAdicional,
    color: v.cor
  }))

  return {
    id: produtoBack.id.toString(),
    name: produtoBack.nome,
    categoriaId: produtoBack.categoria?.id.toString() || "",
    categoriaNome: produtoBack.categoria?.nome || "Sem Categoria",
    material: produtoBack.material,
    code: produtoBack.code,
    generalStock: produtoBack.generalStock || estoqueTotal, 
    currentPrice: produtoBack.precoBase,
    originalPrice: produtoBack.precoOriginal,
    onSale: (produtoBack.precoOriginal > produtoBack.precoBase),
    description: produtoBack.descricao,
    imageUrl: produtoBack.imagemPrincipal,
    details: produtoBack.details || [],
    sizes: sizesAdaptados, // <--- AQUI ESTÁ A MÁGICA PARA A PÁGINA DE ESTOQUE FUNCIONAR
    active: produtoBack.ativo
  }
}

export const produtoService = {
  // 1. Buscar Todos (Usado na Lista e no Estoque)
  getAll: async (): Promise<Product[]> => {
    const res = await api.get("/produtos")
    // Passa cada item pelo tradutor
    return res.data.map(adaptarProdutoParaFrontend)
  },

  // 2. Buscar por ID (Usado na Edição)
  getById: async (id: string): Promise<Product> => {
    const res = await api.get(`/produtos/${id}`)
    return adaptarProdutoParaFrontend(res.data)
  },

  // 3. Criar (Recebe payload já formatado para o backend)
  create: async (productData: any): Promise<void> => {
    await api.post("/produtos", productData)
  },

  // 4. Atualizar (Recebe payload já formatado para o backend)
  update: async (id: string, productData: any): Promise<void> => {
    await api.put(`/produtos/${id}`, productData)
  },

  // 5. Deletar
  delete: async (id: string): Promise<void> => {
    await api.delete(`/produtos/${id}`)
  }
}