package com.detalhePrata.BackEnd.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "cupons_uso")
@Data
@NoArgsConstructor
public class CupomUso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cupom_id", nullable = false)
    private Cupom cupom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "data_uso", nullable = false)
    private LocalDateTime dataUso = LocalDateTime.now();

    public CupomUso(Cupom cupom, Usuario usuario) {
        this.cupom = cupom;
        this.usuario = usuario;
    }
}