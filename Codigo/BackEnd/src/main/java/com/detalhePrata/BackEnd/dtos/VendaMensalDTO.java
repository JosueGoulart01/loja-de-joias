package com.detalhePrata.BackEnd.dtos;

import java.math.BigDecimal;

public class VendaMensalDTO {
    private String mes;
    private BigDecimal valor;

    public VendaMensalDTO(String mes, BigDecimal valor) {
        this.mes = mes;
        this.valor = valor;
    }
    
    // Getters e Setters
    public String getMes() { return mes; }
    public void setMes(String mes) { this.mes = mes; }
    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }
}