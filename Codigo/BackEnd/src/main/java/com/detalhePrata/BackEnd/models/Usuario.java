package com.detalhePrata.BackEnd.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "usuarios")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
// 🚨 CORREÇÃO: Anotações de Soft Delete REMOVIDAS para o Admin ver os inativos
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    private String telefone;

    @Column(nullable = false)
    private String role = "USER";

    @Column(name = "token_reset_senha")
    private String tokenResetSenha;

    @Column(name = "token_reset_senha_expiracao")
    private LocalDateTime tokenResetSenhaExpiracao;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Carrinho> carrinhos = new ArrayList<>();

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao = LocalDateTime.now();

    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao = LocalDateTime.now();

    @Column(nullable = false)
    private Boolean ativo = true;

    public Usuario() {}

    public Usuario(String email, String senha, String role) {
        this.email = email;
        this.senha = senha;
        this.role = role;
        this.ativo = true;
    }

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if ("ADMIN".equalsIgnoreCase(this.role)) {
            return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    @JsonIgnore
    public String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() {
        // O Spring Security checa isso no login.
        // Como removemos o filtro global, essa verificação impede que inativos loguem.
        return this.ativo;
    }

    // Métodos de negócio
    public void adicionarCarrinho(Carrinho carrinho) {
        if (this.carrinhos == null) this.carrinhos = new ArrayList<>();
        carrinho.setUsuario(this);
        this.carrinhos.add(carrinho);
    }

    public void removerCarrinho(Carrinho carrinho) {
        if (this.carrinhos != null) {
            this.carrinhos.remove(carrinho);
            carrinho.setUsuario(null);
        }
    }

    public boolean isAdmin() { return "ADMIN".equalsIgnoreCase(this.role); }
    public boolean isUser() { return "USER".equalsIgnoreCase(this.role); }

    public void ativar() {
        this.ativo = true;
        this.dataAtualizacao = LocalDateTime.now();
    }

    public void desativar() {
        this.ativo = false;
        this.dataAtualizacao = LocalDateTime.now();
    }

    public boolean isAtivo() {
        return this.ativo != null && this.ativo;
    }

    @PrePersist
    protected void onCreate() {
        this.dataCriacao = LocalDateTime.now();
        this.dataAtualizacao = LocalDateTime.now();
        if (this.ativo == null) this.ativo = true;
        if (this.role == null) this.role = "USER";
    }

    @PreUpdate
    protected void onUpdate() {
        this.dataAtualizacao = LocalDateTime.now();
    }

    //setSenha
    public void setSenha(String novaSenha) { //TODO: remover assim que nao precisar mais
        System.out.println("Definindo nova senha para o usuário " + this.email);
        this.senha = novaSenha;
        //this.dataAtualizacao = LocalDateTime.now();
    }
}