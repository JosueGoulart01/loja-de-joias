package com.detalhePrata.BackEnd.controllers;

import com.detalhePrata.BackEnd.dtos.DadosAutenticacaoDTO;
import com.detalhePrata.BackEnd.dtos.DadosTokenJWT;
import com.detalhePrata.BackEnd.dtos.ForgotPasswordDTO;
import com.detalhePrata.BackEnd.dtos.ResetPasswordDTO;
import com.detalhePrata.BackEnd.models.Usuario;
import com.detalhePrata.BackEnd.services.CarrinhoService; // Importar
import com.detalhePrata.BackEnd.services.TokenService;
import com.detalhePrata.BackEnd.services.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private CarrinhoService carrinhoService; // Injetar Service

    @PostMapping("/login")
    public ResponseEntity<DadosTokenJWT> login(@RequestBody @Valid DadosAutenticacaoDTO dados) {
        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.email(), dados.senha());
        Authentication authentication = authenticationManager.authenticate(authenticationToken);
        var usuario = (Usuario) authentication.getPrincipal();

        // --- LÓGICA DE MERGE DE CARRINHO (G4) ---
        if (dados.sessaoId() != null && !dados.sessaoId().isEmpty()) {
            try {
                carrinhoService.mesclarCarrinhos(dados.sessaoId(), usuario);
            } catch (Exception e) {
                // Logamos o erro mas não impedimos o login. O merge é "melhoria", não bloqueante.
                System.err.println("Erro ao mesclar carrinhos no login: " + e.getMessage());
            }
        }
        // ----------------------------------------

        var tokenJWT = tokenService.gerarToken(usuario);
        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));
    }

    // ... (restante dos métodos esqueciSenha e redefinirSenha iguais) ...
    @PostMapping("/esqueci-senha")
    public ResponseEntity<Void> esqueciSenha(@RequestBody @Valid ForgotPasswordDTO data) {
        usuarioService.gerarTokenResetSenha(data.email());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<String> redefinirSenha(@RequestBody @Valid ResetPasswordDTO data) {
        boolean success = usuarioService.resetarSenha(data.token(), data.newPassword());
        if (!success) {
            return ResponseEntity.badRequest().body("Token inválido ou expirado.");
        }
        return ResponseEntity.ok("Senha redefinida com sucesso.");
    }

    @PostMapping("/set-senha")
    public ResponseEntity<String> setSenha(@RequestBody @Valid ResetPasswordDTO data) { //TODO: remover assim que nao precisar mais
        boolean success = usuarioService.setSenha(data.id(),data.newPassword());
        if(!success){
            return ResponseEntity.badRequest().body("Não foi possível definir a senha.");
        }
        return ResponseEntity.ok("Senha definida com sucesso.");
    }
}