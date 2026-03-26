package com.detalhePrata.BackEnd.repositories;

import com.detalhePrata.BackEnd.models.VarianteProduto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VarianteProdutoRepository extends JpaRepository<VarianteProduto, Long> {
    
    // Buscar variantes por produto
    List<VarianteProduto> findByProdutoId(Long produtoId);
    
    // Buscar variante por produto e tamanho
    @Query("SELECT v FROM VarianteProduto v WHERE v.produto.id = :produtoId AND v.tamanho = :tamanho")
    Optional<VarianteProduto> findByProdutoIdAndTamanho(@Param("produtoId") Long produtoId, @Param("tamanho") String tamanho);
    
    // Verificar se existe estoque suficiente
    @Query("SELECT v.estoque FROM VarianteProduto v WHERE v.id = :varianteId")
    Integer findEstoqueById(@Param("varianteId") Long varianteId);
    
    // Buscar variantes com estoque baixo
    @Query("SELECT v FROM VarianteProduto v WHERE v.estoque <= :estoqueMinimo")
    List<VarianteProduto> findVariantesComEstoqueBaixo(@Param("estoqueMinimo") Integer estoqueMinimo);
    
    // NOVO: Buscar variante por produto, tamanho e cor
    @Query("SELECT v FROM VarianteProduto v WHERE v.produto.id = :produtoId AND v.tamanho = :tamanho AND v.cor = :cor")
    Optional<VarianteProduto> findByProdutoIdAndTamanhoAndCor(
            @Param("produtoId") Long produtoId, 
            @Param("tamanho") String tamanho, 
            @Param("cor") String cor);
}