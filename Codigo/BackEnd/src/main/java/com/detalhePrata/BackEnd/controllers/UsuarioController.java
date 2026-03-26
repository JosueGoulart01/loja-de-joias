package com.detalhePrata.BackEnd.controllers;

import com.detalhePrata.BackEnd.models.PessoaFisica;
import com.detalhePrata.BackEnd.models.PessoaJuridica;
import com.detalhePrata.BackEnd.models.Usuario;
import com.detalhePrata.BackEnd.repositories.UsuarioRepository;
import com.detalhePrata.BackEnd.services.UsuarioService;
import com.detalhePrata.BackEnd.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmailService emailService;

    // =================================================================================
    // ÁREA DO USUÁRIO
    // =================================================================================

    @GetMapping("/perfil")
    public ResponseEntity<Usuario> getPerfil(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/perfil/pf")
    public ResponseEntity<Usuario> updatePessoaFisica(@AuthenticationPrincipal Usuario usuarioLogado, @RequestBody PessoaFisica dadosAtualizados) {
        if (usuarioLogado instanceof PessoaFisica) {
            Usuario usuarioSalvo = usuarioService.atualizarPessoaFisica((PessoaFisica) usuarioLogado, dadosAtualizados);
            return ResponseEntity.ok(usuarioSalvo);
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/perfil/pj")
    public ResponseEntity<Usuario> updatePessoaJuridica(@AuthenticationPrincipal Usuario usuarioLogado, @RequestBody PessoaJuridica dadosAtualizados) {
        if (usuarioLogado instanceof PessoaJuridica) {
            Usuario usuarioSalvo = usuarioService.atualizarPessoaJuridica((PessoaJuridica) usuarioLogado, dadosAtualizados);
            return ResponseEntity.ok(usuarioSalvo);
        }
        return ResponseEntity.badRequest().build();
    }

    // =================================================================================
    // ÁREA DO ADMIN
    // =================================================================================

    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar")
    public ResponseEntity<Usuario> getUsuarioByEmail(@RequestParam String email) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        return usuarioOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarUsuario(@PathVariable Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> alternarStatus(@PathVariable Long id) {
        return usuarioRepository.findById(id).map(usuario -> {
            if (usuario.isAtivo()) {
                usuario.desativar();
            } else {
                usuario.ativar();
            }
            usuarioRepository.save(usuario);
            return ResponseEntity.ok(usuario.isAtivo());
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> adminUpdateUsuario(@PathVariable Long id, @RequestBody Map<String, Object> dados) {
        return usuarioRepository.findById(id).map(usuario -> {
            // 1. Atualiza dados comuns (Usuario)
            if (dados.containsKey("email")) {
                usuario.setEmail((String) dados.get("email"));
            }
            if (dados.containsKey("telefone")) {
                usuario.setTelefone((String) dados.get("telefone"));
            }
            if (dados.containsKey("role")) {
                usuario.setRole((String) dados.get("role"));
            }

            // Lógica de status (boolean)
            if (dados.containsKey("ativo") && dados.get("ativo") != null) {
                boolean novoStatus = (boolean) dados.get("ativo");
                if (novoStatus) usuario.ativar();
                else usuario.desativar();
            }

            // 2. Atualiza dados específicos (PF ou PJ)
            if (usuario instanceof PessoaFisica) {
                PessoaFisica pf = (PessoaFisica) usuario;
                if (dados.containsKey("nome")) pf.setNome((String) dados.get("nome"));
                if (dados.containsKey("cpf")) pf.setCpf((String) dados.get("cpf"));
                // Não precisa salvar 'pf' separado, salvar 'usuario' já salva tudo por herança
            } else if (usuario instanceof PessoaJuridica) {
                PessoaJuridica pj = (PessoaJuridica) usuario;
                if (dados.containsKey("razaoSocial")) pj.setRazaoSocial((String) dados.get("razaoSocial"));
                if (dados.containsKey("cnpj")) pj.setCnpj((String) dados.get("cnpj"));
            }

            usuarioRepository.save(usuario);
            return ResponseEntity.ok(usuario);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/notificacoes/disparar")
    public ResponseEntity<Void> dispararOfertas(@RequestBody NotificacaoDTO dto) {
        List<Usuario> usuarios = usuarioRepository.findAll();
        for (Usuario u : usuarios) {
            try {
                if (u.isAtivo()) {
                    emailService.enviarEmailMarketing(u.getEmail(), dto.titulo(), dto.mensagem());
                }
            } catch (Exception e) {
                // Ignora erro individual
            }
        }
        return ResponseEntity.ok().build();
    }

    public record NotificacaoDTO(String titulo, String mensagem) {}
}