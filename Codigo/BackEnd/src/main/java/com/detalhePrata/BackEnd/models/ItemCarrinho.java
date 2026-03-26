package com.detalhePrata.BackEnd.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "itens_carrinho")
public class ItemCarrinho {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "carrinho_id", nullable = false)
    @JsonBackReference
    private Carrinho carrinho;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "variante_id")
    private VarianteProduto variante;
    
    @Column(nullable = false)
    private Integer quantidade = 1;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precoUnitario;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal precoOriginalUnitario;

    // Construtores
    public ItemCarrinho() {}

    public ItemCarrinho(Produto produto, Integer quantidade) {
        this.produto = produto;
        this.quantidade = quantidade;
        this.precoUnitario = produto.getPrecoBase();
        this.precoOriginalUnitario = produto.getPrecoOriginal();
    }

    public ItemCarrinho(Produto produto, VarianteProduto variante, Integer quantidade) {
        this.produto = produto;
        this.variante = variante;
        this.quantidade = quantidade;
        this.precoUnitario = calcularPrecoUnitario(produto, variante);
        this.precoOriginalUnitario = produto.getPrecoOriginal();
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Carrinho getCarrinho() { return carrinho; }
    public void setCarrinho(Carrinho carrinho) { this.carrinho = carrinho; }
    
    public Produto getProduto() { return produto; }
    public void setProduto(Produto produto) { 
        this.produto = produto;
        // Recalcular preço quando o produto for alterado
        if (produto != null) {
            this.precoUnitario = calcularPrecoUnitario(produto, this.variante);
            this.precoOriginalUnitario = produto.getPrecoOriginal();
        }
    }
    
    public VarianteProduto getVariante() { return variante; }
    public void setVariante(VarianteProduto variante) { 
        this.variante = variante;
        // Recalcular preço quando a variante for alterada
        if (this.produto != null) {
            this.precoUnitario = calcularPrecoUnitario(this.produto, variante);
        }
    }
    
    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { 
        this.quantidade = quantidade != null ? quantidade : 1;
    }
    
    public BigDecimal getPrecoUnitario() { return precoUnitario; }
    public void setPrecoUnitario(BigDecimal precoUnitario) { 
        this.precoUnitario = precoUnitario != null ? precoUnitario : BigDecimal.ZERO;
    }
    
    public BigDecimal getPrecoOriginalUnitario() { return precoOriginalUnitario; }
    public void setPrecoOriginalUnitario(BigDecimal precoOriginalUnitario) { 
        this.precoOriginalUnitario = precoOriginalUnitario;
    }

    // Métodos de negócio
    public BigDecimal getSubtotal() {
        if (precoUnitario == null || quantidade == null) {
            return BigDecimal.ZERO;
        }
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }
    
    public String getTamanhoSelecionado() {
        return variante != null ? variante.getTamanho() : null;
    }
    
    public String getImagemProduto() {
        if (variante != null && variante.getImagemVariante() != null) {
            return variante.getImagemVariante();
        }
        return produto != null ? produto.getImagemPrincipal() : null;
    }
    
    public String getNomeProduto() {
        return produto != null ? produto.getNome() : "Produto não encontrado";
    }
    
    public String getCodigoProduto() {
        return produto != null ? produto.getCode() : null;
    }
    
    public boolean temVariante() {
        return variante != null;
    }
    
    public boolean isDisponivel() {
        if (produto == null || !produto.getAtivo()) {
            return false;
        }
        
        if (variante != null) {
            return variante.getEstoque() != null && variante.getEstoque() >= quantidade;
        }
        
        // Se não tem variante, verifica se há estoque geral ou se o produto permite compra sem estoque
        return true; // Modifique conforme sua regra de negócio para estoque
    }
    
    public boolean temEstoqueSuficiente() {
        if (variante != null) {
            return variante.getEstoque() != null && variante.getEstoque() >= quantidade;
        }
        // Se não tem variante, assuma que há estoque suficiente
        // Ou implemente lógica de estoque geral se aplicável
        return true;
    }
    
    public void incrementarQuantidade(int quantidadeAdicional) {
        if (quantidadeAdicional > 0) {
            this.quantidade += quantidadeAdicional;
        }
    }
    
    public void decrementarQuantidade(int quantidadeRemover) {
        if (quantidadeRemover > 0) {
            this.quantidade = Math.max(0, this.quantidade - quantidadeRemover);
        }
    }
    
    public void atualizarPreco() {
        if (produto != null) {
            this.precoUnitario = calcularPrecoUnitario(produto, variante);
            this.precoOriginalUnitario = produto.getPrecoOriginal();
        }
    }
    
    private BigDecimal calcularPrecoUnitario(Produto produto, VarianteProduto variante) {
        if (produto == null) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal preco = produto.getPrecoBase() != null ? produto.getPrecoBase() : BigDecimal.ZERO;
        if (variante != null && variante.getPrecoAdicional() != null) {
            preco = preco.add(variante.getPrecoAdicional());
        }
        return preco;
    }
    
    // Método para verificar se é o mesmo produto e variante
    public boolean isMesmoItem(Produto produto, VarianteProduto variante) {
        if (this.produto == null || produto == null) {
            return false;
        }
        
        boolean mesmoProduto = this.produto.getId().equals(produto.getId());
        
        if (variante == null) {
            return mesmoProduto && this.variante == null;
        } else {
            return mesmoProduto && this.variante != null && this.variante.getId().equals(variante.getId());
        }
    }
    
    @Override
    public String toString() {
        return "ItemCarrinho{" +
                "id=" + id +
                ", produto=" + (produto != null ? produto.getNome() : "null") +
                ", variante=" + (variante != null ? variante.getTamanho() : "null") +
                ", quantidade=" + quantidade +
                ", precoUnitario=" + precoUnitario +
                '}';
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        ItemCarrinho that = (ItemCarrinho) o;
        
        if (!produto.getId().equals(that.produto.getId())) return false;
        
        if (variante == null) {
            return that.variante == null;
        } else {
            return variante.equals(that.variante);
        }
    }
    
    @Override
    public int hashCode() {
        int result = produto.getId().hashCode();
        result = 31 * result + (variante != null ? variante.hashCode() : 0);
        return result;
    }
}