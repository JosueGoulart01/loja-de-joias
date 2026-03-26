"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Loader2, Download, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function MaisVendidosPage() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [sortBy, setSortBy] = useState("quantity")
  const [isLoading, setIsLoading] = useState(false)
  const [reportData, setReportData] = useState<any[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const { toast } = useToast()

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast({ title: "Datas obrigatórias", description: "Selecione as datas.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    setHasSearched(true)
    setReportData([])

    try {
      const response = await api.post("/relatorios/mais-vendidos", {
          dataInicio: startDate,
          dataFim: endDate,
          ordenarPor: sortBy
      })
      setReportData(response.data)
      if(response.data.length === 0) {
        toast({ title: "Sem resultados", description: "Nenhuma venda neste período." })
      }
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao buscar dados.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Produtos Mais Vendidos</h1>
      
      <Card>
        <CardContent className="grid gap-6 md:grid-cols-4 items-end pt-6">
            <div className="space-y-2"><Label>Início</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>Fim</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>Ordenar</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="quantity">Quantidade</SelectItem>
                        <SelectItem value="revenue">Receita</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleGenerateReport} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Search className="mr-2 h-4 w-4"/>} Gerar
            </Button>
        </CardContent>
      </Card>

      {!isLoading && hasSearched && reportData.length === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Nenhum dado</AlertTitle>
            <AlertDescription>Não houve vendas registradas no período.</AlertDescription>
          </Alert>
      )}

      {reportData.length > 0 && (
        <Card className="animate-in fade-in slide-in-from-bottom-4">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Resultados ({reportData.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Produto</TableHead>
                              <TableHead>Detalhe / Tamanho</TableHead>
                              <TableHead>Categoria</TableHead>
                              <TableHead className="text-right">Qtd.</TableHead>
                              <TableHead className="text-right">Receita</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {reportData.map((item: any, index: number) => (
                              <TableRow key={index}>
                                  <TableCell className="font-medium">{item.nome}</TableCell>
                                  <TableCell>
                                      <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-muted text-muted-foreground">
                                        {item.especificacao}
                                      </span>
                                  </TableCell>
                                  <TableCell>{item.categoria}</TableCell>
                                  <TableCell className="text-right font-bold">{item.quantidadeVendida}</TableCell>
                                  <TableCell className="text-right text-green-600 font-bold">
                                    R$ {item.receitaTotal?.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  )
}