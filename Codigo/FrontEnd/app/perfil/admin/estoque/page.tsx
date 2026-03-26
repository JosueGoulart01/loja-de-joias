"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { produtoService } from "@/services/produto-service"
import { estoqueService } from "@/services/estoque-service"
import { formatarData } from "@/lib/utils" 
import type { Product, ProductSize } from "@/types/product" 
import type { MovimentacaoEstoque, TipoMovimentacao } from "@/types/movimentacao-estoque"
import { Package, Plus, History, Search, AlertCircle } from "lucide-react"

export default function EstoquePage() {
  const [produtos, setProdutos] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadProdutos()
  }, [])

  async function loadProdutos() {
    try {
      setLoading(true)
      const data = await produtoService.getAll()
      // Log para debug: ajuda a ver se o backend está mandando "name" ou "nome"
      console.log("Produtos carregados:", data) 
      setProdutos(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // --- CORREÇÃO AQUI ---
  // Adicionado (produto.name || "") para evitar o erro "Cannot read properties of undefined"
  const filteredProdutos = produtos.filter((produto) => 
    (produto.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  )
  // ---------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Carregando estoque...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Estoque</h1>
          <p className="text-muted-foreground">Controle entradas, saídas e ajustes de estoque</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredProdutos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum produto encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filteredProdutos.map((produto) => (
            <Card key={produto.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{produto.name}</CardTitle>
                    <CardDescription>
                      {produto.categoriaNome} • {produto.material}
                    </CardDescription>
                  </div>
                  <Badge variant={(produto.generalStock) > 10 ? "default" : "destructive"}>
                    Estoque Total: {produto.generalStock} pcs
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {produto.sizes && produto.sizes.length > 0 ? (
                    produto.sizes.map((size) => (
                      <div
                        key={size.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">Tamanho: {size.size}</p>
                          <p className="text-sm text-muted-foreground">
                            Estoque: {size.stock} unidades
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <MovimentacaoDialog
                            varianteId={Number(size.id)}
                            produtoNome={produto.name || "Produto sem nome"}
                            tamanho={size.size}
                            onSuccess={loadProdutos}
                          />
                          <HistoricoDialog
                            produtoId={Number(produto.id)} 
                            produtoNome={produto.name || "Produto sem nome"}
                            tamanho={size.size}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      Este produto não possui variantes cadastradas
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

// --- COMPONENTES AUXILIARES ---

interface MovimentacaoDialogProps {
  varianteId: number
  produtoNome: string
  tamanho: string
  onSuccess: () => void
}

function MovimentacaoDialog({ varianteId, produtoNome, tamanho, onSuccess }: MovimentacaoDialogProps) {
  const [open, setOpen] = useState(false)
  const [tipo, setTipo] = useState<TipoMovimentacao>("ENTRADA")
  const [quantidade, setQuantidade] = useState("")
  const [motivo, setMotivo] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!quantidade || Number(quantidade) <= 0) {
      toast({ title: "Erro", description: "Informe uma quantidade válida", variant: "destructive" })
      return
    }

    if (!motivo.trim()) {
      toast({ title: "Erro", description: "Informe o motivo da movimentação", variant: "destructive" })
      return
    }

    try {
      setLoading(true)
      await estoqueService.registrarMovimentacao({
        varianteId,
        quantidade: Number(quantidade),
        tipo,
        motivo: motivo.trim(),
      })

      toast({ title: "Sucesso", description: "Movimentação registrada com sucesso" })
      setOpen(false)
      setQuantidade("")
      setMotivo("")
      onSuccess()
    } catch (error: any) {
      toast({ 
        title: "Erro", 
        description: error.message || "Não foi possível registrar a movimentação", 
        variant: "destructive" 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" /> Movimentar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Movimentação</DialogTitle>
          <DialogDescription>{produtoNome} - Tamanho {tamanho}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de Movimentação</Label>
            <RadioGroup value={tipo} onValueChange={(value) => setTipo(value as TipoMovimentacao)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ENTRADA" id="entrada" />
                <Label htmlFor="entrada">Entrada (Reposição)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="SAIDA" id="saida" />
                <Label htmlFor="saida">Saída (Venda)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="AJUSTE" id="ajuste" />
                <Label htmlFor="ajuste">Ajuste Manual</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantidade">Quantidade</Label>
            <Input id="quantidade" type="number" min="1" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} placeholder="0" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo / Descrição</Label>
            <Textarea id="motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ex: Reposição..." rows={3} required />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading}>{loading ? "Salvando..." : "Salvar"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface HistoricoDialogProps {
  produtoId: number
  produtoNome: string
  tamanho: string
}

function HistoricoDialog({ produtoId, produtoNome, tamanho }: HistoricoDialogProps) {
  const [open, setOpen] = useState(false)
  const [historico, setHistorico] = useState<MovimentacaoEstoque[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open) loadHistorico()
  }, [open])

  async function loadHistorico() {
    try {
      setLoading(true)
      const data = await estoqueService.buscarHistoricoProduto(produtoId)
      setHistorico(data)
    } catch (error) {
      // Falha silenciosa
    } finally {
      setLoading(false)
    }
  }

  const getTipoLabel = (tipo: TipoMovimentacao) => {
    const labels: Record<string, string> = {
      ENTRADA: "Entrada",
      SAIDA: "Saída",
      AJUSTE: "Ajuste",
    }
    return labels[tipo] || tipo
  }

  const getTipoColor = (tipo: TipoMovimentacao) => {
    const colors: Record<string, "default" | "destructive" | "secondary"> = {
      ENTRADA: "default",
      SAIDA: "destructive",
      AJUSTE: "secondary",
    }
    return colors[tipo] || "default"
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <History className="h-4 w-4 mr-2" /> Histórico
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Histórico de Movimentações</DialogTitle>
          <DialogDescription>{produtoNome}</DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Carregando...</div>
        ) : historico.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Nenhuma movimentação registrada</div>
        ) : (
          <div className="space-y-3">
            {historico.map((mov) => (
              <Card key={mov.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={getTipoColor(mov.tipo)}>{getTipoLabel(mov.tipo)}</Badge>
                        <span className="text-sm font-semibold">{mov.quantidade} unidades</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                         <span>Tamanho: <span className="font-medium text-foreground">{mov.variante?.tamanho || "N/A"}</span></span>
                         {/* DATA FORMATADA COM UTILITÁRIO */}
                         <span>{formatarData(mov.data)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 border-l-2 pl-2 border-border">{mov.motivo}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}