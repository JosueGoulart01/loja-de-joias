// src/main/java/com/detalhePrata/BackEnd/dtos/VendaDiariaDTO.java
package com.detalhePrata.BackEnd.dtos;

import java.math.BigDecimal;

public class VendaDiariaDTO {
    private String dia;
    private Integer vendas;
    private BigDecimal receita;
    
    public VendaDiariaDTO() {}
    
    public VendaDiariaDTO(String dia, Integer vendas, BigDecimal receita) {
        this.dia = dia;
        this.vendas = vendas;
        this.receita = receita;
    }
    
    // Getters e Setters
    public String getDia() { return dia; }
    public void setDia(String dia) { this.dia = dia; }
    
    public Integer getVendas() { return vendas; }
    public void setVendas(Integer vendas) { this.vendas = vendas; }
    
    public BigDecimal getReceita() { return receita; }
    public void setReceita(BigDecimal receita) { this.receita = receita; }
}