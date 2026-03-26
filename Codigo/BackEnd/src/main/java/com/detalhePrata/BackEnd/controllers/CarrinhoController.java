package com.detalhePrata.BackEnd.controllers;

import com.detalhePrata.BackEnd.dtos.CarrinhoResponseDTO;
import com.detalhePrata.BackEnd.dtos.FinalizarCarrinhoRequestDTO;
import com.detalhePrata.BackEnd.dtos.ItemCarrinhoRequestDTO;
import com.detalhePrata.BackEnd.services.CarrinhoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carrinho")
@CrossOrigin(origins = "*")
public class CarrinhoController {

    @Autowired
    private CarrinhoService carrinhoService;

    @GetMapping
    public ResponseEntity<CarrinhoResponseDTO> obterCarrinho(@RequestHeader("X-Session-Id") String sessaoId) {
        CarrinhoResponseDTO carrinho = carrinhoService.obterCarrinhoPorSessao(sessaoId);
        return ResponseEntity.ok(carrinho);
    }

    @PostMapping("/itens")
    public ResponseEntity<CarrinhoResponseDTO> adicionarItem(
            @RequestHeader("X-Session-Id") String sessaoId,
            @RequestBody ItemCarrinhoRequestDTO itemRequest) {
        CarrinhoResponseDTO carrinho = carrinhoService.adicionarItem(sessaoId, itemRequest);
        return ResponseEntity.ok(carrinho);
    }

    @PutMapping("/itens")
    public ResponseEntity<CarrinhoResponseDTO> atualizarQuantidade(
            @RequestHeader("X-Session-Id") String sessaoId,
            @RequestParam Long produtoId,
            @RequestParam(required = false) Long varianteId,
            @RequestParam Integer quantidade) {
        CarrinhoResponseDTO carrinho = carrinhoService.atualizarQuantidade(sessaoId, produtoId, varianteId, quantidade);
        return ResponseEntity.ok(carrinho);
    }

    @DeleteMapping("/itens")
    public ResponseEntity<CarrinhoResponseDTO> removerItem(
            @RequestHeader("X-Session-Id") String sessaoId,
            @RequestParam Long produtoId,
            @RequestParam(required = false) Long varianteId) {
        CarrinhoResponseDTO carrinho = carrinhoService.removerItem(sessaoId, produtoId, varianteId);
        return ResponseEntity.ok(carrinho);
    }

    // NOVO ENDPOINT: Finalizar carrinho (checkout)
    @PostMapping("/finalizar")
    public ResponseEntity<CarrinhoResponseDTO> finalizarCarrinho(
            @RequestHeader("X-Session-Id") String sessaoId,
            @RequestBody(required = false) FinalizarCarrinhoRequestDTO request) {
        
        Long usuarioId = request != null ? request.getUsuarioId() : null;
        CarrinhoResponseDTO carrinho = carrinhoService.finalizarCarrinho(sessaoId, usuarioId);
        return ResponseEntity.ok(carrinho);
    }

    // NOVO ENDPOINT: Finalizar carrinho com usuário via parâmetro (alternativo)
    @PostMapping("/finalizar-simples")
    public ResponseEntity<CarrinhoResponseDTO> finalizarCarrinhoSimples(
            @RequestHeader("X-Session-Id") String sessaoId,
            @RequestParam(required = false) Long usuarioId) {
        
        CarrinhoResponseDTO carrinho = carrinhoService.finalizarCarrinho(sessaoId, usuarioId);
        return ResponseEntity.ok(carrinho);
    }

    // NOVO ENDPOINT: Obter carrinhos finalizados (para admin/relatórios)
    @GetMapping("/finalizados")
    public ResponseEntity<List<CarrinhoResponseDTO>> obterCarrinhosFinalizados() {
        List<CarrinhoResponseDTO> carrinhos = carrinhoService.obterCarrinhosFinalizados();
        return ResponseEntity.ok(carrinhos);
    }

    @PostMapping("/cupom")
    public ResponseEntity<CarrinhoResponseDTO> aplicarCupom(
            @RequestHeader("X-Session-Id") String sessaoId,
            @RequestParam String codigoCupom) {
        CarrinhoResponseDTO carrinho = carrinhoService.aplicarCupom(sessaoId, codigoCupom);
        return ResponseEntity.ok(carrinho);
    }

    @DeleteMapping("/cupom")
    public ResponseEntity<CarrinhoResponseDTO> removerCupom(@RequestHeader("X-Session-Id") String sessaoId) {
        CarrinhoResponseDTO carrinho = carrinhoService.removerCupom(sessaoId);
        return ResponseEntity.ok(carrinho);
    }

    @PostMapping("/frete")
    public ResponseEntity<CarrinhoResponseDTO> calcularFrete(
            @RequestHeader("X-Session-Id") String sessaoId,
            @RequestParam String cep) {
        CarrinhoResponseDTO carrinho = carrinhoService.calcularFrete(sessaoId, cep);
        return ResponseEntity.ok(carrinho);
    }

    @DeleteMapping
    public ResponseEntity<Void> limparCarrinho(@RequestHeader("X-Session-Id") String sessaoId) {
        carrinhoService.limparCarrinho(sessaoId);
        return ResponseEntity.noContent().build();
    }


    // Em: CarrinhoController.java
    // (Idealmente, proteger este endpoint apenas para Admins)
    @GetMapping("/{id}")
    public ResponseEntity<CarrinhoResponseDTO> getCarrinhoById(@PathVariable Long id) {
        // 'obterCarrinhoPorId' precisará ser criado no CarrinhoService
        CarrinhoResponseDTO carrinho = carrinhoService.obterCarrinhoPorId(id); 
        
        if (carrinho == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(carrinho);
    }
}