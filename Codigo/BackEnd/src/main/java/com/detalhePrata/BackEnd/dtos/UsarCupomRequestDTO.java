package com.detalhePrata.BackEnd.dtos;

public class UsarCupomRequestDTO {
    private String codigo;
    private Long usuarioId;

    // Construtores
    public UsarCupomRequestDTO() {}

    public UsarCupomRequestDTO(String codigo, Long usuarioId) {
        this.codigo = codigo;
        this.usuarioId = usuarioId;
    }

    // Getters e Setters
    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
}