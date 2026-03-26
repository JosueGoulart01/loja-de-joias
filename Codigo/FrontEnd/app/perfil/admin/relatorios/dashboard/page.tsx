"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, TrendingUp, DollarSign, ShoppingCart, Users, Filter, X, ArrowUpRight, ArrowDownRight, Loader2, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/services/api"
import { useToast } from "@/hooks/use-toast"

// Interface alinhada com o Backend
interface DashboardData {
  receitaTotal: number
  receitaVariacao: number
  totalVendas: number
  vendasVariacao: number
  ticketMedio: number
  ticketVariacao: number
  novosClientes: number
  clientesVariacao: number
  topCategorias: Array<{
    nome: string
    quantidadeVendida: number
    receitaTotal: number
    crescimento: number
  }>
  vendasPorDia: Array<any>
}

export default function DashboardPage() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const { toast } = useToast()

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast({ title: "Datas obrigatórias", description: "Selecione data de início e fim.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const response = await api.post("/relatorios/dashboard", { dataInicio: startDate, dataFim: endDate })
      setDashboardData(response.data)
      toast({ title: "Sucesso", description: "Dashboard atualizado." })
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao buscar dados.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearFilters = () => {
    setStartDate("")
    setEndDate("")
    setDashboardData(null)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Vendas</h1>
        <p className="text-muted-foreground">Visão consolidada de desempenho (Dados Reais).</p>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="flex gap-2"><Filter className="h-4 w-4"/> Configuração</CardTitle>
            {(startDate || endDate) && <Button variant="ghost" size="sm" onClick={handleClearFilters}><X className="h-4 w-4 mr-1"/> Limpar</Button>}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Início</Label><Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>Fim</Label><Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleGenerateReport} disabled={isLoading} className="px-8">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />} Gerar
            </Button>
          </div>
        </CardContent>
      </Card>

      {dashboardData && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <KpiCard title="Receita" value={`R$ ${(dashboardData.receitaTotal || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`} icon={DollarSign} />
              <KpiCard title="Vendas" value={dashboardData.totalVendas} icon={ShoppingCart} />
              <KpiCard title="Ticket Médio" value={`R$ ${(dashboardData.ticketMedio || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`} icon={TrendingUp} />
              <KpiCard title="Novos Clientes" value={dashboardData.novosClientes} icon={Users} />
           </div>
           
           <div className="grid gap-4 md:grid-cols-2">
             <Card>
                <CardHeader><CardTitle>Top Categorias (Receita)</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {dashboardData.topCategorias?.length > 0 ? (
                            dashboardData.topCategorias.map((cat, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                                    <div>
                                        <p className="font-semibold">{cat.nome}</p>
                                        <p className="text-xs text-muted-foreground">{cat.quantidadeVendida} itens vendidos</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600">
                                            R$ {(cat.receitaTotal || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-muted-foreground">Nenhuma venda encontrada.</div>
                        )}
                    </div>
                </CardContent>
             </Card>
           </div>
        </div>
      )}
    </div>
  )
}

function KpiCard({ title, value, icon: Icon }: any) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className="p-2 bg-primary/10 rounded-full"><Icon className="h-4 w-4 text-primary" /></div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}