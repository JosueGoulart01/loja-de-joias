package com.detalhePrata.BackEnd.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class CarrinhoResponseDTO {
    private Long id;
    private String sessaoId;
    private List<ItemCarrinhoResponseDTO> itens;
    private String cupomCodigo;
    private BigDecimal desconto;
    private String cepFrete;
    private BigDecimal valorFrete;
    private BigDecimal subtotal;
    private BigDecimal total;
    private Integer quantidadeTotal;
    private Boolean finalizado;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getSessaoId() { return sessaoId; }
    public void setSessaoId(String sessaoId) { this.sessaoId = sessaoId; }
    
    public List<ItemCarrinhoResponseDTO> getItens() { return itens; }
    public void setItens(List<ItemCarrinhoResponseDTO> itens) { this.itens = itens; }
    
    public String getCupomCodigo() { return cupomCodigo; }
    public void setCupomCodigo(String cupomCodigo) { this.cupomCodigo = cupomCodigo; }
    
    public BigDecimal getDesconto() { return desconto; }
    public void setDesconto(BigDecimal desconto) { this.desconto = desconto; }
    
    public String getCepFrete() { return cepFrete; }
    public void setCepFrete(String cepFrete) { this.cepFrete = cepFrete; }
    
    public BigDecimal getValorFrete() { return valorFrete; }
    public void setValorFrete(BigDecimal valorFrete) { this.valorFrete = valorFrete; }
    
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    
    public Integer getQuantidadeTotal() { return quantidadeTotal; }
    public void setQuantidadeTotal(Integer quantidadeTotal) { this.quantidadeTotal = quantidadeTotal; }
    
    public Boolean getFinalizado() { return finalizado; }
    public void setFinalizado(Boolean finalizado) { this.finalizado = finalizado; }
    
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
    
    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }
}