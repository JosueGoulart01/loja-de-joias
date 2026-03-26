package com.detalhePrata.BackEnd.dtos;

import java.math.BigDecimal;
import java.util.List;

public record PedidoDTO(
    BigDecimal valor,
    BigDecimal frete,
    String metodoPagamento,
    String codigoPagamento,
    String status,
    Long usuarioId,
    String email,
    Long listaId, // ID do Carrinho
    String cupomCodigo,
    Long enderecoId // <--- NOVO CAMPO: ID do endereço escolhido
) {}