package com.detalhePrata.BackEnd.services;

import com.detalhePrata.BackEnd.dtos.*;
import com.detalhePrata.BackEnd.models.Produto;
import com.detalhePrata.BackEnd.repositories.RelatorioCarrinhoRepository;
import com.detalhePrata.BackEnd.repositories.RelatorioProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RelatorioService {

    @Autowired
    private RelatorioCarrinhoRepository relatorioCarrinhoRepository;

    @Autowired
    private RelatorioProdutoRepository relatorioProdutoRepository;

    // ==========================================
    // 1. DASHBOARD (UC 11)
    // ==========================================
    public DashboardResponseDTO gerarDashboard(RelatorioRequestDTO request) {
        LocalDateTime inicio = request.getDataInicio().atStartOfDay();
        LocalDateTime fim = request.getDataFim().atTime(23, 59, 59);
        DashboardResponseDTO dashboard = new DashboardResponseDTO();

        try {
            // KPIs Principais
            Long totalVendas = relatorioCarrinhoRepository.countVendasFinalizadas(inicio, fim);
            Double receitaTotal = relatorioCarrinhoRepository.calcularReceitaTotal(inicio, fim);
            Long produtosVendidos = relatorioCarrinhoRepository.countProdutosVendidos(inicio, fim);
            Long novosClientes = relatorioCarrinhoRepository.countNovosClientes(inicio, fim);

            dashboard.setTotalVendas(totalVendas != null ? totalVendas.intValue() : 0);
            dashboard.setReceitaTotal(BigDecimal.valueOf(receitaTotal != null ? receitaTotal : 0.0));
            dashboard.setProdutosVendidos(produtosVendidos != null ? produtosVendidos.intValue() : 0);
            dashboard.setNovosClientes(novosClientes != null ? novosClientes.intValue() : 0);
            dashboard.setTicketMedio(calcularTicketMedio(totalVendas, receitaTotal));
            
            // Variações (Placeholders por enquanto)
            dashboard.setReceitaVariacao(0.0);
            dashboard.setVendasVariacao(0.0);
            dashboard.setTicketVariacao(0.0);
            dashboard.setClientesVariacao(0.0);

        } catch (Exception e) {
            e.printStackTrace();
            dashboard.setReceitaTotal(BigDecimal.ZERO);
            dashboard.setTotalVendas(0);
        }

        // Gráficos e Tabelas Auxiliares
        dashboard.setTopCategorias(gerarPerformanceCategorias(inicio, fim));
        dashboard.setVendasMensais(gerarHistoricoMensal()); // Gráfico de barras
        dashboard.setVendasPorDia(new ArrayList<>()); 

        return dashboard;
    }

    // ==========================================
    // 2. PRODUTOS MAIS VENDIDOS (UC 9)
    // ==========================================
    public List<ProdutoMaisVendidoDTO> gerarProdutosMaisVendidos(RelatorioRequestDTO request) {
        LocalDateTime inicio = request.getDataInicio().atStartOfDay();
        LocalDateTime fim = request.getDataFim().atTime(23, 59, 59);
        List<ProdutoMaisVendidoDTO> produtos = new ArrayList<>();

        try {
            List<Object[]> resultados = relatorioCarrinhoRepository.findProdutosMaisVendidos(inicio, fim);
            for (Object[] result : resultados) {
                ProdutoMaisVendidoDTO dto = new ProdutoMaisVendidoDTO();
                dto.setId((Long) result[0]);
                dto.setNome((String) result[1]);
                dto.setCategoria((String) result[2]);
                
                // Variante/Tamanho
                String espec = (String) result[3];
                dto.setEspecificacao(espec != null ? espec : "Padrão");

                // Métricas (Quantidade, Receita Líquida, Preço Médio)
                dto.setQuantidadeVendida(result[4] != null ? ((Number) result[4]).intValue() : 0);
                dto.setReceitaTotal(result[5] != null ? BigDecimal.valueOf(((Number) result[5]).doubleValue()) : BigDecimal.ZERO);
                dto.setPrecoMedio(result[6] != null ? BigDecimal.valueOf(((Number) result[6]).doubleValue()) : BigDecimal.ZERO);
                dto.setCrescimento(0.0);
                
                produtos.add(dto);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return aplicarFiltrosProdutosVendidos(produtos, request);
    }

    // ==========================================
    // 3. PRODUTOS MAIS VISUALIZADOS (RESTAURADO)
    // ==========================================
    public List<ProdutoMaisVisualizadoDTO> gerarProdutosMaisVisualizados(RelatorioRequestDTO request) {
        try {
            // Busca produtos com visualizações > 0
            List<Produto> produtos = relatorioProdutoRepository.findProdutosMaisVisualizados();
            List<ProdutoMaisVisualizadoDTO> resultado = new ArrayList<>();

            for (Produto produto : produtos) {
                ProdutoMaisVisualizadoDTO dto = new ProdutoMaisVisualizadoDTO();
                dto.setId(produto.getId());
                dto.setNome(produto.getNome());
                
                // Proteção contra Categoria Nula
                if (produto.getCategoria() != null) {
                    dto.setCategoria(produto.getCategoria().getNome());
                } else {
                    dto.setCategoria("Sem Categoria");
                }
                
                dto.setVisualizacoes(produto.getVisualizacoes() != null ? produto.getVisualizacoes() : 0);
                dto.setVendas(produto.getVendas() != null ? produto.getVendas() : 0);

                // Cálculo Taxa de Conversão (Vendas / Views * 100)
                double taxaConversao = dto.getVisualizacoes() > 0 ?
                        (dto.getVendas() * 100.0) / dto.getVisualizacoes() : 0.0;
                
                dto.setTaxaConversao(Math.round(taxaConversao * 100.0) / 100.0);
                dto.setTempoMedio("N/A"); // Placeholder

                resultado.add(dto);
            }
            
            // Aplica filtros de tela (Categoria, Qtd Mínima)
            return aplicarFiltrosProdutosVisualizados(resultado, request);
            
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // ==========================================
    // MÉTODOS AUXILIARES (LÓGICA INTERNA)
    // ==========================================

    // Gráfico de Barras (Últimos 6 meses)
    private List<VendaMensalDTO> gerarHistoricoMensal() {
        List<VendaMensalDTO> historico = new ArrayList<>();
        LocalDateTime dataLimite = LocalDateTime.now().minusMonths(5).withDayOfMonth(1).withHour(0).withMinute(0); 

        try {
            List<Object[]> resultados = relatorioCarrinhoRepository.findVendasUltimosMeses(dataLimite);
            
            Map<String, BigDecimal> mapaVendas = new HashMap<>();
            for (Object[] res : resultados) {
                String chave = res[0] + "-" + res[1]; 
                mapaVendas.put(chave, BigDecimal.valueOf(((Number) res[2]).doubleValue()));
            }

            String[] nomesMeses = {"Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"};
            LocalDateTime cursor = dataLimite;
            LocalDateTime hoje = LocalDateTime.now();

            while (!cursor.isAfter(hoje) && !cursor.getMonth().equals(hoje.plusMonths(1).getMonth())) {
                String chave = cursor.getYear() + "-" + cursor.getMonthValue();
                BigDecimal valor = mapaVendas.getOrDefault(chave, BigDecimal.ZERO);
                
                String nomeMes = nomesMeses[cursor.getMonthValue() - 1];
                historico.add(new VendaMensalDTO(nomeMes, valor));
                
                cursor = cursor.plusMonths(1);
                if(historico.size() >= 6) break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return historico;
    }

    // Gráfico de Categorias
    private List<CategoriaPerformanceDTO> gerarPerformanceCategorias(LocalDateTime inicio, LocalDateTime fim) {
         try {
             List<Object[]> resultados = relatorioProdutoRepository.findPerformanceCategorias(inicio, fim);
             List<CategoriaPerformanceDTO> categorias = new ArrayList<>();
             for (Object[] result : resultados) {
                 CategoriaPerformanceDTO dto = new CategoriaPerformanceDTO();
                 dto.setNome(result[0] != null ? (String) result[0] : "Outros");
                 dto.setQuantidadeVendida(result[1] != null ? ((Number) result[1]).intValue() : 0);
                 dto.setReceitaTotal(result[2] != null ? BigDecimal.valueOf(((Number) result[2]).doubleValue()) : BigDecimal.ZERO);
                 categorias.add(dto);
             }
             return categorias;
         } catch (Exception e) { return new ArrayList<>(); }
    }

    private BigDecimal calcularTicketMedio(Long totalVendas, Double receitaTotal) {
        if (totalVendas == null || totalVendas == 0 || receitaTotal == null || receitaTotal == 0) return BigDecimal.ZERO;
        return BigDecimal.valueOf(receitaTotal / totalVendas).setScale(2, RoundingMode.HALF_UP);
    }

    // Filtros para "Mais Vendidos"
    private List<ProdutoMaisVendidoDTO> aplicarFiltrosProdutosVendidos(List<ProdutoMaisVendidoDTO> produtos, RelatorioRequestDTO request) {
        if (request.getCategoria() != null && !request.getCategoria().equals("all")) {
            produtos.removeIf(p -> !p.getCategoria().equalsIgnoreCase(request.getCategoria()));
        }
        if (request.getQuantidadeMinima() != null) {
            produtos.removeIf(p -> p.getQuantidadeVendida() < request.getQuantidadeMinima());
        }
        if (request.getOrdenarPor() != null && !produtos.isEmpty()) {
            produtos.sort((p1, p2) -> {
                switch (request.getOrdenarPor()) {
                    case "revenue": return p2.getReceitaTotal().compareTo(p1.getReceitaTotal());
                    case "avgPrice": return p2.getPrecoMedio().compareTo(p1.getPrecoMedio());
                    default: return p2.getQuantidadeVendida().compareTo(p1.getQuantidadeVendida());
                }
            });
        }
        return produtos;
    }

    // Filtros para "Mais Visualizados"
    private List<ProdutoMaisVisualizadoDTO> aplicarFiltrosProdutosVisualizados(List<ProdutoMaisVisualizadoDTO> produtos, RelatorioRequestDTO request) {
        if (request.getCategoria() != null && !request.getCategoria().equals("all")) {
            produtos.removeIf(p -> !p.getCategoria().equalsIgnoreCase(request.getCategoria()));
        }
        if (request.getVisualizacoesMinimas() != null) {
            produtos.removeIf(p -> p.getVisualizacoes() < request.getVisualizacoesMinimas());
        }
        return produtos;
    }
}