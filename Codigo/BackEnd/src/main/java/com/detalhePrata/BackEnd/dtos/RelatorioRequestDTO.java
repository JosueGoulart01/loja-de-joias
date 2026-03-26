package com.detalhePrata.BackEnd.dtos;

import java.time.LocalDate;

public class RelatorioRequestDTO {
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private String categoria;
    private Integer quantidadeMinima;
    private Integer visualizacoesMinimas;
    private String ordenarPor;
    private String compararCom;
    private String filtroConversao;
    
    // Construtores
    public RelatorioRequestDTO() {}
    
    public RelatorioRequestDTO(LocalDate dataInicio, LocalDate dataFim) {
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
    }
    
    // Getters e Setters
    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }
    
    public LocalDate getDataFim() { return dataFim; }
    public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }
    
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    
    public Integer getQuantidadeMinima() { return quantidadeMinima; }
    public void setQuantidadeMinima(Integer quantidadeMinima) { this.quantidadeMinima = quantidadeMinima; }
    
    public Integer getVisualizacoesMinimas() { return visualizacoesMinimas; }
    public void setVisualizacoesMinimas(Integer visualizacoesMinimas) { this.visualizacoesMinimas = visualizacoesMinimas; }
    
    public String getOrdenarPor() { return ordenarPor; }
    public void setOrdenarPor(String ordenarPor) { this.ordenarPor = ordenarPor; }
    
    public String getCompararCom() { return compararCom; }
    public void setCompararCom(String compararCom) { this.compararCom = compararCom; }
    
    public String getFiltroConversao() { return filtroConversao; }
    public void setFiltroConversao(String filtroConversao) { this.filtroConversao = filtroConversao; }
    
    // Métodos de conveniência para compatibilidade
    public LocalDate getStartDate() { return dataInicio; }
    public LocalDate getEndDate() { return dataFim; }
    public Integer getMinQuantity() { return quantidadeMinima; }
    public Integer getMinViews() { return visualizacoesMinimas; }
    public String getSortBy() { return ordenarPor; }
    public String getConversionFilter() { return filtroConversao; }
}