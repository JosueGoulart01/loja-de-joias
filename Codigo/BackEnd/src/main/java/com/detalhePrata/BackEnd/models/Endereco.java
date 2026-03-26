package com.detalhePrata.BackEnd.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode; // Importante
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "enderecos")
@Data
@NoArgsConstructor
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String rua;
    private String numero;
    private String bairro;
    private String cidade;
    private String estado;
    private String cep;
    private String complemento;

    @Column(name = "ponto_referencia")
    private String pontoReferencia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnore           // Evita loop no JSON
    @ToString.Exclude     // Evita loop no Console
    @EqualsAndHashCode.Exclude // <--- OBRIGATÓRIO: Evita loop no HashCode (Erro atual)
    private Usuario usuario;
}