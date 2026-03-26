package com.detalhePrata.BackEnd.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "produtos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
// --- CONFIGURAÇÃO DE SOFT DELETE ---
@SQLDelete(sql = "UPDATE produtos SET ativo = false WHERE id = ?")
@Where(clause = "ativo = true")
// -----------------------------------
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @Column(nullable = false)
    private String nome;

    private String material;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "preco_base", nullable = false, precision = 10, scale = 2)
    private BigDecimal precoBase;

    @Column(name = "preco_original", precision = 10, scale = 2)
    private BigDecimal precoOriginal;

    @Column(nullable = false)
    @Builder.Default
    private Boolean ativo = true;

    @Column(name = "imagem_principal")
    private String imagemPrincipal;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "produto_imagens", joinColumns = @JoinColumn(name = "produto_id"))
    @Column(name = "imagem_url")
    @Builder.Default
    private List<String> imagens = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "produto_detalhes", joinColumns = @JoinColumn(name = "produto_id"))
    @Column(name = "detalhe")
    @Builder.Default
    private List<String> details = new ArrayList<>();

    @OneToMany(mappedBy = "produto", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<VarianteProduto> variantes = new ArrayList<>();

    // CAMPOS PARA RELATÓRIOS
    @Builder.Default
    private Integer visualizacoes = 0;

    @Builder.Default
    private Integer vendas = 0;

    @Builder.Default
    private Boolean destaque = false;

    // AUDITORIA
    @Column(name = "data_criacao")
    @Builder.Default
    private LocalDateTime dataCriacao = LocalDateTime.now();

    @Column(name = "data_atualizacao")
    @Builder.Default
    private LocalDateTime dataAtualizacao = LocalDateTime.now();

    // MÉTODOS DE NEGÓCIO
    public boolean isEmPromocao() {
        return this.precoOriginal != null &&
                this.precoBase != null &&
                this.precoBase.compareTo(this.precoOriginal) < 0;
    }

    public BigDecimal getPrecoAtual() {
        return this.precoBase;
    }

    public void setPrecoAtual(BigDecimal precoAtual) {
        this.precoBase = precoAtual;
    }

    public void adicionarVariante(VarianteProduto variante) {
        if (this.variantes == null) {
            this.variantes = new ArrayList<>();
        }
        variante.setProduto(this);
        this.variantes.add(variante);
    }

    public void removerVariante(VarianteProduto variante) {
        if (this.variantes != null) {
            this.variantes.remove(variante);
            variante.setProduto(null);
        }
    }

    public void adicionarImagem(String imagemUrl) {
        if (this.imagens == null) {
            this.imagens = new ArrayList<>();
        }
        this.imagens.add(imagemUrl);
    }

    public void adicionarDetalhe(String detalhe) {
        if (this.details == null) {
            this.details = new ArrayList<>();
        }
        this.details.add(detalhe);
    }

    public void incrementarVisualizacoes() {
        this.visualizacoes++;
    }

    public void incrementarVendas(int quantidade) {
        this.vendas += quantidade;
    }

    public BigDecimal calcularDesconto() {
        if (this.precoOriginal != null && this.precoBase != null &&
                this.precoOriginal.compareTo(BigDecimal.ZERO) > 0) {
            return this.precoOriginal.subtract(this.precoBase);
        }
        return BigDecimal.ZERO;
    }

    public BigDecimal calcularPercentualDesconto() {
        if (this.precoOriginal != null && this.precoBase != null &&
                this.precoOriginal.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal desconto = this.precoOriginal.subtract(this.precoBase);
            return desconto.divide(this.precoOriginal, 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }
        return BigDecimal.ZERO;
    }

    public boolean temEstoque() {
        if (this.variantes != null && !this.variantes.isEmpty()) {
            return this.variantes.stream().anyMatch(v -> v.getEstoque() > 0);
        }
        return true;
    }

    public Integer getEstoqueTotal() {
        if (this.variantes != null && !this.variantes.isEmpty()) {
            return this.variantes.stream()
                    .mapToInt(VarianteProduto::getEstoque)
                    .sum();
        }
        return 0;
    }

    @PreUpdate
    public void preUpdate() {
        this.dataAtualizacao = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Produto{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", code='" + code + '\'' +
                ", precoBase=" + precoBase +
                ", ativo=" + ativo +
                ", visualizacoes=" + visualizacoes +
                ", vendas=" + vendas +
                '}';
    }
}