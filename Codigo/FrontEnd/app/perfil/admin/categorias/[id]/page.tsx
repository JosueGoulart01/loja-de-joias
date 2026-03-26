"use client"

import { useState, useEffect } from "react"
import { useCategories } from "@/contexts/category-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AdminRouteGuard } from "@/components/admin-route-guard"
import { useToast } from "@/hooks/use-toast"

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const { getCategory, updateCategory, categories, isLoading: contextLoading } = useCategories()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    nome: "",
    ativa: true,
  })

  useEffect(() => {
    // Aguarda as categorias serem carregadas
    if (!contextLoading && categories.length > 0) {
      const categoryId = Number.parseInt(params.id)
      const category = getCategory(categoryId)
      
      if (category) {
        setFormData({
          nome: category.nome,
          ativa: category.ativa,
        })
        setIsLoading(false)
      } else {
        toast({
          title: "Categoria não encontrada",
          description: "A categoria que você está tentando editar não existe.",
          variant: "destructive",
        })
        router.push("/perfil/admin/categorias")
      }
    } else if (!contextLoading) {
      // Se não há categorias após o carregamento
      toast({
        title: "Categoria não encontrada",
        description: "Não foi possível carregar os dados da categoria.",
        variant: "destructive",
      })
      router.push("/perfil/admin/categorias")
    }
  }, [params.id, getCategory, router, toast, categories, contextLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, preencha o nome da categoria.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const categoryId = Number.parseInt(params.id)
      await updateCategory(categoryId, formData)
      toast({
        title: "Categoria atualizada",
        description: `"${formData.nome}" foi atualizada com sucesso.`,
      })
      router.push("/perfil/admin/categorias")
    } catch (error) {
      console.error("Erro ao atualizar:", error)
      toast({
        title: "Erro ao atualizar categoria",
        description: error instanceof Error ? error.message : "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (contextLoading || isLoading) {
    return (
      <AdminRouteGuard>
        <div className="flex h-screen items-center justify-center">
          <p className="text-muted-foreground">Carregando categoria...</p>
        </div>
      </AdminRouteGuard>
    )
  }

  return (
    <AdminRouteGuard>
      <div className="w-full max-w-2xl mx-auto p-4 md:p-8">
        <div className="mb-6">
          <Link href="/perfil/admin/categorias">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Editar Categoria</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informações da Categoria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Categoria</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Anéis, Colares, Brincos..."
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="ativa" className="cursor-pointer">
                  Categoria Ativa
                </Label>
                <Switch
                  id="ativa"
                  checked={formData.ativa}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativa: checked })}
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
            <Link href="/perfil/admin/categorias" className="flex-1">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </AdminRouteGuard>
  )
}