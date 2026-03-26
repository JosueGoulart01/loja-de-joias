package com.detalhePrata.BackEnd.dtos;

import java.math.BigDecimal;

public record VarianteProdutoDTO(
        Long id,
        String tamanho,
        String cor,
        Integer estoque,
        BigDecimal precoAdicional,
        String imagemVariante
) {}