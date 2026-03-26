package com.detalhePrata.BackEnd.dtos;

import com.detalhePrata.BackEnd.models.enums.TipoDesconto;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class CupomRequestDTO {

    @NotBlank(message = "Código é obrigatório")
    @Size(max = 50, message = "Código deve ter no máximo 50 caracteres")
    private String codigo;

    @NotNull(message = "Tipo de desconto é obrigatório")
    private TipoDesconto tipoDesconto;

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    private BigDecimal valor;

    @NotNull(message = "Valor mínimo do pedido é obrigatório")
    @DecimalMin(value = "0.00", message = "Valor mínimo não pode ser negativo")
    private BigDecimal valorMinimoPedido = BigDecimal.ZERO;

    @NotNull(message = "Quantidade de usos é obrigatória")
    @Min(value = 1, message = "Quantidade de usos deve ser pelo menos 1")
    private Integer quantidadeUsos = 1;

    private Boolean ativo = true;

    private Boolean tipoCNPJ = false;

    // Getters e Setters
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public TipoDesconto getTipoDesconto() { return tipoDesconto; }
    public void setTipoDesconto(TipoDesconto tipoDesconto) { this.tipoDesconto = tipoDesconto; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public BigDecimal getValorMinimoPedido() { return valorMinimoPedido; }
    public void setValorMinimoPedido(BigDecimal valorMinimoPedido) { this.valorMinimoPedido = valorMinimoPedido; }

    public Integer getQuantidadeUsos() { return quantidadeUsos; }
    public void setQuantidadeUsos(Integer quantidadeUsos) { this.quantidadeUsos = quantidadeUsos; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }

    public Boolean getTipoCNPJ() { return tipoCNPJ; }
    public void setTipoCNPJ(Boolean tipoCNPJ) { this.tipoCNPJ = tipoCNPJ; }
}