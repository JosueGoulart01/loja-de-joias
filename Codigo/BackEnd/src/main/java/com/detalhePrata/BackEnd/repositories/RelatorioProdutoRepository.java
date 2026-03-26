package com.detalhePrata.BackEnd.repositories;

import com.detalhePrata.BackEnd.models.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RelatorioProdutoRepository extends JpaRepository<Produto, Long> {
    
    // --- PERFORMANCE DE CATEGORIAS (COM DESCONTO RATEADO) ---
    @Query("SELECT c.nome, " +
           "COALESCE(SUM(i.quantidade), 0), " +
           
           // CÁLCULO DO RATEIO DO DESCONTO AQUI TAMBÉM
           "SUM( " +
           "  (i.precoUnitario * i.quantidade) - " +
           "  (CASE WHEN ped.subtotal > 0 " +
           "        THEN ((i.precoUnitario * i.quantidade) / ped.subtotal) * COALESCE(ped.valorDesconto, 0) " +
           "        ELSE 0 END) " +
           ") " +
           
           "FROM ItemPedido i " +
           "JOIN i.produto p " +
           "JOIN p.categoria c " +
           "JOIN i.pedido ped " +
           "WHERE ped.dataCriacao BETWEEN :inicio AND :fim " +
           "GROUP BY c.id, c.nome " +
           "ORDER BY 3 DESC") // Ordena pela receita líquida (terceira coluna)
    List<Object[]> findPerformanceCategorias(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);

    // Produtos mais visualizados
    @Query("SELECT p FROM Produto p WHERE p.visualizacoes > 0 ORDER BY p.visualizacoes DESC")
    List<Produto> findProdutosMaisVisualizados();
}