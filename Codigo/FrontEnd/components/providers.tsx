// components/providers.tsx
"use client"

import { ProductProvider } from "@/contexts/product-context"
import { CategoryProvider } from "@/contexts/category-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProductProvider>
      <CategoryProvider>
        {children}
      </CategoryProvider>
    </ProductProvider>
  )
}