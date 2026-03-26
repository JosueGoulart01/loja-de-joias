"use client"

import type React from "react"

import { useState } from "react"
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

export default function NewCategoryPage() {
  const { createCategory } = useCategories()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    ativa: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, preencha o tipo de categoria.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // ✅ CORREÇÃO AQUI: addCategory → createCategory
      await createCategory(formData)
      toast({
        title: "Categoria criada",
        description: `"${formData.nome}" foi adicionada com sucesso.`,
      })
      router.push("/perfil/admin/categorias")
    } catch (error) {
      toast({
        title: "Erro ao criar categoria",
        description: error instanceof Error ? error.message : "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <AdminRouteGuard>
      <div className="w-full max-w-2xl mx-auto p-4 md:p-8">
        {/* Header com botão voltar */}
        <div className="mb-6">
          <Link href="/perfil/admin/categorias">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Criar Categoria</h1>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informações da Categoria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tipo de Categoria */}
              <div className="space-y-2">
                <Label htmlFor="nome">Tipo de Categoria</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Anéis, Colares, Brincos..."
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Ativar/Desativar */}
              <div className="flex items-center justify-between">
                <Label htmlFor="ativa" className="cursor-pointer">
                  Ativar/Desativar
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

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
            <Link href="/perfil/admin/categorias" className="flex-1">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full bg-transparent"
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