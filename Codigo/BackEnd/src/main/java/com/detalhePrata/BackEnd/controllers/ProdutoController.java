package com.detalhePrata.BackEnd.controllers;

import com.detalhePrata.BackEnd.dtos.ProdutoDTO;
import com.detalhePrata.BackEnd.models.Produto;
import com.detalhePrata.BackEnd.models.VarianteProduto;
import com.detalhePrata.BackEnd.services.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @GetMapping
    public ResponseEntity<List<Produto>> listarTodos() {
        return ResponseEntity.ok(produtoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        return produtoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Produto> criarProduto(@RequestBody ProdutoDTO dto) {
        try {
            Produto produto = produtoService.salvarProduto(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(produto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(@PathVariable Long id, @RequestBody ProdutoDTO dto) {
        try {
            Produto produto = produtoService.atualizarProduto(id, dto);
            return ResponseEntity.ok(produto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable Long id) {
        try {
            produtoService.deletarProduto(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/variantes/{varianteId}/estoque/decrementar")
    public ResponseEntity<Void> decrementarEstoque(@PathVariable Long varianteId, @RequestParam Integer quantidade) {
        produtoService.decrementarEstoqueVariante(varianteId, quantidade);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/variantes/{varianteId}/estoque/aumentar")
    public ResponseEntity<Void> aumentarEstoque(@PathVariable Long varianteId, @RequestParam Integer quantidade) {
        produtoService.aumentarEstoqueVariante(varianteId, quantidade);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/variantes/{varianteId}/estoque")
    public ResponseEntity<Integer> getEstoque(@PathVariable Long varianteId) {
        return ResponseEntity.ok(produtoService.getEstoqueVariante(varianteId));
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<Produto>> buscarPorCategoria(@PathVariable Long categoriaId) {
        return ResponseEntity.ok(produtoService.buscarPorCategoria(categoriaId));
    }

    @PostMapping("/{produtoId}/variantes")
    public ResponseEntity<VarianteProduto> adicionarVariante(@PathVariable Long produtoId, @RequestBody VarianteProduto variante) {
        VarianteProduto novaVariante = produtoService.adicionarVariante(produtoId, variante);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaVariante);
    }

    // --- NOVO ENDPOINT PARA VISUALIZAÇÕES ---
    @PatchMapping("/{id}/visualizar")
    public ResponseEntity<Void> registrarVisualizacao(@PathVariable Long id) {
        try {
            produtoService.incrementarVisualizacoes(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.ok().build(); // Falha silenciosa para não travar front
        }
    }
}