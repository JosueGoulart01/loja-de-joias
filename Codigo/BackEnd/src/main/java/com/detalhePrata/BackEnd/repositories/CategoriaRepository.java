package com.detalhePrata.BackEnd.repositories;

import com.detalhePrata.BackEnd.dtos.CategoriaComContagemDTO;
import com.detalhePrata.BackEnd.models.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    // Query JPQL para buscar todas as categorias e já contar quantos produtos
    // estão associados a cada uma. Isso é o que o seu wireframe pede.
    @Query("SELECT new com.detalhePrata.BackEnd.dtos.CategoriaComContagemDTO(" +
       "c.id, c.nome, c.ativa, COUNT(p.id)) " +
       "FROM Categoria c LEFT JOIN c.produtos p " +
       "GROUP BY c.id, c.nome, c.ativa " +
       "ORDER BY c.nome")
List<CategoriaComContagemDTO> getCategoriasComContagemDeProdutos();

    // Query para listar apenas categorias ativas (para o dropdown do cliente)
    List<Categoria> findByAtivaTrue();

    // Para buscar uma categoria pelo nome
    Optional<Categoria> findByNome(String nome);

    // MÉTODO ADICIONADO: Contar produtos por categoria
    @Query("SELECT COUNT(p) FROM Produto p WHERE p.categoria.id = :categoriaId")
    Long countByCategoriaId(@Param("categoriaId") Long categoriaId);
}