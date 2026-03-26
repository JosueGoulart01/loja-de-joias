"use client"

import { ProductCard } from "@/components/product-card"

interface Product {
  id: number | string
  name: string
  price: number
  originalPrice?: number
  image: string
  isOnSale?: boolean
  views?: number // Propriedade adicionada
}

interface ProductSectionProps {
  title: string
  products: Product[]
}

export function ProductSection({ title, products }: ProductSectionProps) {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="luxury-title text-3xl md:text-4xl text-foreground mb-4">{title}</h2>
          <div className="w-24 h-px bg-primary mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={String(product.id)}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              isOnSale={product.isOnSale}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductSection