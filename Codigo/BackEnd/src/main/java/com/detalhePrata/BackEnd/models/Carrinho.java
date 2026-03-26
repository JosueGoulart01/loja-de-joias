package com.detalhePrata.BackEnd.models;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidade que representa o Carrinho de Compras da aplicação.
 * Gerencia o ciclo de vida da compra antes da finalização do pedido.
 */
@Entity
@Table(name = "carrinhos")
public class Carrinho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
        name = "sessao_id", 
        nullable = false, 
        unique = true, 
        length = 100
    )
    private String sessaoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    /**
     * Lista de itens do carrinho.
     * Configurado com CascadeType.ALL e orphanRemoval = true para garantir
     * que os itens sejam gerenciados exclusivamente através do ciclo de vida do carrinho.
     */
    @OneToMany(
        mappedBy = "carrinho", 
        cascade = CascadeType.ALL, 
        orphanRemoval = true, 
        fetch = FetchType.LAZY
    )
    private List<ItemCarrinho> itens = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cupom_id")
    private Cupom cupom;

    @Column(precision = 10, scale = 2)
    private BigDecimal valorDesconto = BigDecimal.ZERO;

    @Column(name = "cep_frete", length = 9)
    private String cepFrete;

    @Column(name = "valor_frete", precision = 10, scale = 2)
    private BigDecimal valorFrete = BigDecimal.ZERO;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao = LocalDateTime.now();

    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao = LocalDateTime.now();

    @Column(name = "finalizado")
    private Boolean finalizado = false;

    // ==================================================================================
    // CONSTRUTORES
    // ==================================================================================

    public Carrinho() {
        // Construtor padrão exigido pelo JPA
    }

    public Carrinho(String sessaoId) {
        this.sessaoId = sessaoId;
        this.itens = new ArrayList<>();
    }

    public Carrinho(Usuario usuario) {
        this.usuario = usuario;
        this.sessaoId = (usuario != null) ? "user_" + usuario.getId() : null;
        this.itens = new ArrayList<>();
    }

    // ==================================================================================
    // MÉTODOS DE NEGÓCIO (LÓGICA)
    // ==================================================================================

    /**
     * Calcula o subtotal dos itens presentes no carrinho.
     * @return Soma do subtotal de todos os itens.
     */
    public BigDecimal getSubtotal() {
        if (this.getItens().isEmpty()) {
            return BigDecimal.ZERO;
        }
        return this.getItens().stream()
                .map(ItemCarrinho::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Calcula o valor total do carrinho considerando descontos e frete.
     * @return Valor final a pagar.
     */
    public BigDecimal getTotal() {
        BigDecimal subtotalCalculado = this.getSubtotal();
        
        BigDecimal descontoAplicavel = (this.valorDesconto != null) 
            ? this.valorDesconto 
            : BigDecimal.ZERO;
            
        BigDecimal freteAplicavel = (this.valorFrete != null) 
            ? this.valorFrete 
            : BigDecimal.ZERO;

        BigDecimal totalComDesconto = subtotalCalculado.subtract(descontoAplicavel);
        
        return totalComDesconto.add(freteAplicavel).max(BigDecimal.ZERO);
    }

    /**
     * Soma a quantidade de unidades de todos os itens.
     * @return Inteiro com a quantidade total.
     */
    public Integer getQuantidadeTotal() {
        if (this.getItens().isEmpty()) {
            return 0;
        }
        return this.getItens().stream()
                .mapToInt(ItemCarrinho::getQuantidade)
                .sum();
    }

    /**
     * Adiciona um item ao carrinho ou incrementa quantidade se já existir.
     * Mantém a consistência bidirecional do relacionamento.
     * @param item Item a ser adicionado.
     */
    public void adicionarItem(ItemCarrinho item) {
        if (item == null) return;

        // Vínculo bidirecional
        item.setCarrinho(this);

        Long produtoIdBusca = (item.getProduto() != null) ? item.getProduto().getId() : null;
        Long varianteIdBusca = (item.getVariante() != null) ? item.getVariante().getId() : null;

        ItemCarrinho itemExistente = this.encontrarItemPorProdutoEVariante(produtoIdBusca, varianteIdBusca);

        if (itemExistente != null) {
            int novaQuantidade = itemExistente.getQuantidade() + item.getQuantidade();
            itemExistente.setQuantidade(novaQuantidade);
        } else {
            this.getItens().add(item);
        }
    }

    /**
     * Remove um item do carrinho e limpa a referência.
     * @param item Item a ser removido.
     */
    public void removerItem(ItemCarrinho item) {
        if (item != null) {
            this.getItens().remove(item);
            item.setCarrinho(null);
        }
    }

    /**
     * Busca interna para verificar duplicação de itens no carrinho.
     */
    public ItemCarrinho encontrarItemPorProdutoEVariante(Long produtoId, Long varianteId) {
        if (produtoId == null || this.getItens().isEmpty()) {
            return null;
        }

        return this.getItens().stream()
                .filter(item -> {
                    boolean mesmoProduto = item.getProduto() != null && item.getProduto().getId().equals(produtoId);
                    if (!mesmoProduto) return false;

                    if (varianteId == null) {
                        return item.getVariante() == null;
                    }
                    return item.getVariante() != null && item.getVariante().getId().equals(varianteId);
                })
                .findFirst()
                .orElse(null);
    }

    public void limparItens() {
        // Cria uma cópia para evitar ConcurrentModificationException se iterar sobre a lista original
        List<ItemCarrinho> itensParaRemover = new ArrayList<>(this.getItens());
        for (ItemCarrinho item : itensParaRemover) {
            item.setCarrinho(null);
        }
        this.getItens().clear();
    }

    public void finalizar() {
        this.finalizado = true;
        this.dataAtualizacao = LocalDateTime.now();
    }

    // ==================================================================================
    // LIFECYCLE CALLBACKS
    // ==================================================================================

    @PrePersist
    protected void onCreate() {
        LocalDateTime agora = LocalDateTime.now();
        this.dataCriacao = agora;
        this.dataAtualizacao = agora;
        
        if (this.finalizado == null) {
            this.finalizado = false;
        }
        if (this.valorDesconto == null) {
            this.valorDesconto = BigDecimal.ZERO;
        }
        if (this.valorFrete == null) {
            this.valorFrete = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.dataAtualizacao = LocalDateTime.now();
    }

    // ==================================================================================
    // GETTERS E SETTERS
    // ==================================================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSessaoId() {
        return sessaoId;
    }

    public void setSessaoId(String sessaoId) {
        this.sessaoId = sessaoId;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public List<ItemCarrinho> getItens() {
        if (this.itens == null) {
            this.itens = new ArrayList<>();
        }
        return this.itens;
    }

    public void setItens(List<ItemCarrinho> itens) {
        if (itens != null) {
            this.itens = itens;
            // Garantir integridade referencial ao setar lista completa
            this.itens.forEach(item -> item.setCarrinho(this));
        } else {
            this.itens = new ArrayList<>();
        }
    }

    public Cupom getCupom() {
        return cupom;
    }

    public void setCupom(Cupom cupom) {
        this.cupom = cupom;
    }

    public BigDecimal getValorDesconto() {
        return valorDesconto;
    }

    public void setValorDesconto(BigDecimal valorDesconto) {
        this.valorDesconto = valorDesconto;
    }

    public String getCepFrete() {
        return cepFrete;
    }

    public void setCepFrete(String cepFrete) {
        this.cepFrete = cepFrete;
    }

    public BigDecimal getValorFrete() {
        return valorFrete;
    }

    public void setValorFrete(BigDecimal valorFrete) {
        this.valorFrete = valorFrete;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }

    public void setDataAtualizacao(LocalDateTime dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }

    public Boolean getFinalizado() {
        return finalizado;
    }

    public void setFinalizado(Boolean finalizado) {
        this.finalizado = finalizado;
    }

    @Override
    public String toString() {
        return "Carrinho{" +
                "id=" + id +
                ", sessaoId='" + sessaoId + '\'' +
                ", qtdItens=" + (itens != null ? itens.size() : 0) +
                ", finalizado=" + finalizado +
                '}';
    }
}