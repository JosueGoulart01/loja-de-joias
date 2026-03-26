package com.detalhePrata.BackEnd.dtos;

import com.detalhePrata.BackEnd.models.Cupom;
import java.math.BigDecimal;

public class ValidacaoCupomResponseDTO {
    
    private boolean valido;
    private String mensagem;
    private CupomResponseDTO cupom;
    private BigDecimal valorDesconto;

    // Construtor para cupom inválido
    public ValidacaoCupomResponseDTO(boolean valido, String mensagem) {
        this.valido = valido;
        this.mensagem = mensagem;
        this.cupom = null;
        this.valorDesconto = BigDecimal.ZERO;
    }

    // Construtor para cupom válido
    public ValidacaoCupomResponseDTO(boolean valido, Cupom cupom, BigDecimal valorDesconto) {
        this.valido = valido;
        this.mensagem = "Cupom válido";
        this.cupom = new CupomResponseDTO(cupom);
        this.valorDesconto = valorDesconto;
    }

    // Construtor vazio
    public ValidacaoCupomResponseDTO() {}

    // Getters e Setters
    public boolean isValido() { return valido; }
    public void setValido(boolean valido) { this.valido = valido; }

    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }

    public CupomResponseDTO getCupom() { return cupom; }
    public void setCupom(CupomResponseDTO cupom) { this.cupom = cupom; }

    public BigDecimal getValorDesconto() { return valorDesconto; }
    public void setValorDesconto(BigDecimal valorDesconto) { this.valorDesconto = valorDesconto; }
}