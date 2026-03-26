package com.detalhePrata.BackEnd.repositories;

import com.detalhePrata.BackEnd.models.MovimentacaoEstoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque, Long> {

    // Busca todo o histórico de um produto específico (todas as variantes)
    // O "variante.produto.id" navega pelas tabelas automaticamente
    @Query("SELECT m FROM MovimentacaoEstoque m WHERE m.variante.produto.id = :produtoId ORDER BY m.data DESC")
    List<MovimentacaoEstoque> findAllByProdutoId(@Param("produtoId") Long produtoId);
}