package com.detalhePrata.BackEnd.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import java.math.BigDecimal;

@Entity
@Table(name = "itens_pedido")
@Data
@NoArgsConstructor
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    // --- CORREÇÃO DO ERRO 500 ---
    // Se o produto for deletado do banco, o Hibernate ignora em vez de quebrar
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variante_id")
    private VarianteProduto variante;

    // Snapshot: Guarda o nome e tamanho na hora da compra
    private String nomeProdutoSnapshot;
    private String tamanhoSnapshot;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precoUnitario;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    // Getter customizado para garantir que subtotal nunca seja nulo
    public BigDecimal getSubtotal() {
        if (subtotal == null && precoUnitario != null && quantidade != null) {
            return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
        }
        return subtotal != null ? subtotal : BigDecimal.ZERO;
    }

    public ItemPedido(Produto produto, VarianteProduto variante, Integer quantidade, BigDecimal precoUnitario) {
        this.produto = produto;
        this.variante = variante;
        this.quantidade = quantidade;
        this.precoUnitario = precoUnitario;
        this.subtotal = precoUnitario.multiply(BigDecimal.valueOf(quantidade));

        // Salva o nome como texto para histórico, caso o produto seja deletado depois
        this.nomeProdutoSnapshot = (produto != null) ? produto.getNome() : "Produto Removido";
        if (variante != null) {
            this.tamanhoSnapshot = variante.getTamanho();
        }
    }
}