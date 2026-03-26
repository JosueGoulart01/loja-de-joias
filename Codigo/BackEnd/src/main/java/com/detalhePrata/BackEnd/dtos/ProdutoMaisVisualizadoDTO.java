package com.detalhePrata.BackEnd.dtos;

public class ProdutoMaisVisualizadoDTO {
    private Long id;
    private String nome;
    private String categoria;
    private Integer visualizacoes;
    private Double taxaConversao;
    private Integer vendas;
    private Double crescimento;
    private String tempoMedio;
    
    public ProdutoMaisVisualizadoDTO() {}
    
    public ProdutoMaisVisualizadoDTO(Long id, String nome, String categoria, Integer visualizacoes, 
                                    Double taxaConversao, Integer vendas, Double crescimento, String tempoMedio) {
        this.id = id;
        this.nome = nome;
        this.categoria = categoria;
        this.visualizacoes = visualizacoes;
        this.taxaConversao = taxaConversao;
        this.vendas = vendas;
        this.crescimento = crescimento;
        this.tempoMedio = tempoMedio;
    }
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    
    public Integer getVisualizacoes() { return visualizacoes; }
    public void setVisualizacoes(Integer visualizacoes) { this.visualizacoes = visualizacoes; }
    
    public Double getTaxaConversao() { return taxaConversao; }
    public void setTaxaConversao(Double taxaConversao) { this.taxaConversao = taxaConversao; }
    
    public Integer getVendas() { return vendas; }
    public void setVendas(Integer vendas) { this.vendas = vendas; }
    
    public Double getCrescimento() { return crescimento; }
    public void setCrescimento(Double crescimento) { this.crescimento = crescimento; }
    
    public String getTempoMedio() { return tempoMedio; }
    public void setTempoMedio(String tempoMedio) { this.tempoMedio = tempoMedio; }
}