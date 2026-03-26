package com.detalhePrata.BackEnd.dtos;

// DTO usado para listar as categorias para o Admin
public record CategoriaComContagemDTO(
        Long id,
        String nome,
        Boolean ativa, // Mudei de boolean para Boolean
        Long produtosAssociados
) {
    // Construtor adicional para compatibilidade
    public CategoriaComContagemDTO(Long id, String nome, boolean ativa, Long produtosAssociados) {
        this(id, nome, Boolean.valueOf(ativa), produtosAssociados);
    }
}