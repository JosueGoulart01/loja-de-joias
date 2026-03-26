"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Save, Package, User, MapPin, CreditCard, Truck } from "lucide-react"
import { api } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function AdminPedidoDetalhePage() {
  const params = useParams()
  const { toast } = useToast()
  const id = params.id as string

  // Estados de Dados
  const [pedido, setPedido] = useState<any>(null)
  const [cliente, setCliente] = useState<any>(null)
  const [historico, setHistorico] = useState<any[]>([])
  
  // Estados de UI
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Estados de Edição
  const [status, setStatus] = useState("")
  const [codigoRastreio, setCodigoRastreio] = useState("")
  const [urlNotaFiscal, setUrlNotaFiscal] = useState("")

  const fetchDetalhes = async () => {
    try {
      setIsLoading(true)
      const res = await api.get(`/pedidos/${id}`)
      const data = res.data
      
      setPedido(data)
      setStatus(data.status)
      setCodigoRastreio(data.codigoRastreio || "")
      setUrlNotaFiscal(data.urlNotaFiscal || "")

      // Busca Cliente
      if (data.usuarioId) {
        try {
          const resCliente = await api.get(`/usuarios/${data.usuarioId}`)
          setCliente(resCliente.data)
        } catch (e) { console.error("Erro cliente", e) }
      }

      // Busca Histórico
      try {
        const resHist = await api.get(`/pedidos/${id}/historico`)
        setHistorico(resHist.data)
      } catch (e) { console.error("Erro histórico", e) }

    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível carregar o pedido.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchDetalhes()
  }, [id])

  const handleSave = async () => {
    if (!pedido) return
    setIsSaving(true)
    try {
      if (status !== pedido.status) {
        await api.patch(`/pedidos/${id}`, status, { headers: { "Content-Type": "text/plain" } })
      }
      if (codigoRastreio !== pedido.codigoRastreio || urlNotaFiscal !== pedido.urlNotaFiscal) {
        await api.patch(`/pedidos/${id}/rastreio`, { codigoRastreio, urlNotaFiscal })
      }
      toast({ title: "Sucesso", description: "Alterações salvas!", variant: "default" })
      fetchDetalhes()
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao salvar.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  // Helpers
  const getNomeCliente = () => {
      if (!cliente) return "..."
      return cliente.nome || (cliente.pessoaFisica ? `${cliente.pessoaFisica.nome} ${cliente.pessoaFisica.sobrenome}` : cliente.pessoaJuridica?.razaoSocial) || "Cliente"
  }

  const formatMoney = (val: number) => val?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  if (isLoading) return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-muted-foreground"/></div>
  if (!pedido) return <div className="text-center p-10">Pedido não encontrado.</div>

  const dataFormatada = new Date(pedido.dataCriacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="space-y-6 p-6 bg-muted/10 min-h-screen">
      {/* HEADER SIMPLES E LIMPO (Igual imagem) */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
            <div className="flex items-center gap-3">
                <Link href="/perfil/admin/pedidos">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4"/></Button>
                </Link>
                <h1 className="text-2xl font-bold">Pedido #{pedido.id}</h1>
                <Badge variant="outline" className="text-xs font-normal bg-background">{pedido.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground pl-11">Realizado em {dataFormatada}</p>
        </div>
        
        <Button onClick={handleSave} disabled={isSaving} className="bg-black text-white hover:bg-gray-800">
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
            Salvar Alterações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- COLUNA ESQUERDA (DADOS) --- */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* 1. ITENS DO PEDIDO */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Package className="h-4 w-4"/> Itens do Pedido
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Lista de Produtos (Simplificada) */}
                    <div className="space-y-3">
                        {pedido.itens.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-sm py-2 border-b last:border-0">
                                <div>
                                    <p className="font-medium">{item.nomeProduto}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.quantidade}x {formatMoney(item.precoUnitario)} 
                                        {item.tamanho && ` • ${item.tamanho}`}
                                    </p>
                                </div>
                                <p className="font-medium">{formatMoney(item.subtotal)}</p>
                            </div>
                        ))}
                    </div>

                    {/* Totais (Igual imagem) */}
                    <div className="pt-4 space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Subtotal</span>
                            <span>{formatMoney(pedido.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600">
                            <span>Desconto</span>
                            <span>- {formatMoney(pedido.valorDesconto)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Frete</span>
                            <span>{formatMoney(pedido.frete)}</span>
                        </div>
                        <Separator className="my-2"/>
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>{formatMoney(pedido.valor)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 2. DADOS DO CLIENTE */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <User className="h-4 w-4"/> Dados do Cliente
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-medium uppercase">Nome</p>
                        <p>{getNomeCliente()}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-medium uppercase">Email</p>
                        <p>{cliente?.email}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-medium uppercase">Telefone</p>
                        <p>{cliente?.telefone || "-"}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-medium uppercase">ID do Usuário</p>
                        <p>#{pedido.usuarioId}</p>
                    </div>
                </CardContent>
            </Card>

            {/* 3. ENDEREÇO */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4"/> Endereço de Entrega
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                    {cliente?.endereco ? (
                        <div className="space-y-1">
                            <p>{cliente.endereco.rua}, {cliente.endereco.numero}</p>
                            <p>{cliente.endereco.bairro} - {cliente.endereco.cidade}/{cliente.endereco.estado}</p>
                            <p>CEP: {cliente.endereco.cep}</p>
                        </div>
                    ) : (
                        <p className="text-muted-foreground italic">Endereço não disponível no cadastro.</p>
                    )}
                </CardContent>
            </Card>
        </div>

        {/* --- COLUNA DIREITA (AÇÕES) --- */}
        <div className="space-y-6">
            
            {/* 1. GERENCIAR PEDIDO */}
            <Card>
                <CardHeader className="pb-3 bg-muted/30">
                    <CardTitle className="text-sm font-medium">Gerenciar Pedido</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Status Atual</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="bg-background">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Aguardando pagamento">Aguardando pagamento</SelectItem>
                                <SelectItem value="Pagamento aprovado">Pagamento aprovado</SelectItem>
                                <SelectItem value="Em separação">Em separação</SelectItem>
                                <SelectItem value="Enviado">Enviado</SelectItem>
                                <SelectItem value="Entregue">Entregue</SelectItem>
                                <SelectItem value="Cancelado">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator/>

                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Código de Rastreio</Label>
                        <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground"/>
                            <Input 
                                value={codigoRastreio} 
                                onChange={(e) => setCodigoRastreio(e.target.value)} 
                                placeholder="BR12323232BR"
                                className="font-mono text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">URL Nota Fiscal</Label>
                        <Input 
                            value={urlNotaFiscal} 
                            onChange={(e) => setUrlNotaFiscal(e.target.value)} 
                            placeholder="https://..."
                        />
                    </div>
                </CardContent>
            </Card>

            {/* 2. PAGAMENTO */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <CreditCard className="h-4 w-4"/> Pagamento
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Método</span>
                        <span className="font-medium uppercase">{pedido.metodoPagamento}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Código ID</span>
                        <span className="font-mono text-xs truncate max-w-[120px]" title={pedido.codigoPagamento}>
                            {pedido.codigoPagamento}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* 3. HISTÓRICO */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Histórico</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {historico.map((h: any, i: number) => (
                        <div key={i} className="flex gap-3 items-start">
                            <div className="flex flex-col items-center">
                                <div className="h-2 w-2 rounded-full bg-black mt-1.5"/>
                                {i < historico.length - 1 && <div className="w-[1px] h-full bg-muted-foreground/20 mt-1"/>}
                            </div>
                            <div>
                                <p className="text-sm font-medium">{h.status}</p>
                                <p className="text-xs text-muted-foreground">{new Date(h.dataAlteracao).toLocaleString('pt-BR')}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}