package com.detalhePrata.BackEnd.dtos;

import java.math.BigDecimal;
import java.util.List;

public class DashboardResponseDTO {
    // ... (Mantenha os campos existentes: receitaTotal, ticketMedio, etc.)
    private BigDecimal receitaTotal;
    private Double receitaVariacao;
    private Integer totalVendas;
    private Double vendasVariacao;
    private BigDecimal ticketMedio;
    private Double ticketVariacao;
    private Integer novosClientes;
    private Double clientesVariacao;
    private Integer produtosVendidos;
    private Double produtosVariacao;
    private Double taxaConversao;
    private Double conversaoVariacao;
    
    private List<CategoriaPerformanceDTO> topCategorias;
    
    // CAMPO ATUALIZADO: Mudou de VendaDiariaDTO para VendaMensalDTO
    private List<VendaMensalDTO> vendasMensais; 
    
    // Placeholder para compatibilidade se o front antigo usar vendasPorDia
    private List<Object> vendasPorDia;

    public DashboardResponseDTO() {}

    // ... (Getters e Setters existentes) ...
    public BigDecimal getReceitaTotal() { return receitaTotal; }
    public void setReceitaTotal(BigDecimal receitaTotal) { this.receitaTotal = receitaTotal; }
    public Double getReceitaVariacao() { return receitaVariacao; }
    public void setReceitaVariacao(Double receitaVariacao) { this.receitaVariacao = receitaVariacao; }
    public Integer getTotalVendas() { return totalVendas; }
    public void setTotalVendas(Integer totalVendas) { this.totalVendas = totalVendas; }
    public Double getVendasVariacao() { return vendasVariacao; }
    public void setVendasVariacao(Double vendasVariacao) { this.vendasVariacao = vendasVariacao; }
    public BigDecimal getTicketMedio() { return ticketMedio; }
    public void setTicketMedio(BigDecimal ticketMedio) { this.ticketMedio = ticketMedio; }
    public Double getTicketVariacao() { return ticketVariacao; }
    public void setTicketVariacao(Double ticketVariacao) { this.ticketVariacao = ticketVariacao; }
    public Integer getNovosClientes() { return novosClientes; }
    public void setNovosClientes(Integer novosClientes) { this.novosClientes = novosClientes; }
    public Double getClientesVariacao() { return clientesVariacao; }
    public void setClientesVariacao(Double clientesVariacao) { this.clientesVariacao = clientesVariacao; }
    public Integer getProdutosVendidos() { return produtosVendidos; }
    public void setProdutosVendidos(Integer produtosVendidos) { this.produtosVendidos = produtosVendidos; }
    public Double getProdutosVariacao() { return produtosVariacao; }
    public void setProdutosVariacao(Double produtosVariacao) { this.produtosVariacao = produtosVariacao; }
    public Double getTaxaConversao() { return taxaConversao; }
    public void setTaxaConversao(Double taxaConversao) { this.taxaConversao = taxaConversao; }
    public Double getConversaoVariacao() { return conversaoVariacao; }
    public void setConversaoVariacao(Double conversaoVariacao) { this.conversaoVariacao = conversaoVariacao; }
    public List<CategoriaPerformanceDTO> getTopCategorias() { return topCategorias; }
    public void setTopCategorias(List<CategoriaPerformanceDTO> topCategorias) { this.topCategorias = topCategorias; }
    
    // Novos Getters/Setters
    public List<VendaMensalDTO> getVendasMensais() { return vendasMensais; }
    public void setVendasMensais(List<VendaMensalDTO> vendasMensais) { this.vendasMensais = vendasMensais; }
    
    public List<Object> getVendasPorDia() { return vendasPorDia; }
    public void setVendasPorDia(List<Object> vendasPorDia) { this.vendasPorDia = vendasPorDia; }
}