import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"

// Importação dos Provedores de Contexto
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { ProductProvider } from "@/contexts/product-context"
import { CartProvider } from "@/contexts/cart-context"
import { CouponProvider } from "@/contexts/coupon-context"
import { CategoryProvider } from "@/contexts/category-context"
import { Toaster } from "@/components/ui/toaster"

import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Detalhe Prata - Semijoias Elegantes",
  description:
    "Descubra nossa coleção exclusiva de semijoias em prata. Qualidade premium, designs únicos e preços acessíveis.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body 
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${playfair.variable}`}
        suppressHydrationWarning // <--- ADICIONADO PARA CORRIGIR ERRO DE HIDRATAÇÃO
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CategoryProvider>
              <ProductProvider>
                <CouponProvider>
                  <CartProvider>
                    <Suspense fallback={null}>{children}</Suspense>
                    <Toaster />
                  </CartProvider>
                </CouponProvider>
              </ProductProvider>
            </CategoryProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}