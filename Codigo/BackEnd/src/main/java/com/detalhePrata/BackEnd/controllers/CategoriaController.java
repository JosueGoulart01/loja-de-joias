package com.detalhePrata.BackEnd.controllers;

import com.detalhePrata.BackEnd.dtos.CategoriaComContagemDTO;
import com.detalhePrata.BackEnd.dtos.CategoriaDTO;
import com.detalhePrata.BackEnd.models.Categoria;
import com.detalhePrata.BackEnd.services.CategoriaService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categorias")
// @CrossOrigin removido pois o SecurityConfig já gerencia isso.
// Se tiver problemas de CORS, verifique o SecurityConfig.java
public class CategoriaController {

    private static final Logger logger = LoggerFactory.getLogger(CategoriaController.class);

    @Autowired
    private CategoriaService categoriaService;

    // 1. Endpoint para o PAINEL ADMINISTRATIVO (Tabela)
    // ROTA: GET /api/categorias
    // Retorna: Lista completa + Contagem de produtos + Status
    @GetMapping
    public ResponseEntity<List<CategoriaComContagemDTO>> listarParaAdmin() {
        logger.info("📋 GET /api/categorias - Listando TODAS as categorias (Admin)");
        List<CategoriaComContagemDTO> categorias = categoriaService.listarCategoriasComContagem();
        logger.info("✅ Retornando {} categorias para o painel admin", categorias.size());
        return ResponseEntity.ok(categorias);
    }

    // 2. Endpoint para o NAVBAR e HOME (Cliente)
    // ROTA: GET /api/categorias/ativas
    // Retorna: Apenas categorias onde ativa = true
    @GetMapping("/ativas")
    public ResponseEntity<List<Categoria>> listarAtivas() {
        logger.info("🌍 GET /api/categorias/ativas - Listando categorias públicas");
        List<Categoria> categorias = categoriaService.listarCategoriasAtivas();
        logger.info("✅ Retornando {} categorias ativas para o cliente", categorias.size());
        return ResponseEntity.ok(categorias);
    }

    // 3. Buscar por ID (Usado na edição)
    // ROTA: GET /api/categorias/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        logger.info("🔍 GET /api/categorias/{}", id);
        try {
            Categoria categoria = categoriaService.buscarPorId(id);
            return ResponseEntity.ok(categoria);
        } catch (Exception e) {
            logger.error("❌ Categoria não encontrada: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 4. Criar Categoria
    // ROTA: POST /api/categorias
    @PostMapping
    public ResponseEntity<?> criarCategoria(@RequestBody @Valid CategoriaDTO dto) {
        logger.info("💾 POST /api/categorias - Criando: {}", dto.nome());
        try {
            Categoria novaCategoria = categoriaService.criarCategoria(dto);
            logger.info("✅ Categoria criada com ID: {}", novaCategoria.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(novaCategoria);
        } catch (Exception e) {
            logger.error("❌ Erro ao criar categoria: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage()); // Retorna o erro exato (ex: "Nome já existe")
        }
    }

    // 5. Atualizar Categoria
    // ROTA: PUT /api/categorias/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarCategoria(@PathVariable Long id, @RequestBody @Valid CategoriaDTO dto) {
        logger.info("📝 PUT /api/categorias/{} - Atualizando para: {}", id, dto.nome());
        try {
            Categoria categoriaAtualizada = categoriaService.atualizarCategoria(id, dto);
            logger.info("✅ Categoria atualizada com sucesso");
            return ResponseEntity.ok(categoriaAtualizada);
        } catch (Exception e) {
            logger.error("❌ Erro ao atualizar: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 6. Deletar Categoria
    // ROTA: DELETE /api/categorias/{id}
    @DeleteMapping("/{id}")
public ResponseEntity<?> deletarCategoria(@PathVariable Long id) {
    logger.info("🗑️ DELETE /api/categorias/{}", id);
    try {
        categoriaService.deletarCategoria(id);
        logger.info("✅ Categoria deletada com sucesso");
        return ResponseEntity.noContent().build();
    } catch (Exception e) {
        logger.error("❌ Erro ao deletar: {}", e.getMessage());
        
        // Retorna um JSON consistente para o frontend
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", e.getMessage());
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }
}
}