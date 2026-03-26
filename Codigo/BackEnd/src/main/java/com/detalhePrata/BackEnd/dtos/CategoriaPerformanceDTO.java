// src/main/java/com/detalhePrata/BackEnd/dtos/CategoriaPerformanceDTO.java
package com.detalhePrata.BackEnd.dtos;

import java.math.BigDecimal;

public class CategoriaPerformanceDTO {
    private String nome;
    private Integer quantidadeVendida;
    private BigDecimal receitaTotal;
    private Double crescimento;
    
    // Construtor vazio
    public CategoriaPerformanceDTO() {}
    
    // Construtor compatível
    public CategoriaPerformanceDTO(String nome, Integer quantidadeVendida, 
                                 BigDecimal receitaTotal, Double crescimento) {
        this.nome = nome;
        this.quantidadeVendida = quantidadeVendida;
        this.receitaTotal = receitaTotal;
        this.crescimento = crescimento;
    }
    
    // Getters e Setters
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public Integer getQuantidadeVendida() { return quantidadeVendida; }
    public void setQuantidadeVendida(Integer quantidadeVendida) { this.quantidadeVendida = quantidadeVendida; }
    
    public BigDecimal getReceitaTotal() { return receitaTotal; }
    public void setReceitaTotal(BigDecimal receitaTotal) { this.receitaTotal = receitaTotal; }
    
    public Double getCrescimento() { return crescimento; }
    public void setCrescimento(Double crescimento) { this.crescimento = crescimento; }
}