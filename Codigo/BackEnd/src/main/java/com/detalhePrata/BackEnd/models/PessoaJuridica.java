package com.detalhePrata.BackEnd.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@PrimaryKeyJoinColumn(name = "usuario_id")
@Data
@EqualsAndHashCode(callSuper = true)
public class PessoaJuridica extends Usuario {
    
    @Column(name = "razao_social", nullable = false)
    private String razaoSocial;
    
    @Column(name = "nome_fantasia", nullable = false)
    private String nomeFantasia;
    
    @Column(nullable = false, unique = true, length = 18)
    private String cnpj;
    
    @Column(name = "inscricao_estadual")
    private String inscricaoEstadual;
    
    @Column(name = "nome_responsavel", nullable = false)
    private String nomeResponsavel;
    
    @Column(name = "sobrenome_responsavel", nullable = false)
    private String sobrenomeResponsavel;
    
    @Column(name = "como_nos_conheceu")
    private String comoNosConheceu;
    
    // --- CORREÇÃO: Relacionamento Empresa ---
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "endereco_empresa_id")
    private Endereco enderecoEmpresa;
    // ---------------------------------------
    
    // --- CORREÇÃO: Relacionamento Entrega ---
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "endereco_entrega_id")
    private Endereco enderecoEntrega;
    // ----------------------------------------
    
    public PessoaJuridica() {
        super();
    }
    
    public PessoaJuridica(String email, String senha, String razaoSocial, String nomeFantasia, String cnpj) {
        super(email, senha, "USER");
        this.razaoSocial = razaoSocial;
        this.nomeFantasia = nomeFantasia;
        this.cnpj = cnpj;
    }
}