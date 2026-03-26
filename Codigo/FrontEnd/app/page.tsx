"use client";

import { useProducts } from "@/contexts/product-context";
import { Header } from "@/components/header";
import { CategoryNav } from "@/components/category-nav";
import { HeroBanner } from "@/components/hero-banner";
import { ProductSection } from "@/components/product-section";
import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";
import { CartSidebar } from "@/components/cart-sidebar";
import { Button } from "@/components/ui/button";
import { Package, WifiOff } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context"; 
import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function ProductGridSkeleton() {
  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
       <h2 className="luxury-title text-xl sm:text-2xl md:text-3xl text-foreground mb-4 sm:mb-6 text-center">Carregando Novidades...</h2>
       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-2 sm:space-y-3">
            <Skeleton className="h-[150px] sm:h-[250px] w-full rounded-lg" />
            <Skeleton className="h-3 sm:h-4 w-full rounded" />
            <Skeleton className="h-3 sm:h-4 w-1/2 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { products } = useProducts();
  const { isAdmin } = useAuth();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");
  const categoryFilter = searchParams.get("category");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (products !== undefined) {
      setIsLoading(false);
    }
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products || [];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p: any) =>
          p.name?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          (p.categoriaNome && p.categoriaNome.toLowerCase().includes(query))
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((p: any) => 
        p.categoriaNome && p.categoriaNome.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    return filtered;
  }, [products, searchQuery, categoryFilter]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <CategoryNav />
        <main>
          {!searchQuery && !categoryFilter && <HeroBanner />}
          <ProductGridSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
     return (
      <div className="container mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center px-3 sm:px-4">
        <WifiOff className="h-12 w-12 sm:h-16 sm:w-16 text-destructive mb-4 sm:mb-6" />
        <h2 className="luxury-title text-xl sm:text-2xl md:text-3xl text-foreground mb-2 sm:mb-3">Erro de Conexão</h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-4 sm:mb-6 leading-relaxed">Não foi possível carregar os produtos. Verifique sua conexão com a internet ou se o servidor backend está online.</p>
        <Button onClick={() => window.location.reload()} className="mt-4 sm:mt-6 h-9 sm:h-10 md:h-12 text-xs sm:text-sm px-4 sm:px-6">Tentar Novamente</Button>
      </div>
    );
  }

  // TRANSFORMAÇÃO DE DADOS: Removido 'views'
  const transformedProducts = (filteredProducts as any[]).map((p) => ({
    id: Number(p.id),
    name: p.name || "Produto sem nome",
    price: p.price || p.currentPrice || 0,
    originalPrice: p.originalPrice || p.price || 0,
    image: p.image || p.imageUrl || "/placeholder.svg",
    isOnSale: p.isOnSale || p.onSale || false,
  }));

  const novidades = transformedProducts.slice(0, 4);
  const promocoes = transformedProducts.filter((p) => p.isOnSale).slice(0, 4);
  const maisVendidos = transformedProducts.slice(0, 4);

  const hasProducts = filteredProducts.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CategoryNav />
      <CartSidebar />
      <main>
        {!searchQuery && !categoryFilter && <HeroBanner />}
        {(searchQuery || categoryFilter) && (
          <div className="container mx-auto px-4 py-8">
            <h2 className="luxury-title text-2xl text-foreground mb-2">
              {searchQuery ? `Resultados para "${searchQuery}"` : `Categoria: ${categoryFilter}`}
            </h2>
            <p className="text-muted-foreground mb-6">{filteredProducts.length} produtos encontrados</p>
          </div>
        )}
        {!hasProducts ? (
          <div className="container mx-auto px-4 py-20 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="luxury-title text-2xl text-foreground">
                {searchQuery || categoryFilter ? "Nenhum produto encontrado" : "Nenhum produto disponível"}
              </h2>
              <p className="text-muted-foreground">
                {searchQuery || categoryFilter
                  ? "Tente buscar por outros termos ou explore outras categorias."
                  : isAdmin
                  ? "Comece adicionando produtos à sua loja para que os clientes possam vê-los aqui."
                  : "Estamos preparando produtos incríveis para você. Volte em breve!"}
              </p>
              {isAdmin && !searchQuery && !categoryFilter && (
                <Link href="/perfil/admin/produtos/new">
                  <Button size="lg" className="btn-luxury">
                    Adicionar Primeiro Produto
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            {searchQuery || categoryFilter ? (
              <ProductSection title="PRODUTOS" products={transformedProducts} />
            ) : (
              <>
                {novidades.length > 0 && <ProductSection title="NOVIDADES" products={novidades} />}
                {promocoes.length > 0 && <ProductSection title="PROMOÇÕES" products={promocoes} />}
                {maisVendidos.length > 0 && <ProductSection title="MAIS VENDIDOS" products={maisVendidos} />}
              </>
            )}
          </>
        )}
        {/* {!searchQuery && !categoryFilter && <Testimonials />} */}
      </main>
      <Footer />
    </div>
  );
}