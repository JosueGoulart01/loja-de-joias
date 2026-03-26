"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useProducts } from "@/contexts/product-context";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartSidebar } from "@/components/cart-sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailPageClient() {
  const params = useParams();
  const router = useRouter();
  const { getProduct, isLoading: areProductsLoading } = useProducts();
  
  const { addItem } = useCart(); 
  
  const { isAdmin } = useAuth();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // O ID da URL vem como string
  const productIdString = params.id as string;

  const [product, setProduct] = useState(() => getProduct(productIdString));

  useEffect(() => {
    if (!areProductsLoading && !product) {
      router.push("/404");
    }
  }, [areProductsLoading, product, router]);

  if (areProductsLoading || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
            <div className="grid gap-8 md:grid-cols-2">
                <Skeleton className="aspect-square rounded-lg" />
                <div className="space-y-6">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = async () => {
    // Validação de tamanho se houver variantes
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Por favor, selecione um tamanho");
      return;
    }

    setIsAddingToCart(true);
    
    let varianteId: number | undefined = undefined;
    
    if (selectedSize && product.sizes) {
        const selectedVariant = product.sizes.find(s => s.size === selectedSize);
        if (selectedVariant) {
            // Garante conversão caso o ID da variante venha como string
            varianteId = Number(selectedVariant.id);
        }
    }

    try {
      // CORREÇÃO DEFINITIVA: Convertendo explicitamente para Number
      await addItem({
          produtoId: Number(product.id), // Converte string '1' para number 1
          varianteId: varianteId,
          quantidade: 1
      });
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push("/checkout");
  };

  const availableStock = selectedSize
    ? product.sizes?.find((s) => s.size === selectedSize)?.stock || 0
    : product.generalStock;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <CartSidebar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          {isAdmin && (
            <Link href={`/perfil/admin/produtos/${product.id}/edit`}>
              <Button variant="outline">Editar Produto</Button>
            </Link>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted/30">
            <Image
              src={product.imageUrl || "/placeholder.svg?height=600&width=600"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="luxury-title mb-2 text-3xl text-foreground">{product.name}</h1>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{product.category}</Badge>
                <Badge variant="outline">{product.material}</Badge>
                <Badge variant="outline">{product.code}</Badge>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="luxury-serif text-3xl font-normal text-foreground">
                {formatPrice(product.currentPrice)}
              </span>
              {product.onSale && product.originalPrice > 0 && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <Badge className="bg-primary">OFERTA</Badge>
                </>
              )}
            </div>

            <p className="text-sm text-muted-foreground">ou 3x de {formatPrice(product.currentPrice / 3)} sem juros</p>

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="mb-2 block font-semibold text-sm">Tamanho</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger><SelectValue placeholder="Selecione o tamanho" /></SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size.id} value={size.size} disabled={size.stock === 0}>
                        Tamanho {size.size} {size.stock === 0 ? "(Esgotado)" : `(${size.stock} disponíveis)`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="text-sm">
              {availableStock > 0 ? (
                <span className="flex items-center gap-2 text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-600"></span>
                  Em estoque ({availableStock} unidades disponíveis)
                </span>
              ) : (
                <span className="flex items-center gap-2 text-red-600">
                  <span className="h-2 w-2 rounded-full bg-red-600"></span>
                  Fora de estoque
                </span>
              )}
            </div>

            <div className="space-y-3">
              <Button
                className="w-full btn-luxury h-12"
                size="lg"
                onClick={handleAddToCart}
                disabled={availableStock === 0 || isAddingToCart}
              >
                {isAddingToCart ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Adicionando...</>
                ) : (
                  <><ShoppingCart className="mr-2 h-5 w-5" /> Adicionar ao Carrinho</>
                )}
              </Button>
              <Button
                className="w-full h-12 bg-transparent"
                size="lg"
                variant="outline"
                onClick={handleBuyNow}
                disabled={availableStock === 0 || isAddingToCart}
              >
                Comprar Agora
              </Button>
            </div>

            {product.details && product.details.length > 0 && (
              <Card className="p-6"><h2 className="luxury-serif mb-4 text-xl font-semibold">Detalhes do Produto</h2><ul className="space-y-2">{product.details.map((detail, index) => (<li key={index} className="flex items-start gap-2"><span className="text-primary">•</span><span className="text-sm text-muted-foreground">{detail}</span></li>))}</ul></Card>
            )}

            {product.description && (
              <Card className="p-6"><h2 className="luxury-serif mb-4 text-xl font-semibold">Descrição</h2><p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p></Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}