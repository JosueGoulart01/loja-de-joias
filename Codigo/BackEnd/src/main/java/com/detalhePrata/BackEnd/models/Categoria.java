package com.detalhePrata.BackEnd.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "categorias")
@Data
@NoArgsConstructor
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    @Column(nullable = false)
    private boolean ativa = true;

    // Relacionamento inverso: Uma Categoria pode ter muitos Produtos
    @OneToMany(mappedBy = "categoria", fetch = FetchType.LAZY)
    @JsonIgnore // Ignora este campo ao serializar para JSON para evitar loops
    private List<Produto> produtos;

    public Categoria(String nome, boolean ativa) {
        this.nome = nome;
        this.ativa = ativa;
    }

    // MÉTODO CONVÊNIENCE PARA ADICIONAR PRODUTO
    public void adicionarProduto(Produto produto) {
        this.produtos.add(produto);
        produto.setCategoria(this);
    }

    // MÉTODO CONVÊNIENCE PARA REMOVER PRODUTO
    public void removerProduto(Produto produto) {
        this.produtos.remove(produto);
        produto.setCategoria(null);
    }

    // MÉTODO PARA CONTAR PRODUTOS
    public Integer getQuantidadeProdutos() {
        return this.produtos != null ? this.produtos.size() : 0;
    }
}