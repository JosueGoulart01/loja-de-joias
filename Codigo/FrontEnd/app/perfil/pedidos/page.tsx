"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/services/api"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Truck, CheckCircle, Clock, XCircle, Loader2, ShoppingBag, AlertCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"

type ItemPedido = {
  nomeProduto: string
  tamanho?: string
  quantidade: number
}

type Pedido = {
  id: number
  valor: number
  status: string
  dataCriacao: string 
  dataCriado?: string 
  itens: ItemPedido[]
  usuarioId: number
}

export default function MeusPedidosPage() {
  const { usuario, isLoading: authLoading } = useAuth()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPedidos() {
      // Só busca se tiver usuário
      if (!usuario) return

      try {
        setLoading(true)
        
        // Busca do endpoint correto
        const res = await api.get("/pedidos/meus") 
        const listaPedidos: Pedido[] = res.data

        // Ordena do mais recente
        listaPedidos.sort((a, b) => {
            const dateA = new Date(a.dataCriacao || a.dataCriado || 0).getTime()
            const dateB = new Date(b.dataCriacao || b.dataCriado || 0).getTime()
            return dateB - dateA
        })
        
        setPedidos(listaPedidos)
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err)
        setError("Não foi possível carregar seus pedidos.")
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && usuario) {
        fetchPedidos()
    }
  }, [usuario, authLoading])

  // Helper de Status
  const getStatusConfig = (status: string) => {
    const s = status?.toLowerCase() || ""
    if (s.includes("aguardando")) return { color: "bg-yellow-500 hover:bg-yellow-600", icon: Clock, label: "Aguardando Pagamento" }
    if (s.includes("aprovado") || s.includes("separa")) return { color: "bg-blue-500 hover:bg-blue-600", icon: Package, label: "Em Preparação" }
    if (s.includes("enviado")) return { color: "bg-purple-500 hover:bg-purple-600", icon: Truck, label: "Enviado" }
    if (s.includes("entregue")) return { color: "bg-green-500 hover:bg-green-600", icon: CheckCircle, label: "Entregue" }
    if (s.includes("cancelado")) return { color: "bg-red-500 hover:bg-red-600", icon: XCircle, label: "Cancelado" }
    return { color: "bg-gray-500", icon: Package, label: status }
  }

  if (authLoading || loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin h-8 w-8 text-primary"/></div>

  if (error) {
      return (
          <div className="flex flex-col items-center justify-center h-[50vh] gap-4 text-center px-4">
              <div className="bg-destructive/10 p-4 rounded-full"><AlertCircle className="h-8 w-8 text-destructive"/></div>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">Tentar Novamente</Button>
          </div>
      )
  }

  return (
    <div className="space-y-8 py-6 px-4 md:px-0">
      <div>
        <h1 className="text-3xl font-serif font-bold">Meus Pedidos</h1>
        <p className="text-muted-foreground">
            Olá, {(usuario as any).nome || "Cliente"}. Acompanhe suas compras.
        </p>
      </div>

      <Separator />

      <section>
        {pedidos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-xl bg-muted/10">
                <Package className="h-12 w-12 text-muted-foreground mb-4 opacity-20"/>
                <h3 className="text-lg font-medium mb-2">Você ainda não tem pedidos</h3>
                <Link href="/"><Button>Ir para a Loja</Button></Link>
            </div>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pedidos.map((pedido) => {
                    const statusConfig = getStatusConfig(pedido.status)
                    const StatusIcon = statusConfig.icon
                    const dataIso = pedido.dataCriacao || pedido.dataCriado || new Date().toISOString()
                    const dataFormatada = new Date(dataIso).toLocaleDateString('pt-BR', { 
                        day: '2-digit', month: 'short', year: 'numeric' 
                    })
                    
                    return (
                        <Card key={pedido.id} className="hover:border-primary/50 transition-all shadow-sm hover:shadow-md group">
                            <CardHeader className="pb-3 border-b bg-muted/5">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base">Pedido #{pedido.id}</CardTitle>
                                        <span className="text-xs text-muted-foreground block">{dataFormatada}</span>
                                    </div>
                                    <Badge className={`${statusConfig.color} text-white border-none pointer-events-none`}>
                                        {statusConfig.label}
                                    </Badge>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="pt-4 pb-3 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground mb-4 font-medium">
                                    <StatusIcon className="h-4 w-4"/>
                                    <span>{pedido.status}</span>
                                </div>
                                
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Itens</p>
                                    <div className="space-y-1.5">
                                        {pedido.itens?.slice(0, 3).map((item, i) => (
                                            <div key={i} className="flex justify-between text-sm">
                                                <span className="truncate max-w-[180px]">{item.nomeProduto}</span>
                                                <span className="text-muted-foreground text-xs">x{item.quantidade}</span>
                                            </div>
                                        ))}
                                        {pedido.itens?.length > 3 && (
                                            <p className="text-xs text-primary italic pt-1">
                                                + {pedido.itens.length - 3} outros itens...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="pt-2 border-t bg-muted/5 flex justify-between items-center">
                                <span className="font-bold text-lg text-primary">
                                    {pedido.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                                {/* Link para a página de detalhes */}
                                <Link href={`/perfil/pedidos/${pedido.id}`}>
                                    <Button variant="outline" size="sm" className="h-8">Detalhes</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        )}
      </section>
    </div>
  )
}