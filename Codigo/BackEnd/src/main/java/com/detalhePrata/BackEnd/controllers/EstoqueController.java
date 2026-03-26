package com.detalhePrata.BackEnd.controllers;

import com.detalhePrata.BackEnd.models.MovimentacaoEstoque;
import com.detalhePrata.BackEnd.models.enums.TipoMovimentacao;
import com.detalhePrata.BackEnd.repositories.MovimentacaoEstoqueRepository;
import com.detalhePrata.BackEnd.services.EstoqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estoque")
@CrossOrigin(origins = "*")
public class EstoqueController {

    @Autowired
    private EstoqueService estoqueService;

    @Autowired
    private MovimentacaoEstoqueRepository movimentacaoRepository;

    // 1. Histórico de um Produto
    @GetMapping("/historico/{produtoId}")
    public ResponseEntity<List<MovimentacaoEstoque>> getHistorico(@PathVariable Long produtoId) {
        return ResponseEntity.ok(movimentacaoRepository.findAllByProdutoId(produtoId));
    }

    // 2. Registrar Movimentação Manual
    @PostMapping("/movimentar")
    public ResponseEntity<?> movimentar(@RequestBody MovimentacaoManualDTO dto) {
        try {
            // CORREÇÃO: Removido o 5º argumento que estava causando erro
            estoqueService.registrarMovimentacao(
                    dto.varianteId(),
                    dto.quantidade(),
                    dto.tipo(),
                    dto.motivo()
            );
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DTO interno
    public record MovimentacaoManualDTO(
            Long varianteId,
            Integer quantidade,
            TipoMovimentacao tipo,
            String motivo
    ) {}
}