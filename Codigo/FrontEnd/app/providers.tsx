"use client"

import type React from "react"
import { Suspense } from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { ProductProvider } from "@/contexts/product-context"
import { CartProvider } from "@/contexts/cart-context"
import { CategoryProvider } from "@/contexts/category-context"
import { CouponProvider } from "@/contexts/coupon-context"
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <CategoryProvider>
          <ProductProvider>
            <CouponProvider> {/* ADICIONE AQUI */}
              <CartProvider>
                <Suspense fallback={null}>{children}</Suspense>
                <Toaster />
              </CartProvider>
            </CouponProvider> {/* FECHE AQUI */}
          </ProductProvider>
        </CategoryProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}