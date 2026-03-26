package com.detalhePrata.BackEnd.models;

import com.detalhePrata.BackEnd.models.enums.TipoDesconto;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cupons")
public class Cupom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String codigo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoDesconto tipoDesconto;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(name = "valor_minimo_pedido", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorMinimoPedido; // Removido valor padrão aqui

    @Column(name = "quantidade_usos", nullable = false)
    private Integer quantidadeUsos; // Removido valor padrão = 1

    @Column(name = "usos_restantes", nullable = false)
    private Integer usosRestantes; // Removido valor padrão = 1

    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(name = "tipo_cnpj", nullable = false)
    private Boolean tipoCNPJ = false;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "data_atualizacao", nullable = false)
    private LocalDateTime dataAtualizacao;

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        dataAtualizacao = LocalDateTime.now();
        // Garante que usosRestantes seja igual ao total se estiver nulo na criação
        if (usosRestantes == null && quantidadeUsos != null) {
            usosRestantes = quantidadeUsos;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        dataAtualizacao = LocalDateTime.now();
    }

    // Construtor vazio
    public Cupom() {}

    // Getters e Setters (LIMPOS, sem lógica de cálculo)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public TipoDesconto getTipoDesconto() { return tipoDesconto; }
    public void setTipoDesconto(TipoDesconto tipoDesconto) { this.tipoDesconto = tipoDesconto; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public BigDecimal getValorMinimoPedido() { return valorMinimoPedido; }
    public void setValorMinimoPedido(BigDecimal valorMinimoPedido) { this.valorMinimoPedido = valorMinimoPedido; }

    public Integer getQuantidadeUsos() { return quantidadeUsos; }

    // AQUI MUDOU: Setter simples. A lógica vai pro Service.
    public void setQuantidadeUsos(Integer quantidadeUsos) {
        this.quantidadeUsos = quantidadeUsos;
    }

    public Integer getUsosRestantes() { return usosRestantes; }
    public void setUsosRestantes(Integer usosRestantes) { this.usosRestantes = usosRestantes; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }

    public Boolean getTipoCNPJ() { return tipoCNPJ; }
    public void setTipoCNPJ(Boolean tipoCNPJ) { this.tipoCNPJ = tipoCNPJ; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }

    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }
}