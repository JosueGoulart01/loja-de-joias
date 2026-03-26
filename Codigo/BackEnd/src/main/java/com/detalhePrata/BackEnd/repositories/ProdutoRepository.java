package com.detalhePrata.BackEnd.repositories;

import com.detalhePrata.BackEnd.models.Categoria;
import com.detalhePrata.BackEnd.models.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    
    // Buscar produtos por categoria
    List<Produto> findByCategoria(Categoria categoria);
    
    // Buscar produtos por ID da categoria
    @Query("SELECT p FROM Produto p WHERE p.categoria.id = :categoriaId")
    List<Produto> findByCategoriaId(@Param("categoriaId") Long categoriaId);
    
    // Buscar produtos ativos
    List<Produto> findByAtivoTrue();
    
    // Buscar produtos em destaque
    List<Produto> findByDestaqueTrueAndAtivoTrue();
    
    // Buscar produtos por material
    List<Produto> findByMaterialContainingIgnoreCase(String material);
    
    // Buscar produtos por nome (case insensitive)
    List<Produto> findByNomeContainingIgnoreCase(String nome);
    
    // Buscar por código
    Optional<Produto> findByCode(String code);
    
    // Contar produtos por categoria
    long countByCategoriaId(Long categoriaId);
    
    // Buscar produtos com estoque disponível
    @Query("SELECT DISTINCT p FROM Produto p LEFT JOIN p.variantes v WHERE p.ativo = true AND (v.estoque > 0 OR SIZE(p.variantes) = 0)")
    List<Produto> findProdutosComEstoqueDisponivel();
}