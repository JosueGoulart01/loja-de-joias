export interface ProductSize {
  id: string
  size: string
  stock: number
  priceAdditional?: number
  image?: string
  color?: string
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
  // Campos opcionais para compatibilidade
  category?: string
  active?: boolean
  createdAt?: string
  updatedAt?: string
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