package com.detalhePrata.BackEnd.dtos;

public class FinalizarCarrinhoRequestDTO {
    private Long usuarioId;
    private String formaPagamento;
    private EnderecoRequestDTO enderecoEntrega;

    // Getters e Setters
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    
    public String getFormaPagamento() { return formaPagamento; }
    public void setFormaPagamento(String formaPagamento) { this.formaPagamento = formaPagamento; }
    
    public EnderecoRequestDTO getEnderecoEntrega() { return enderecoEntrega; }
    public void setEnderecoEntrega(EnderecoRequestDTO enderecoEntrega) { this.enderecoEntrega = enderecoEntrega; }
}