export type TipoMovimentacao = "ENTRADA" | "SAIDA" | "AJUSTE"

export interface MovimentacaoEstoque {
  id: number
  quantidade: number
  tipo: TipoMovimentacao
  motivo: string
  data: string // ISO Date string
  variante: {
    id: number
    tamanho: string
    produto?: {
      id: number
      nome: string
    }
  }
}

export interface RegistrarMovimentacaoRequest {
  varianteId: number
  quantidade: number
  tipo: TipoMovimentacao
  motivo: string
}

export interface EstoqueVariante {
  id: number
  produtoNome: string
  tamanho: string
  estoque: number
}