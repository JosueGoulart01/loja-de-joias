"use client"

import { useState } from "react"
import { useCategories } from "@/contexts/category-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Plus, Edit, Trash2, ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AdminRouteGuard } from "@/components/admin-route-guard"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function CategoriasPage() {
  const { categories, isLoading, deleteCategory, updateCategory } = useCategories()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [infoDialogOpen, setInfoDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null)
  const [categoryInfo, setCategoryInfo] = useState<{ nome: string; produtosAssociados: number } | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const filteredCategories = categories.filter((cat) => cat.nome.toLowerCase().includes(searchQuery.toLowerCase()))

  // Função auxiliar para obter dados da categoria a ser excluída
  const getCategoryToDelete = () => {
    if (!categoryToDelete) return null
    return categories.find(c => c.id === categoryToDelete)
  }

  const categoryToDeleteData = getCategoryToDelete()
  const hasProducts = categoryToDeleteData ? categoryToDeleteData.produtosAssociados > 0 : false

  const handleDeleteClick = (categoryId: number, categoryNome: string, produtosAssociados: number) => {
    setCategoryToDelete(categoryId)
    
    if (produtosAssociados > 0) {
      // Se tem produtos, mostra o dialog informativo
      setCategoryInfo({
        nome: categoryNome,
        produtosAssociados: produtosAssociados
      })
      setInfoDialogOpen(true)
    } else {
      // Se não tem produtos, mostra o dialog de confirmação de exclusão
      setDeleteDialogOpen(true)
    }
  }

  const handleDelete = async () => {
    if (!categoryToDelete) return

    try {
      await deleteCategory(categoryToDelete)
      toast({
        title: "Categoria deletada",
        description: "A categoria foi removida com sucesso.",
      })
    } catch (error) {
      // A mensagem de erro já é exibida no toast pelo context
      console.error("Erro no handleDelete:", error)
    } finally {
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
    }
  }

  const handleToggleStatus = async (id: number, nome: string, currentStatus: boolean) => {
    // Impede múltiplos cliques enquanto está atualizando
    if (updatingStatus === id) return
    
    setUpdatingStatus(id)
    
    try {
      await updateCategory(id, { 
        nome: nome, 
        ativa: !currentStatus 
      })
      
      toast({
        title: "Status atualizado",
        description: `Categoria ${!currentStatus ? "ativada" : "desativada"} com sucesso.`,
      })
    } catch (error) {
      console.error("Erro ao alterar status:", error)
      toast({
        title: "Erro ao atualizar",
        description: error instanceof Error ? error.message : "Não foi possível atualizar o status da categoria.",
        variant: "destructive",
      })
      
      // Força o recarregamento das categorias para sincronizar o estado
      // Isso corrige o bug visual do switch voltando para a posição anterior
      // Você precisará adicionar a função fetchCategories no useCategories se ainda não tiver
      // Se não tiver fetchCategories, pode recarregar a página ou usar outra estratégia
      window.location.reload() // Solução simples para garantir sincronização
    } finally {
      setUpdatingStatus(null)
    }
  }

  if (isLoading) {
    return (
      <AdminRouteGuard>
        <div className="flex h-screen items-center justify-center">
          <p className="text-muted-foreground">Carregando categorias...</p>
        </div>
      </AdminRouteGuard>
    )
  }

  return (
    <AdminRouteGuard>
      <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
        {/* Header com botão voltar */}
        <div className="mb-6">
          <Link href="/perfil">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Gerenciar Categorias</h1>
        </div>

        {/* Botão Adicionar e Busca */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button onClick={() => router.push("/perfil/admin/categorias/new")} className="gap-2 whitespace-nowrap">
            <Plus className="h-4 w-4" />
            Adicionar Categoria
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar categorias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Título da seção */}
        <h2 className="text-xl font-semibold mb-4">Categorias cadastradas</h2>

        {/* Lista de Categorias */}
        {filteredCategories.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery ? "Nenhuma categoria encontrada com esse termo." : "Nenhuma categoria cadastrada ainda."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {/* Header da tabela - apenas desktop */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
              <div className="col-span-4">Tipo Categoria</div>
              <div className="col-span-3 text-center">Produtos associados</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-3 text-center">Ações</div>
            </div>

            {/* Linhas da tabela */}
            {filteredCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Tipo Categoria */}
                    <div className="md:col-span-4">
                      <span className="md:hidden font-medium text-muted-foreground text-sm">Tipo: </span>
                      <span className="font-medium">{category.nome}</span>
                    </div>

                    {/* Produtos associados */}
                    <div className="md:col-span-3 md:text-center">
                      <span className="md:hidden font-medium text-muted-foreground text-sm">Produtos: </span>
                      <span>{category.produtosAssociados}</span>
                    </div>

                    {/* Status */}
                    <div className="md:col-span-2 flex items-center gap-2 md:justify-center">
                      <span className="md:hidden font-medium text-muted-foreground text-sm">Status: </span>
                      <Switch
                        checked={category.ativa}
                        onCheckedChange={() => handleToggleStatus(category.id, category.nome, category.ativa)}
                        disabled={updatingStatus === category.id}
                        aria-label={category.ativa ? "Desativar categoria" : "Ativar categoria"}
                      />
                      {updatingStatus === category.id && (
                        <span className="text-xs text-muted-foreground">Atualizando...</span>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="md:col-span-3 flex gap-2 md:justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/perfil/admin/categorias/${category.id}`)}
                        aria-label="Editar categoria"
                        disabled={updatingStatus === category.id}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(category.id, category.nome, category.produtosAssociados)}
                        aria-label="Deletar categoria"
                        disabled={updatingStatus === category.id}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog de confirmação de exclusão (apenas para categorias sem produtos) */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja deletar a categoria "{categoryToDeleteData?.nome}"? 
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Deletar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog informativo (para categorias com produtos) */}
        <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-amber-500" />
                <DialogTitle>Não é possível excluir</DialogTitle>
              </div>
              <DialogDescription className="pt-4">
                <div className="space-y-4">
                  <p>
                    A categoria <strong>"{categoryInfo?.nome}"</strong> não pode ser excluída porque possui{" "}
                    <strong>{categoryInfo?.produtosAssociados} produto(s)</strong> associado(s).
                  </p>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-amber-800 text-sm font-medium">
                      📋 Para excluir esta categoria:
                    </p>
                    <ul className="text-amber-700 text-sm mt-2 space-y-1 list-disc list-inside">
                      <li>Transfira os produtos para outra categoria, ou</li>
                      <li>Exclua todos os produtos associados primeiro</li>
                    </ul>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Você pode desativar a categoria no botão de switch para que ela não apareça 
                    para os clientes, mas os produtos permanecerão associados.
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex sm:justify-center">
              <Button 
                onClick={() => setInfoDialogOpen(false)}
                className="mt-4"
              >
                Entendi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminRouteGuard>
  )
}