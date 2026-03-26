package com.detalhePrata.BackEnd.dtos;

import java.math.BigDecimal;

public class ItemCarrinhoResponseDTO {
    private Long id;
    private Long produtoId;
    private Long varianteId;
    private String nomeProduto;
    private BigDecimal precoUnitario;
    private BigDecimal precoOriginalUnitario;
    private Integer quantidade;
    private String tamanho;
    private String cor;
    private String imagemUrl;
    private BigDecimal subtotal;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getProdutoId() { return produtoId; }
    public void setProdutoId(Long produtoId) { this.produtoId = produtoId; }
    
    public Long getVarianteId() { return varianteId; }
    public void setVarianteId(Long varianteId) { this.varianteId = varianteId; }
    
    public String getNomeProduto() { return nomeProduto; }
    public void setNomeProduto(String nomeProduto) { this.nomeProduto = nomeProduto; }
    
    public BigDecimal getPrecoUnitario() { return precoUnitario; }
    public void setPrecoUnitario(BigDecimal precoUnitario) { this.precoUnitario = precoUnitario; }
    
    public BigDecimal getPrecoOriginalUnitario() { return precoOriginalUnitario; }
    public void setPrecoOriginalUnitario(BigDecimal precoOriginalUnitario) { this.precoOriginalUnitario = precoOriginalUnitario; }
    
    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
    
    public String getTamanho() { return tamanho; }
    public void setTamanho(String tamanho) { this.tamanho = tamanho; }
    
    public String getCor() { return cor; }
    public void setCor(String cor) { this.cor = cor; }
    
    public String getImagemUrl() { return imagemUrl; }
    public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }
    
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}