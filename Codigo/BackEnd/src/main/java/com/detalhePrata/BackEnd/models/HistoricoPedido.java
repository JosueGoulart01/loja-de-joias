package com.detalhePrata.BackEnd.models;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
public class HistoricoPedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long pedidoId;
    private LocalDateTime dataAlteracao = LocalDateTime.now();
    private String status;
    
    public Long getId() {
        return id;
    }
    public Long getPedidoId() {
        return pedidoId;
    }
    public void setPedidoId(Long pedidoId) {
        this.pedidoId = pedidoId;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public LocalDateTime getDataAlteracao() {
        return dataAlteracao;
    }
}
