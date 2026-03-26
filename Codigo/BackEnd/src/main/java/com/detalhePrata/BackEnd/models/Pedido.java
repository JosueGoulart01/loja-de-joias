package com.detalhePrata.BackEnd.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
@Data
@NoArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "valor_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "valor_desconto", precision = 10, scale = 2)
    private BigDecimal valorDesconto = BigDecimal.ZERO;

    @Column(name = "valor_frete", precision = 10, scale = 2)
    private BigDecimal frete;

    @Column(name = "cupom_codigo")
    private String cupomCodigo;

    @Column(name = "metodo_pagamento")
    private String metodoPagamento;

    @Column(name = "codigo_pagamento")
    private String codigoPagamento;

    @Column(name = "codigo_rastreio")
    private String codigoRastreio;

    @Column(name = "url_nota_fiscal")
    private String urlNotaFiscal;

    private String status;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "carrinho_origem_id")
    private Long carrinhoOrigemId;

    // --- ALTERAÇÃO AQUI: Vínculo com Endereço ---
    @ManyToOne
    @JoinColumn(name = "endereco_entrega_id")
    private Endereco enderecoEntrega;
    // --------------------------------------------

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao = LocalDateTime.now();

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ItemPedido> itens = new ArrayList<>();

    public void adicionarItem(ItemPedido item) {
        item.setPedido(this);
        this.itens.add(item);
    }
}