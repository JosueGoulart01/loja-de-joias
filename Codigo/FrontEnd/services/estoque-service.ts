import { api } from "./api"
import { MovimentacaoEstoque, RegistrarMovimentacaoRequest } from "@/types/movimentacao-estoque"

export const estoqueService = {
  // Registrar movimentação
  async registrarMovimentacao(data: RegistrarMovimentacaoRequest): Promise<void> {
    await api.post("/estoque/movimentar", data)
  },

  // Buscar histórico de uma variante específica
  async buscarHistorico(varianteId: number): Promise<MovimentacaoEstoque[]> {
    // Ajuste a rota conforme seu Backend: /estoque/historico/variante/{id} ou similar
    // Baseado no seu controller Java anterior, parece que você fez por ProdutoId.
    // Se precisar por variante, precisará criar o endpoint no Java ou filtrar no front.
    // Vou assumir que vamos usar o endpoint de produto filtrado ou que você criará o endpoint:
    // @GetMapping("/historico/variante/{id}")
    const res = await api.get(`/estoque/historico/variante/${varianteId}`) 
    return res.data
  },

  // Buscar histórico de um produto inteiro
  async buscarHistoricoProduto(produtoId: number): Promise<MovimentacaoEstoque[]> {
    const res = await api.get(`/estoque/historico/${produtoId}`)
    return res.data
  }
}