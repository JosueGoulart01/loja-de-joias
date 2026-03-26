package com.detalhePrata.BackEnd.models;

import com.detalhePrata.BackEnd.models.enums.TipoMovimentacao;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "movimentacoes_estoque")
@Data
public class MovimentacaoEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relacionamento com Variante, pois é ela quem tem o estoque real
    @ManyToOne
    @JoinColumn(name = "variante_id", nullable = false)
    private VarianteProduto variante;

    @Column(nullable = false)
    private Integer quantidade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoMovimentacao tipo;

    private String motivo; // Ex: "Pedido #123"

    // Opcional: Adicionar quem fez a movimentação
    @Column(name = "usuario_responsavel")
    private String usuarioResponsavel;

    private LocalDateTime data = LocalDateTime.now();
}