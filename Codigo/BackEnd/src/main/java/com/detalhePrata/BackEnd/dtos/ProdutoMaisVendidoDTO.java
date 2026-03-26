package com.detalhePrata.BackEnd.dtos;

import java.math.BigDecimal;

public class ProdutoMaisVendidoDTO {
    private Long id;
    private String nome;
    private String categoria;
    private String especificacao; // <--- NOVO CAMPO
    private Integer quantidadeVendida;
    private BigDecimal receitaTotal;
    private BigDecimal precoMedio;
    private Double crescimento;
    
    public ProdutoMaisVendidoDTO() {}
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    // Getter e Setter da Especificação
    public String getEspecificacao() { return especificacao; }
    public void setEspecificacao(String especificacao) { this.especificacao = especificacao; }
    
    public Integer getQuantidadeVendida() { return quantidadeVendida; }
    public void setQuantidadeVendida(Integer quantidadeVendida) { this.quantidadeVendida = quantidadeVendida; }
    
    public BigDecimal getReceitaTotal() { return receitaTotal; }
    public void setReceitaTotal(BigDecimal receitaTotal) { this.receitaTotal = receitaTotal; }
    
    public BigDecimal getPrecoMedio() { return precoMedio; }
    public void setPrecoMedio(BigDecimal precoMedio) { this.precoMedio = precoMedio; }
    
    public Double getCrescimento() { return crescimento; }
    public void setCrescimento(Double crescimento) { this.crescimento = crescimento; }
}   