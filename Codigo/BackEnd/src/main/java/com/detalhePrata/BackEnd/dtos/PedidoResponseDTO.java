package com.detalhePrata.BackEnd.dtos;

import com.detalhePrata.BackEnd.models.Pedido;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public record PedidoResponseDTO(
    Long id,
    BigDecimal valor,
    BigDecimal subtotal,
    BigDecimal valorDesconto,
    BigDecimal frete,
    String status,
    String metodoPagamento,
    String codigoPagamento,
    LocalDateTime dataCriacao,
    Long usuarioId,
    Long listaId,
    String codigoRastreio,
    String urlNotaFiscal,
    List<ItemPedidoDTO> itens
) {
    public static PedidoResponseDTO fromEntity(Pedido p) {
        if (p == null) return null;

        List<ItemPedidoDTO> itensDto = Collections.emptyList();
        try {
            if (p.getItens() != null) {
                itensDto = p.getItens().stream()
                    .map(i -> {
                        // BLINDAGEM TOTAL: Verifica cada sub-objeto antes de ler
                        String nomeProd = (i.getProduto() != null) ? i.getProduto().getNome() : "Produto Indisponível";
                        
                        // Tenta pegar tamanho da variante atual, se não der, tenta do snapshot, se não der, "Único"
                        String tam = "Único";
                        if (i.getVariante() != null) {
                            tam = i.getVariante().getTamanho();
                        } else if (i.getTamanhoSnapshot() != null) {
                            tam = i.getTamanhoSnapshot();
                        }

                        return new ItemPedidoDTO(
                            nomeProd,
                            tam,
                            i.getQuantidade() != null ? i.getQuantidade() : 0,
                            i.getPrecoUnitario() != null ? i.getPrecoUnitario() : BigDecimal.ZERO,
                            i.getSubtotal() != null ? i.getSubtotal() : BigDecimal.ZERO
                        );
                    })
                    .collect(Collectors.toList());
            }
        } catch (Exception e) {
            // Loga o erro mas não trava a API
            System.err.println("⚠️ Erro ao processar itens do pedido " + p.getId() + ": " + e.getMessage());
        }

        // BLINDAGEM DE VALORES NULOS
        return new PedidoResponseDTO(
            p.getId(),
            p.getValor() != null ? p.getValor() : BigDecimal.ZERO,
            p.getSubtotal() != null ? p.getSubtotal() : BigDecimal.ZERO,
            p.getValorDesconto() != null ? p.getValorDesconto() : BigDecimal.ZERO,
            p.getFrete() != null ? p.getFrete() : BigDecimal.ZERO,
            p.getStatus() != null ? p.getStatus() : "Pendente",
            p.getMetodoPagamento() != null ? p.getMetodoPagamento() : "Não informado",
            p.getCodigoPagamento(),
            // Tenta getDataCriacao (padrão novo) ou getDataCriado (legado) ou atual
            p.getDataCriacao() != null ? p.getDataCriacao() : LocalDateTime.now(), 
            p.getUsuarioId(),
            p.getCarrinhoOrigemId(),
            p.getCodigoRastreio(),
            p.getUrlNotaFiscal(),
            itensDto
        );
    }
}