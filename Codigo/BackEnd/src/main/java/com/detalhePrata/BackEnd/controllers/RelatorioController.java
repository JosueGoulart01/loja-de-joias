// src/main/java/com/detalhePrata/BackEnd/controllers/RelatorioController.java
package com.detalhePrata.BackEnd.controllers;

import com.detalhePrata.BackEnd.dtos.DashboardResponseDTO;
import com.detalhePrata.BackEnd.dtos.ProdutoMaisVendidoDTO;
import com.detalhePrata.BackEnd.dtos.ProdutoMaisVisualizadoDTO;
import com.detalhePrata.BackEnd.dtos.RelatorioRequestDTO;
import com.detalhePrata.BackEnd.services.RelatorioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/relatorios")
@CrossOrigin(origins = "*")
public class RelatorioController {
    
    @Autowired
    private RelatorioService relatorioService;
    
    @PostMapping("/dashboard")
    public ResponseEntity<DashboardResponseDTO> gerarDashboard(@RequestBody RelatorioRequestDTO request) {
        try {
            // Validação básica
            if (request.getStartDate() == null || request.getEndDate() == null) {
                return ResponseEntity.badRequest().build();
            }
            
            DashboardResponseDTO dashboard = relatorioService.gerarDashboard(request);
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/mais-vendidos")
    public ResponseEntity<List<ProdutoMaisVendidoDTO>> gerarMaisVendidos(@RequestBody RelatorioRequestDTO request) {
        try {
            if (request.getStartDate() == null || request.getEndDate() == null) {
                return ResponseEntity.badRequest().build();
            }
            
            List<ProdutoMaisVendidoDTO> produtos = relatorioService.gerarProdutosMaisVendidos(request);
            return ResponseEntity.ok(produtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/mais-visualizados")
    public ResponseEntity<List<ProdutoMaisVisualizadoDTO>> gerarMaisVisualizados(@RequestBody RelatorioRequestDTO request) {
        try {
            List<ProdutoMaisVisualizadoDTO> produtos = relatorioService.gerarProdutosMaisVisualizados(request);
            return ResponseEntity.ok(produtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Endpoint de health check
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Relatórios API está funcionando!");
    }
}