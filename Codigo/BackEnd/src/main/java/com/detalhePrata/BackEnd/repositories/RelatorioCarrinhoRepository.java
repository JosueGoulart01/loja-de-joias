package com.detalhePrata.BackEnd.repositories;

import com.detalhePrata.BackEnd.models.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RelatorioCarrinhoRepository extends JpaRepository<Pedido, Long> {

    // --- KPIS DO DASHBOARD (Receita Líquida já considera descontos do Pedido.valor) ---
    
    @Query("SELECT COUNT(p) FROM Pedido p WHERE p.dataCriacao BETWEEN :inicio AND :fim")
    Long countVendasFinalizadas(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);

    // Aqui usamos p.valor (que já é: subtotal - desconto + frete). 
    // Se quiser EXCLUIR o frete da receita, troque p.valor por (p.subtotal - p.valorDesconto)
    @Query("SELECT COALESCE(SUM(p.valor), 0) FROM Pedido p WHERE p.dataCriacao BETWEEN :inicio AND :fim")
    Double calcularReceitaTotal(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);

    @Query("SELECT COALESCE(SUM(i.quantidade), 0) FROM ItemPedido i JOIN i.pedido p WHERE p.dataCriacao BETWEEN :inicio AND :fim")
    Long countProdutosVendidos(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);

    @Query("SELECT COUNT(DISTINCT p.usuarioId) FROM Pedido p WHERE p.dataCriacao BETWEEN :inicio AND :fim")
    Long countNovosClientes(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);


    // --- RELATÓRIO DE MAIS VENDIDOS (COM CÁLCULO DE DESCONTO) ---
    
    // A lógica matemática abaixo é:
    // ReceitaItem = (PrecoItem * Qtd) - (ProporçãoDoItemNoPedido * ValorDescontoPedido)
    @Query("SELECT prod.id, prod.nome, cat.nome, " +
           "COALESCE(var.tamanho, 'Único'), " +
           "SUM(item.quantidade), " +
           
           // COLUNA 5: RECEITA LÍQUIDA (Calculando o rateio do desconto)
           "SUM( " +
           "  (item.precoUnitario * item.quantidade) - " +
           "  (CASE WHEN ped.subtotal > 0 " +
           "        THEN ((item.precoUnitario * item.quantidade) / ped.subtotal) * COALESCE(ped.valorDesconto, 0) " +
           "        ELSE 0 END) " +
           "), " +
           
           "AVG(item.precoUnitario) " +
           "FROM ItemPedido item " +
           "JOIN item.produto prod " +
           "JOIN prod.categoria cat " +
           "LEFT JOIN item.variante var " + 
           "JOIN item.pedido ped " +
           "WHERE ped.dataCriacao BETWEEN :inicio AND :fim " +
           "GROUP BY prod.id, prod.nome, cat.nome, var.tamanho " + 
           "ORDER BY SUM(item.quantidade) DESC")
    List<Object[]> findProdutosMaisVendidos(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);


    // --- GRÁFICO DE VENDAS (MANTIDO IGUAL, POIS USA p.valor QUE JÁ TEM DESCONTO) ---
    @Query("SELECT YEAR(p.dataCriacao), MONTH(p.dataCriacao), SUM(p.valor) " +
           "FROM Pedido p " +
           "WHERE p.dataCriacao >= :dataLimite " +
           "GROUP BY YEAR(p.dataCriacao), MONTH(p.dataCriacao) " +
           "ORDER BY YEAR(p.dataCriacao), MONTH(p.dataCriacao)")
    List<Object[]> findVendasUltimosMeses(@Param("dataLimite") LocalDateTime dataLimite);
}