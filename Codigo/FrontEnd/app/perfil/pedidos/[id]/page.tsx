"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { api } from "@/services/api"
// Importando o contexto de autenticação para pegar o usuário logado
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Loader2, Package, MapPin, User, CreditCard, Truck, ShoppingBag } from "lucide-react"
import { Label } from "@/components/ui/label"

// --- TIPOS ---
type ItemPedido = {
  nomeProduto: string
  tamanho?: string
  quantidade: number
  precoUnitario: number
  subtotal: number
}

type PedidoDetalhado = {
  id: number
  valor: number
  subtotal: number
  valorDesconto: number
  frete: number
  status: string
  metodoPagamento: string
  codigoPagamento: string
  dataCriacao: string
  codigoRastreio?: string
  urlNotaFiscal?: string
  itens: ItemPedido[]
  usuarioId: number
}

type Cliente = {
  email: string
  telefone: string
  nome: string
  sobrenome: string
  endereco?: {
    rua: string
    numero: string
    bairro: string
    cidade: string
    estado: string
    cep: string
  }
  pessoaFisica?: {
    nome: string
    sobrenome: string
    cpf: string
  }
  pessoaJuridica?: {
    razaoSocial: string
    cnpj: string
  }
}

export default function PedidoClienteDetalhes() {
  const params = useParams()
  const id = params.id as string
  
  // Pegando usuário do contexto para fallback
  const { usuario } = useAuth()
  
  const [pedido, setPedido] = useState<PedidoDetalhado | null>(null)
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPedido() {
      try {
        const res = await api.get(`/pedidos/${id}`)
        setPedido(res.data)
        console.log("Dados do pedido recebidos:", res.data); // Log para debug

        if (res.data.usuarioId) {
            try {
                const resUser = await api.get(`/usuarios/${res.data.usuarioId}`)
                setCliente(resUser.data)
            } catch (e) {
                console.warn("Falha ao buscar dados do cliente, usando fallback.")
            }
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes:", error)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchPedido()
  }, [id])

  if (loading) return <div className="flex justify-center h-[60vh] items-center"><Loader2 className="h-10 w-10 animate-spin text-muted-foreground"/></div>
  if (!pedido) return <div className="text-center p-10">Pedido não encontrado.</div>

  const dataFormatada = new Date(pedido.dataCriacao).toLocaleDateString('pt-BR', { 
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  })

  const formatMoney = (val: number) => val?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const getNomeCliente = () => {
      if (!cliente && !usuario) return "Carregando..."
      
      // Tenta pegar do cliente da API primeiro
      if (cliente) {
          if (cliente.pessoaFisica) return `${cliente.pessoaFisica.nome} ${cliente.pessoaFisica.sobrenome}`
          if (cliente.pessoaJuridica) return cliente.pessoaJuridica.razaoSocial
          return `${cliente.nome} ${cliente.sobrenome}`
      }

      // Fallback para o usuário logado (usando 'as any' para evitar erro de tipo)
      return (usuario as any).nome || (usuario as any).name || "Cliente"
  }
  
  const getEmailCliente = () => {
      // Usando 'as any' aqui também para garantir acesso ao email do token
      return cliente?.email || (usuario as any)?.email || "..."
  }

  return (
    <div className="space-y-8 py-8 max-w-6xl mx-auto px-4">
      
      {/* CABEÇALHO E VOLTAR */}
      <div className="space-y-4">
          <Link href="/perfil/pedidos" className="text-sm text-muted-foreground flex items-center hover:text-foreground transition-colors w-fit">
            <ArrowLeft className="h-4 w-4 mr-2"/> Voltar para meus pedidos
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">Pedido #{pedido.id}</h1>
                    <Badge variant="secondary" className="text-sm font-normal px-3">{pedido.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Realizado em {dataFormatada}</p>
            </div>

            {/* CARD DE RASTREIO */}
            {pedido.codigoRastreio && (
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 p-4 rounded-lg flex items-center gap-4 min-w-[250px]">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full"><Truck className="h-5 w-5 text-blue-600 dark:text-blue-400"/></div>
                    <div>
                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">CÓDIGO DE RASTREIO</p>
                        <p className="text-base font-mono font-medium select-all">{pedido.codigoRastreio}</p>
                    </div>
                </div>
            )}
          </div>
      </div>

      <Separator />

      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* --- COLUNA ESQUERDA --- */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* 1. ITENS */}
            <div className="space-y-3">
                <h2 className="text-lg font-semibold flex items-center gap-2"><ShoppingBag className="h-5 w-5"/> Itens do Pedido</h2>
                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {(!pedido.itens || pedido.itens.length === 0) ? (
                                <div className="p-8 text-center text-muted-foreground text-sm">
                                    Informações dos itens indisponíveis ou carregando...
                                </div>
                            ) : (
                                pedido.itens.map((item, idx) => (
                                    <div key={idx} className="p-4 flex gap-4 items-center">
                                        <div className="h-16 w-16 bg-muted/50 rounded-md flex items-center justify-center shrink-0 border">
                                            <Package className="h-6 w-6 text-muted-foreground/40"/>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <p className="font-medium">{item.nomeProduto}</p>
                                            <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                                                <span className="bg-muted px-2 py-0.5 rounded text-xs">Qtd: {item.quantidade}</span>
                                                {item.tamanho && <span className="bg-muted px-2 py-0.5 rounded text-xs">Tam: {item.tamanho}</span>}
                                            </div>
                                        </div>
                                        
                                        <p className="font-semibold">{formatMoney(item.subtotal)}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 2. ENDEREÇO E DADOS */}
            <div className="grid md:grid-cols-2 gap-6">
                
                {/* ENDEREÇO */}
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold flex items-center gap-2"><MapPin className="h-5 w-5"/> Endereço de Entrega</h2>
                    <Card className="h-full">
                        <CardContent className="pt-6 text-sm">
                            {cliente?.endereco ? (
                                <div className="space-y-1.5 text-muted-foreground">
                                    <p className="text-foreground font-medium">{cliente.endereco.rua}, {cliente.endereco.numero}</p>
                                    <p>{cliente.endereco.bairro}</p>
                                    <p>{cliente.endereco.cidade} - {cliente.endereco.estado}</p>
                                    <p>CEP: {cliente.endereco.cep}</p>
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic">Endereço padrão do cadastro.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* DADOS */}
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold flex items-center gap-2"><User className="h-5 w-5"/> Dados Pessoais</h2>
                    <Card className="h-full">
                        <CardContent className="pt-6 text-sm space-y-3">
                            <div>
                                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Nome</Label>
                                <p className="font-medium">{getNomeCliente()}</p>
                            </div>
                            <div>
                                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Email</Label>
                                <p className="text-muted-foreground">{getEmailCliente()}</p>
                            </div>
                            <div>
                                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Telefone</Label>
                                <p className="text-muted-foreground">{cliente?.telefone || "-"}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

        {/* --- COLUNA DIREITA --- */}
        <div className="space-y-6">
            
            {/* RESUMO */}
            <div className="space-y-3">
                <h2 className="text-lg font-semibold flex items-center gap-2"><CreditCard className="h-5 w-5"/> Resumo</h2>
                <Card>
                    <CardContent className="p-6 space-y-3 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal</span> 
                            <span>{formatMoney(pedido.subtotal)}</span>
                        </div>
                        
                        {pedido.valorDesconto > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Desconto</span> 
                                <span>- {formatMoney(pedido.valorDesconto)}</span>
                            </div>
                        )}
                        
                        <div className="flex justify-between text-muted-foreground">
                            <span>Frete</span> 
                            <span>{formatMoney(pedido.frete)}</span>
                        </div>
                        
                        <Separator className="my-2"/>
                        
                        <div className="flex justify-between font-bold text-xl pt-1">
                            <span>Total</span> 
                            <span>{formatMoney(pedido.valor)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* PAGAMENTO */}
            <Card className="bg-muted/10">
                <CardContent className="p-6">
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Forma de Pagamento</Label>
                    <p className="text-lg font-medium mt-1 uppercase">{pedido.metodoPagamento}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-2 break-all">{pedido.codigoPagamento}</p>
                </CardContent>
            </Card>

            {pedido.urlNotaFiscal && (
                <a href={pedido.urlNotaFiscal} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="outline" className="w-full h-12 border-dashed">Visualizar Nota Fiscal</Button>
                </a>
            )}
        </div>
      </div>
    </div>
  )
}