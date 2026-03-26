package com.detalhePrata.BackEnd.controllers;

import com.detalhePrata.BackEnd.dtos.CupomRequestDTO;
import com.detalhePrata.BackEnd.dtos.ErrorResponse;
import com.detalhePrata.BackEnd.dtos.UsarCupomRequestDTO;
import com.detalhePrata.BackEnd.dtos.ValidacaoCupomRequestDTO;
import com.detalhePrata.BackEnd.dtos.ValidacaoCupomResponseDTO;
import com.detalhePrata.BackEnd.models.Cupom;
import com.detalhePrata.BackEnd.services.CupomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cupons")
@CrossOrigin(origins = "*")
public class CupomController {

    @Autowired
    private CupomService cupomService;

    @GetMapping
    public ResponseEntity<List<Cupom>> listarTodos() {
        return ResponseEntity.ok(cupomService.listarTodos());
    }

    @GetMapping("/ativos")
    public ResponseEntity<List<Cupom>> listarAtivos() {
        return ResponseEntity.ok(cupomService.listarAtivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cupom> buscarPorId(@PathVariable Long id) {
        return cupomService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Cupom> buscarPorCodigo(@PathVariable String codigo) {
        return cupomService.buscarPorCodigo(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> criarCupom(@RequestBody CupomRequestDTO dto) {
        try {
            Cupom cupom = cupomService.criar(dto);
            return ResponseEntity.ok(cupom);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarCupom(@PathVariable Long id, @RequestBody CupomRequestDTO dto) {
        try {
            Cupom cupom = cupomService.atualizar(id, dto);
            return ResponseEntity.ok(cupom);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarCupom(@PathVariable Long id) {
        try {
            cupomService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // CORREÇÃO: Mudar para PUT e simplificar o endpoint
    @PutMapping("/{id}/ativo")
    public ResponseEntity<?> alternarStatusCupom(@PathVariable Long id) {
        try {
            Cupom cupom = cupomService.alternarStatus(id);
            return ResponseEntity.ok(cupom);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ALTERNATIVA: Se preferir manter PATCH, use este mapeamento
    @PatchMapping("/{id}")
    public ResponseEntity<?> atualizarStatusCupom(@PathVariable Long id, @RequestBody(required = false) String status) {
        try {
            Cupom cupom = cupomService.alternarStatus(id);
            return ResponseEntity.ok(cupom);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/validar")
    public ResponseEntity<ValidacaoCupomResponseDTO> validarCupom(@RequestBody ValidacaoCupomRequestDTO dto) {
        ValidacaoCupomResponseDTO resultado = cupomService.validarCupom(dto);
        return ResponseEntity.ok(resultado);
    }

    @PostMapping("/usar")
    public ResponseEntity<?> usarCupom(@RequestBody UsarCupomRequestDTO dto) {
        try {
            cupomService.registrarUso(dto.getCodigo(), dto.getUsuarioId());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}