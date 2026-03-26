package com.detalhePrata.BackEnd.controllers;

import com.detalhePrata.BackEnd.dtos.PessoaFisicaDTO;
import com.detalhePrata.BackEnd.dtos.PessoaJuridicaDTO;
import com.detalhePrata.BackEnd.services.UsuarioService;
import com.detalhePrata.BackEnd.services.BrasilAPIService;
import com.detalhePrata.BackEnd.utils.ValidadorCNPJ;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cadastro")
public class CadastroController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private BrasilAPIService brasilAPIService;

    @PostMapping("/pf")
    public ResponseEntity<?> criarPessoaFisica(@RequestBody @Valid PessoaFisicaDTO pessoaFisicaDTO) {
        try {
            var novaPessoaFisica = usuarioService.salvarPessoaFisica(pessoaFisicaDTO);
            return new ResponseEntity<>(novaPessoaFisica, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro interno no servidor: " + e.getMessage());
        }
    }

    @PostMapping("/pj")
    public ResponseEntity<?> criarPessoaJuridica(@RequestBody @Valid PessoaJuridicaDTO pessoaJuridicaDTO) {
        try {
            var novaPessoaJuridica = usuarioService.salvarPessoaJuridica(pessoaJuridicaDTO);
            return new ResponseEntity<>(novaPessoaJuridica, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro interno no servidor: " + e.getMessage());
        }
    }

    /**
     * Endpoint para validar CNPJ em tempo real (chamado pelo frontend)
     * GET /api/cadastro/validar-cnpj?cnpj=12.345.678/0001-90
     * 
     * Valida:
     * - Formato (14 dígitos)
     * - Dígitos verificadores (módulo 11)
     * - Existência na Receita Federal (via BrasilAPI)
     * - Se já existe no banco de dados
     * 
     * @param cnpj CNPJ a validar (com ou sem formatação)
     * @return JSON com resultado da validação
     */
    @GetMapping("/validar-cnpj")
    public ResponseEntity<?> validarCNPJ(@RequestParam(name = "cnpj") String cnpj) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (cnpj == null || cnpj.trim().isEmpty()) {
                response.put("valido", false);
                response.put("mensagem", "CNPJ é obrigatório");
                return ResponseEntity.ok(response);
            }

            // PASSO 1: Verifica se CNPJ é válido (formato e dígitos verificadores)
            boolean isValido = ValidadorCNPJ.isValido(cnpj);
            response.put("valido", isValido);

            if (!isValido) {
                response.put("mensagem", ValidadorCNPJ.obterMensagemErro(cnpj));
                return ResponseEntity.ok(response);
            }

            // PASSO 2: Se passou validação local, limpa CNPJ
            String cnpjLimpo = ValidadorCNPJ.limpar(cnpj);

            // PASSO 3: Verifica se CNPJ já existe no banco
            boolean cnpjExisteNoBanco = usuarioService.cnpjJaExiste(cnpjLimpo);
            if (cnpjExisteNoBanco) {
                response.put("valido", false);
                response.put("mensagem", "O CNPJ informado já está cadastrado");
                return ResponseEntity.ok(response);
            }

            // PASSO 4: Valida contra Receita Federal (BrasilAPI) - async não-bloqueante
            // Executa em thread separada para não bloquear a requisição
            Thread validadorThread = new Thread(() -> {
                Map<String, Object> resultadoBrasilAPI = brasilAPIService.validarCNPJComBrasilAPI(cnpjLimpo);
                if (resultadoBrasilAPI != null) {
                    response.putAll(resultadoBrasilAPI);
                }
            });
            validadorThread.start();

            // Aguarda resultado com timeout de 3 segundos
            validadorThread.join(3000);

            if (!response.containsKey("erro") && !response.containsKey("razaoSocial")) {
                // Se BrasilAPI não respondeu mas passou em validação local, aceita
                response.put("valido", true);
                response.put("mensagem", "CNPJ válido (validação local)");
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("valido", false);
            response.put("mensagem", "Erro ao validar CNPJ: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}