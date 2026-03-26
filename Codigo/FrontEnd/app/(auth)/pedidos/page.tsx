"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ArrowLeft, Loader2, Calendar, DollarSign, Eye } from "lucide-react"
import Link from "next/link"
import { api } from "@/services/api"

// Interface baseada no seu Backend Pedido.java + ItemPedido
interface ItemPedido {
    id: number
    nomeProdutoSnapshot: string
    tamanhoSnapshot?: string
    quantidade: number
    precoUnitario: number
    subtotal: number
}

interface Pedido {
  id: number
  valor: number // Total
  subtotal: number
  frete: number
  status: string
  dataCriacao: string // Vem como string ISO do Java
  itens: ItemPedido[]
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        // Chama a API real. O interceptor do axios já manda o token.
        const response = await api.get("/pedidos")
        
        // Ordena por ID decrescente (mais recentes primeiro)
        // Garante que 'data' seja um array antes de sortear
        const lista = Array.isArray(response.data) ? response.data : []
        const sorted = lista.sort((a: Pedido, b: Pedido) => b.id - a.id)
        
        setPedidos(sorted)
      } catch (err: any) {
        console.error("Erro ao buscar pedidos:", err)
        // Se for 403, pode ser token expirado ou endpoint bloqueado
        if (err.response?.status === 403) {
            setError("Sessão expirada. Faça login novamente.")
        } else {
            setError("Não foi possível carregar seus pedidos.")
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchPedidos()
  }, [])

  const formatPrice = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-BR')

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || ""
    if (s.includes("entregue")) return "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
    if (s.includes("cancelado")) return "bg-red-100 text-red-800 border-red-200 hover:bg-red-100"
    if (s.includes("aguardando") || s.includes("pendente")) return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100"
    return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100"
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/perfil">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" /> Voltar ao Perfil
            </Button>
          </Link>
          <h1 className="luxury-title text-3xl text-foreground">Meus Pedidos</h1>
        </div>

        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4"/>
                <p className="text-muted-foreground">Buscando seus pedidos...</p>
            </div>
        ) : error ? (
            <div className="text-center py-10 text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                <p className="font-medium">{error}</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Tentar Novamente</Button>
            </div>
        ) : pedidos.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-lg border shadow-sm">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Nenhum pedido encontrado</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">Você ainda não fez compras conosco. Que tal dar uma olhada nas novidades?</p>
            <Link href="/">
              <Button className="btn-luxury">Ir às Compras</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {pedidos.map((order) => (
              <Card key={order.id} className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="bg-muted/30 pb-4 border-b">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                            <Badge variant="outline" className={`${getStatusColor(order.status)} px-3 py-0.5 font-normal`}>
                                {order.status}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3"/> {formatDate(order.dataCriacao)}</span>
                            <span className="flex items-center gap-1 font-medium text-foreground"><DollarSign className="h-3 w-3"/> {formatPrice(order.valor)}</span>
                        </div>
                    </div>
                    {/* Botão de detalhes futuro */}
                    {/* <Button size="sm" variant="outline">Ver Detalhes</Button> */}
                  </div>
                </CardHeader>
                <CardContent className="pt-6 bg-card">
                    <div className="space-y-3">
                        {order.itens && order.itens.length > 0 ? (
                            order.itens.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm items-center border-b border-border/50 last:border-0 pb-3 last:pb-0">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground">
                                            {item.quantidade}x {item.nomeProdutoSnapshot}
                                        </span>
                                        {item.tamanhoSnapshot && (
                                            <span className="text-xs text-muted-foreground">Tamanho: {item.tamanhoSnapshot}</span>
                                        )}
                                    </div>
                                    <span className="text-muted-foreground font-medium">
                                        {formatPrice(item.subtotal)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground italic">Detalhes dos itens indisponíveis.</p>
                        )}
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Frete</span>
                        <span>{formatPrice(order.frete)}</span>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}