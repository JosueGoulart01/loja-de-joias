"use client"

import { useProducts } from "@/contexts/product-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Pencil, Plus, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { AdminRouteGuard } from "@/components/admin-route-guard"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminProductsPage() {
  const { products, deleteProduct, isLoading } = useProducts()
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // ✅ CORREÇÃO: Busca segura com verificação de campos
  const filteredProducts = (products || []).filter((product) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      product.name?.toLowerCase().includes(searchLower) ||
      product.categoriaNome?.toLowerCase().includes(searchLower) ||
      product.code?.toLowerCase().includes(searchLower) ||
      product.material?.toLowerCase().includes(searchLower)
    )
  })

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir "${name}"?`)) {
      try {
        await deleteProduct(id)
        toast({
          title: "Produto excluído",
          description: `"${name}" foi removido com sucesso.`,
        })
      } catch (error) {
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o produto.",
          variant: "destructive",
        })
      }
    }
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Carregando Produtos...</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/2 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <AdminRouteGuard>
      <div className="w-full">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Gerenciar Produtos</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
            </p>
          </div>
          <Link href="/perfil/admin/produtos/new">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Novo Produto
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nome, categoria, código ou material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-4 space-y-4">
                <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                  <img
                    src={product.imageUrl || "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardTitle className="line-clamp-2 text-lg">{product.name}</CardTitle>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Código:</span>
                    <span className="font-medium">{product.code}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Categoria:</span>
                    <span className="font-medium">{product.categoriaNome}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Material:</span>
                    <span className="font-medium">{product.material}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Preço:</span>
                    <span className="font-bold text-lg">R$ {product.currentPrice?.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Estoque:</span>
                    <span className="font-medium">{product.generalStock} unidades</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Link href={`/perfil/admin/produtos/${product.id}/edit`} className="flex-1">
                    <Button variant="outline" className="w-full gap-2 bg-transparent">
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(product.id, product.name)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && !isLoading && (
          <Card className="py-12">
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Nenhum produto encontrado com esse termo de busca."
                  : "Nenhum produto cadastrado ainda."}
              </p>
              {!searchTerm && (
                <Link href="/perfil/admin/produtos/new">
                  <Button className="mt-4 gap-2">
                    <Plus className="h-5 w-5" />
                    Criar Primeiro Produto
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminRouteGuard>
  )
}