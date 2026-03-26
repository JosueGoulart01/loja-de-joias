"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, Calendar, Filter, X, TrendingUp, TrendingDown, Loader2, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/services/api"
import type { RelatorioRequestDTO } from "@/types/relatorios"

interface ProdutoMaisVisualizado {
  id: number
  nome: string
  categoria: string
  visualizacoes: number
  taxaConversao: number
  vendas: number
  taxaRejeicao?: number
  tempoMedio?: string
}

export default function MaisVisualizadosPage() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [category, setCategory] = useState("all")
  const [minViews, setMinViews] = useState("")
  const [conversionFilter, setConversionFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [reportData, setReportData] = useState<ProdutoMaisVisualizado[]>([])
  const { toast } = useToast()

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast({ title: "Datas inválidas", description: "Selecione data inicial e final.", variant: "destructive" })
      return
    }

    setIsLoading(true)
    setReportData([])

    try {
      const requestBody: RelatorioRequestDTO = {
        dataInicio: startDate,
        dataFim: endDate,
        categoria: category === "all" ? null : category,
        visualizacoesMinimas: minViews ? parseInt(minViews, 10) : null,
        filtroConversao: conversionFilter === "all" ? null : conversionFilter,
      }

      const response = await api.post("/relatorios/mais-visualizados", requestBody)
      setReportData(response.data)

    } catch (error: any) {
      console.error("Falha ao gerar relatório:", error)
      toast({ title: "Erro", description: "Falha ao buscar dados.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearFilters = () => {
    setStartDate(""); setEndDate(""); setCategory("all"); setMinViews(""); setConversionFilter("all"); setReportData([]);
  }

  const handleExport = () => { alert("Exportação em breve") }
  const hasActiveFilters = startDate || endDate || category !== "all" || minViews || conversionFilter !== "all"
  const maxViews = reportData.length > 0 ? Math.max(...reportData.map((item) => item.visualizacoes)) : 0

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="luxury-title text-4xl text-foreground">Produtos Mais Visualizados</h1>
        <p className="text-muted-foreground">Análise de engajamento e visualizações únicas.</p>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="flex gap-2"><Filter className="h-4 w-4"/> Filtros</CardTitle>
            {hasActiveFilters && <Button variant="ghost" size="sm" onClick={handleClearFilters}><X className="h-4 w-4 mr-1"/> Limpar</Button>}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2"><Label>Início</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>Fim</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>Categoria</Label>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="aneis">Anéis</SelectItem>
                        <SelectItem value="brincos">Brincos</SelectItem>
                        <SelectItem value="colares">Colares</SelectItem>
                        <SelectItem value="pulseiras">Pulseiras</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2"><Label>Min. Views</Label><Input type="number" placeholder="100" value={minViews} onChange={e => setMinViews(e.target.value)} /></div>
            <div className="space-y-2"><Label>Conversão</Label>
                <Select value={conversionFilter} onValueChange={setConversionFilter}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="high">Alta (&gt; 5%)</SelectItem>
                        <SelectItem value="low">Baixa (&lt; 3%)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleGenerateReport} disabled={isLoading} className="btn-luxury px-8">
                {isLoading ? <Loader2 className="animate-spin"/> : <Search className="mr-2 h-4 w-4"/>} Gerar
            </Button>
          </div>
        </CardContent>
      </Card>

      {reportData.length > 0 && (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <CardTitle>Resultados</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Produto</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Views</TableHead>
                            <TableHead className="text-right">Vendas</TableHead>
                            <TableHead className="text-right">Conversão</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reportData.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.nome}</TableCell>
                                <TableCell><Badge variant="outline">{item.categoria}</Badge></TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4 text-primary"/> {item.visualizacoes}
                                    </div>
                                    <Progress value={(item.visualizacoes / maxViews) * 100} className="h-1 mt-1" />
                                </TableCell>
                                <TableCell className="text-right">{item.vendas}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={item.taxaConversao > 5 ? "default" : "secondary"}>
                                        {item.taxaConversao.toFixed(2)}%
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      )}
    </div>
  )
}