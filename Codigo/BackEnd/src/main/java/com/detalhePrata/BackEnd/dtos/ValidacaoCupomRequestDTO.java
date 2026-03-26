package com.detalhePrata.BackEnd.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ValidacaoCupomRequestDTO {

    @NotBlank(message = "Código do cupom é obrigatório")
    private String codigo;

    @NotNull(message = "Valor do pedido é obrigatório")
    private BigDecimal valorPedido;

    // --- NOVO CAMPO DA OPÇÃO A ---
    private Long usuarioId; // Opcional (pode ser null se usuário não logado)

    // --- CONSTRUTORES ---

    public ValidacaoCupomRequestDTO() {}

    // Construtor antigo (Mantido para compatibilidade onde não há usuário)
    public ValidacaoCupomRequestDTO(String codigo, BigDecimal valorPedido) {
        this.codigo = codigo;
        this.valorPedido = valorPedido;
    }

    // Construtor NOVO (Usado pelo PedidoService e CarrinhoService)
    public ValidacaoCupomRequestDTO(String codigo, BigDecimal valorPedido, Long usuarioId) {
        this.codigo = codigo;
        this.valorPedido = valorPedido;
        this.usuarioId = usuarioId;
    }

    // ---------------------------------------------------

    // Getters e Setters
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public BigDecimal getValorPedido() { return valorPedido; }
    public void setValorPedido(BigDecimal valorPedido) { this.valorPedido = valorPedido; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
}