export interface RelatorioRequestDTO {
  dataInicio: string
  dataFim: string
  categoria?: string | null
  quantidadeMinima?: number | null
  visualizacoesMinimas?: number | null
  ordenarPor?: string | null
  filtroConversao?: string | null
}

export interface DashboardData {
  receitaTotal: number
  receitaVariacao: number
  totalVendas: number
  vendasVariacao: number
  ticketMedio: number
  ticketVariacao: number
  novosClientes: number
  clientesVariacao: number
  produtosVendidos: number
  produtosVariacao: number
  taxaConversao: number
  conversaoVariacao: number
  topCategorias: Array<{
    nome: string
    vendas: number
    receita: number
    crescimento: number
  }>
  vendasPorDia: Array<{
    dia: string
    vendas: number
    receita: number
  }>
}