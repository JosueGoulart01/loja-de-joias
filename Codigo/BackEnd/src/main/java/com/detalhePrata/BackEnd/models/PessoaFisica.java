package com.detalhePrata.BackEnd.models;

import com.detalhePrata.BackEnd.models.enums.PreferenciaContato;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;

@Entity
@PrimaryKeyJoinColumn(name = "usuario_id")
@Data
@EqualsAndHashCode(callSuper = true)
public class PessoaFisica extends Usuario {

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String sobrenome;

    @Column(nullable = false, unique = true)
    private String cpf;

    @Column(nullable = false)
    private LocalDate dataNascimento;

    // --- CORREÇÃO: De Embedded para OneToOne ---
    // Como Endereco é uma entidade agora, usamos relacionamento.
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "endereco_id") 
    private Endereco endereco;
    // -------------------------------------------

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PreferenciaContato preferenciaContato;

    public PessoaFisica() {
        super();
    }
    
    // Getters manuais (caso o Lombok falhe em tempo de compilação ou para compatibilidade)
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getSobrenome() { return sobrenome; }
    public void setSobrenome(String sobrenome) { this.sobrenome = sobrenome; }
}