package com.detalhePrata.BackEnd.dtos;

import java.math.BigDecimal;

public record ItemPedidoDTO(
    String nomeProduto,
    String tamanho,
    Integer quantidade,
    BigDecimal precoUnitario,
    BigDecimal subtotal
) {}