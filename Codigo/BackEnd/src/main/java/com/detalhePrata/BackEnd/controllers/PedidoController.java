package com.detalhePrata.BackEnd.controllers;

import java.util.List;
import com.detalhePrata.BackEnd.dtos.RastreioDTO;
import com.detalhePrata.BackEnd.dtos.ErrorResponse;
import com.detalhePrata.BackEnd.dtos.PedidoResponseDTO;
import com.detalhePrata.BackEnd.models.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.detalhePrata.BackEnd.dtos.PedidoDTO;
import com.detalhePrata.BackEnd.models.HistoricoPedido;
import com.detalhePrata.BackEnd.models.Pedido;
import com.detalhePrata.BackEnd.services.PedidoService;
import com.detalhePrata.BackEnd.services.UsuarioService;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired private PedidoService pedidoService;
    @Autowired private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            return ResponseEntity.ok(pedidoService.getAllAsDTO());
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Erro ao listar: " + e.getMessage()));
        }
    }

    @GetMapping("/meus")
    public ResponseEntity<?> getMeusPedidos(@AuthenticationPrincipal Usuario usuarioLogado) {
        try {
            if (usuarioLogado == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Não autenticado."));
            return ResponseEntity.ok(pedidoService.getByUsuarioAsDTO(usuarioLogado.getId()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ErrorResponse("Erro ao buscar: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPedidoById(@PathVariable Long id, @AuthenticationPrincipal Usuario usuarioLogado) {
        try {
            return ResponseEntity.ok(pedidoService.getByIdAsDTO(id, usuarioLogado));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse(e.getMessage()));
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody String status) {
        if (!isValidStatus(status)) return ResponseEntity.badRequest().body(new ErrorResponse("Status inválido"));
        
        Pedido pedido = pedidoService.getById(id);
        if (pedido == null) return ResponseEntity.notFound().build();
        
        if (status.equals(pedido.getStatus())) return ResponseEntity.ok(PedidoResponseDTO.fromEntity(pedido));
        
        pedidoService.setStatus(pedido, status);
        return ResponseEntity.ok(PedidoResponseDTO.fromEntity(pedidoService.save(pedido)));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody PedidoDTO dto) {
        try {
            var usuario = usuarioService.buscarPorEmail(dto.email());
            if(usuario.isEmpty()) return ResponseEntity.badRequest().body(new ErrorResponse("Usuário não encontrado."));

            // CORREÇÃO AQUI: Adicionado dto.enderecoId() no final
            PedidoDTO novoDto = new PedidoDTO(
                    dto.valor(), 
                    dto.frete(), 
                    dto.metodoPagamento(), 
                    dto.codigoPagamento(),
                    dto.status(), 
                    usuario.get().getId(), 
                    dto.email(), 
                    dto.listaId(), 
                    dto.cupomCodigo(),
                    dto.enderecoId() // <--- O CAMPO QUE FALTAVA
            );

            Pedido pedido = pedidoService.create(novoDto);
            return ResponseEntity.ok(PedidoResponseDTO.fromEntity(pedido));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ErrorResponse("Erro: " + e.getMessage()));
        }
    }

    @PatchMapping("/{id}/rastreio")
    public ResponseEntity<?> atualizarRastreio(@PathVariable Long id, @RequestBody RastreioDTO dto) {
        try {
            return ResponseEntity.ok(PedidoResponseDTO.fromEntity(
                pedidoService.atualizarRastreio(id, dto.codigoRastreio(), dto.urlNotaFiscal())
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}/historico")
    public ResponseEntity<List<HistoricoPedido>> getHistorico(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.getHistorico(id));
    }

    private boolean isValidStatus(String status) {
        return List.of("Aguardando pagamento", "Pagamento aprovado", "Em separação", "Enviado", "Entregue", "Cancelado").contains(status);
    }
}