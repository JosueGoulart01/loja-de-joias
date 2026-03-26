package com.detalhePrata.BackEnd.dtos;

import com.detalhePrata.BackEnd.models.Cupom;
import com.detalhePrata.BackEnd.models.enums.TipoDesconto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CupomResponseDTO {

    private Long id;
    private String codigo;
    private TipoDesconto tipoDesconto;
    private BigDecimal valor;
    private BigDecimal valorMinimoPedido;
    private Integer quantidadeUsos;
    private Integer usosRestantes;
    private Boolean ativo;
    private Boolean tipoCNPJ;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;

    public CupomResponseDTO() {}

    public CupomResponseDTO(Cupom cupom) {
        this.id = cupom.getId();
        this.codigo = cupom.getCodigo();
        this.tipoDesconto = cupom.getTipoDesconto();
        this.valor = cupom.getValor();
        this.valorMinimoPedido = cupom.getValorMinimoPedido();
        this.quantidadeUsos = cupom.getQuantidadeUsos();
        this.usosRestantes = cupom.getUsosRestantes();
        this.ativo = cupom.getAtivo();
        this.tipoCNPJ = cupom.getTipoCNPJ();
        this.dataCriacao = cupom.getDataCriacao();
        this.dataAtualizacao = cupom.getDataAtualizacao();
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public Integer getUsosRestantes() { return usosRestantes; }
    public void setUsosRestantes(Integer usosRestantes) { this.usosRestantes = usosRestantes; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }

    public Boolean getTipoCNPJ() { return tipoCNPJ; }
    public void setTipoCNPJ(Boolean tipoCNPJ) { this.tipoCNPJ = tipoCNPJ; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }

    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }
}