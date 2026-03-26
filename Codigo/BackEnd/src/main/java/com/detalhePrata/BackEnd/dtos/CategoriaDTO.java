package com.detalhePrata.BackEnd.dtos;

import jakarta.validation.constraints.NotBlank;

// DTO usado para Criar ou Atualizar uma Categoria
public record CategoriaDTO(
        @NotBlank(message = "O nome da categoria é obrigatório")
        String nome,

        boolean ativa
) {}