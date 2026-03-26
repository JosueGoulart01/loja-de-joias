package com.detalhePrata.BackEnd.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.util.List;

public record ProdutoDTO(
        @NotBlank(message = "O nome do produto é obrigatório")
        String nome,

        @NotNull(message = "O ID da categoria é obrigatório")
        Long categoriaId,

        String material,
        
        @NotBlank(message = "O código do produto é obrigatório")
        String code,
        
        String descricao,
        
        @NotNull(message = "O preço base é obrigatório")
        BigDecimal precoBase,
        
        BigDecimal precoOriginal,
        
        Boolean ativo,
        
        String imagemPrincipal,
        
        List<String> imagens,
        
        List<String> details,
        
        List<VarianteProdutoDTO> variantes
) {}