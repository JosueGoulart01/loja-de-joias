"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Package, User, RefreshCw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api"

export type Pedido = {
  id: number
  valor: number
  frete: number
  metodoPagamento: string
  codigoPagamento: string
  status: string
  usuarioId: number
  clienteNome?: string
  dataCriado?: string
  dataCriacao?: string 
}

const normalizeStatus = (status: string) => status ? status.toLowerCase().trim() : "desconhecido";

const TABS_CONFIG = [
  { value: "todos", label: "Todos", filter: () => true },
  { value: "novos", label: "Novos", filter: (s: string) => normalizeStatus(s).includes("aguardando") },
  { value: "preparacao", label: "Preparação", filter: (s: string) => normalizeStatus(s).includes("aprovado") || normalizeStatus(s).includes("separa") },
  { value: "enviados", label: "Enviados", filter: (s: string) => normalizeStatus(s) === "enviado" },
  { value: "concluidos", label: "Concluídos", filter: (s: string) => normalizeStatus(s) === "entregue" },
  { value: "cancelados", label: "Cancelados", filter: (s: string) => normalizeStatus(s) === "cancelado" },
]

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPedidos = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.get('/pedidos')
      const data = res.data
      if (!Array.isArray(data)) throw new Error("Formato inválido.")

      const pedidosMapeados: Pedido[] = data.map((p: any) => ({
          ...p,
          id: p.id,
          status: p.status || "Desconhecido", 
          valor: p.valor || 0,
          dataCriacao: p.dataCriacao || p.dataCriado || new Date().toISOString()
      }))

      if (pedidosMapeados.length > 0) {
          const userIds = Array.from(new Set(pedidosMapeados.map(p => p.usuarioId).filter(Boolean)))
          const clientesMap = new Map<number, string>()
          
          await Promise.all(userIds.map(async (id) => {
              try {
                  const resUser = await api.get(`/usuarios/${id}`)
                  const user = resUser.data
                  const nome = user.nome || (user.pessoaFisica?.nome) || (user.pessoaJuridica?.razaoSocial) || "Cliente"
                  const sobrenome = user.sobrenome || (user.pessoaFisica?.sobrenome) || ""
                  clientesMap.set(id, `${nome} ${sobrenome}`.trim())
              } catch(e) {}
          }))

          pedidosMapeados.forEach(p => { p.clienteNome = clientesMap.get(p.usuarioId) || `ID #${p.usuarioId}` })
      }
      setPedidos(pedidosMapeados.sort((a, b) => b.id - a.id))
    } catch (err: any) {
      setError(err.message || "Erro ao carregar")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchPedidos() }, [])

  const getStatusVariant = (status: string) => {
    const s = normalizeStatus(status)
    if (s.includes("aprovado") || s.includes("entregue")) return "default"
    if (s.includes("aguardando") || s.includes("separa")) return "secondary"
    if (s.includes("cancelado")) return "destructive"
    return "outline"
  }

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8"/></div>
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight font-serif">Gerenciar Pedidos</h1>
        <Button onClick={fetchPedidos} size="sm" variant="outline"><RefreshCw className="mr-2 h-4 w-4"/> Atualizar</Button>
      </div>
      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="flex flex-wrap w-full h-auto gap-1 bg-muted/50 p-1">
          {TABS_CONFIG.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex-1 min-w-[100px]">
                {tab.label} ({pedidos.filter(p => tab.filter(p.status)).length})
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS_CONFIG.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6">
                {pedidos.filter(p => tab.filter(p.status)).length === 0 ? (
                    <p className="text-center text-muted-foreground py-10">Nenhum pedido aqui.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pedidos.filter(p => tab.filter(p.status)).map((pedido) => (
                          <PedidoCard key={pedido.id} pedido={pedido} getStatusVariant={getStatusVariant} />
                        ))}
                    </div>
                )}
            </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function PedidoCard({ pedido, getStatusVariant }: any) {
  const data = new Date(pedido.dataCriacao || pedido.dataCriado).toLocaleDateString('pt-BR')
  return (
    <Card className="hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div><CardTitle className="text-base">Pedido #{pedido.id}</CardTitle><span className="text-xs text-muted-foreground">{data}</span></div>
          <Badge variant={getStatusVariant(pedido.status)}>{pedido.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2 text-sm space-y-1">
        <p><span className="text-muted-foreground">Cliente:</span> {pedido.clienteNome}</p>
        <p><span className="text-muted-foreground">Total:</span> <strong>{pedido.valor?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></p>
      </CardContent>
      <CardFooter className="pt-2">
        <Link href={`/perfil/admin/pedidos/${pedido.id}`} className="w-full"><Button variant="outline" className="w-full h-8 text-xs">Ver Detalhes</Button></Link>
      </CardFooter>
    </Card>
  )
}