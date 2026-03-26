package com.detalhePrata.BackEnd.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "variantes_produto")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VarianteProduto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false)
    @JsonIgnore // Alterado de @JsonBackReference para @JsonIgnore para segurança total no JSON
    private Produto produto;

    @Column(nullable = false)
    private String tamanho;

    @Column(nullable = false)
    private String cor = "Padrão";

    @Column(nullable = false)
    private Integer estoque = 0;

    @Column(name = "preco_adicional", precision = 10, scale = 2)
    private BigDecimal precoAdicional = BigDecimal.ZERO;

    @Column(name = "imagem_variante")
    private String imagemVariante;

    // --- MÉTODOS DE NEGÓCIO (Mantidos do seu código original) ---

    public BigDecimal getPrecoTotal() {
        if (produto != null && produto.getPrecoBase() != null) {
            return produto.getPrecoBase().add(precoAdicional != null ? precoAdicional : BigDecimal.ZERO);
        }
        return precoAdicional != null ? precoAdicional : BigDecimal.ZERO;
    }

    public boolean temEstoque() {
        return estoque != null && estoque > 0;
    }

    public boolean temEstoqueSuficiente(int quantidade) {
        return estoque != null && estoque >= quantidade;
    }

    @Override
    public String toString() {
        return "VarianteProduto{" +
                "id=" + id +
                ", tamanho='" + tamanho + '\'' +
                ", estoque=" + estoque +
                '}';
    }
}