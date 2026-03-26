package com.detalhePrata.BackEnd.services;

import com.detalhePrata.BackEnd.dtos.PessoaFisicaDTO;
import com.detalhePrata.BackEnd.dtos.PessoaJuridicaDTO;
import com.detalhePrata.BackEnd.models.Endereco;
import com.detalhePrata.BackEnd.models.PessoaFisica;
import com.detalhePrata.BackEnd.models.PessoaJuridica;
import com.detalhePrata.BackEnd.models.Usuario;
import com.detalhePrata.BackEnd.repositories.UsuarioRepository;
import com.detalhePrata.BackEnd.utils.ValidadorCNPJ;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    // --- UTILITÁRIOS ---
    private String limparFormatacao(String valor) {
        if (valor == null || valor.trim().isEmpty()) return null;
        return valor.replaceAll("\\D", "");
    }

    private boolean isValido(String valor) {
        return valor != null && !valor.trim().isEmpty();
    }

    // Método auxiliar para atualizar endereço campo a campo (PATCH)
    private void atualizarDadosEndereco(Endereco alvo, Endereco novo) {
        if (novo == null) return;

        if (isValido(novo.getRua())) alvo.setRua(novo.getRua());
        if (isValido(novo.getNumero())) alvo.setNumero(novo.getNumero());
        if (isValido(novo.getComplemento())) alvo.setComplemento(novo.getComplemento());
        if (isValido(novo.getBairro())) alvo.setBairro(novo.getBairro());
        if (isValido(novo.getCidade())) alvo.setCidade(novo.getCidade());
        if (isValido(novo.getEstado())) alvo.setEstado(novo.getEstado());
        if (isValido(novo.getPontoReferencia())) alvo.setPontoReferencia(novo.getPontoReferencia());

        if (isValido(novo.getCep())) {
            alvo.setCep(limparFormatacao(novo.getCep()));
        }
    }

    // Sobrecarga para DTO (usado no cadastro)
    private void atualizarDadosEndereco(Endereco alvo, com.detalhePrata.BackEnd.dtos.EnderecoDTO novo) {
        if (novo == null) return;
        alvo.setRua(novo.getRua());
        alvo.setNumero(novo.getNumero());
        alvo.setComplemento(novo.getComplemento());
        alvo.setBairro(novo.getBairro());
        alvo.setCidade(novo.getCidade());
        alvo.setEstado(novo.getEstado());
        if (novo.getCep() != null) alvo.setCep(limparFormatacao(novo.getCep()));
        alvo.setPontoReferencia(novo.getPontoReferencia());
    }

    // --- CADASTROS (CORRIGIDOS) ---

    @Transactional
    public PessoaFisica salvarPessoaFisica(PessoaFisicaDTO dto) {
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Já existe um usuário cadastrado com este email");
        }
        PessoaFisica pf = new PessoaFisica();
        pf.setEmail(dto.getEmail());
        pf.setSenha(passwordEncoder.encode(dto.getSenha()));
        pf.setTelefone(limparFormatacao(dto.getTelefone()));
        pf.setRole("USER");
        pf.setAtivo(true);
        pf.setNome(dto.getNome());
        pf.setSobrenome(dto.getSobrenome());
        pf.setCpf(limparFormatacao(dto.getCpf()));
        pf.setDataNascimento(LocalDate.parse(dto.getDataNascimento()));
        pf.setPreferenciaContato(dto.getPreferenciaContato());

        Endereco end = new Endereco();
        atualizarDadosEndereco(end, dto.getEndereco());
        
        // --- CORREÇÃO AQUI: Vínculo Bidirecional ---
        end.setUsuario(pf); // O endereço precisa saber quem é o dono
        pf.setEndereco(end);
        // -------------------------------------------

        PessoaFisica salvo = usuarioRepository.save(pf);
        try { emailService.enviarEmailBoasVindas(salvo.getEmail(), salvo.getNome()); } catch (Exception ignored) {}
        return salvo;
    }

    @Transactional
    public PessoaJuridica salvarPessoaJuridica(PessoaJuridicaDTO dto) {
        // Valida CNPJ
        if (!ValidadorCNPJ.isValido(dto.getCnpj())) {
            throw new RuntimeException(ValidadorCNPJ.obterMensagemErro(dto.getCnpj()));
        }

        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Já existe um usuário cadastrado com este email");
        }

        // Verifica se CNPJ já está cadastrado
        String cnpjLimpo = ValidadorCNPJ.limpar(dto.getCnpj());
        boolean cnpjExiste = usuarioRepository.findAll().stream()
                .filter(u -> u instanceof PessoaJuridica)
                .map(u -> (PessoaJuridica) u)
                .anyMatch(pj -> cnpjLimpo.equals(pj.getCnpj()));
        
        if (cnpjExiste) {
            throw new RuntimeException("O CNPJ informado já está cadastrado");
        }

        PessoaJuridica pj = new PessoaJuridica();
        pj.setEmail(dto.getEmail());
        pj.setSenha(passwordEncoder.encode(dto.getSenha()));
        pj.setTelefone(limparFormatacao(dto.getTelefone()));
        pj.setRole("USER");
        pj.setAtivo(true);
        pj.setCnpj(cnpjLimpo);
        pj.setInscricaoEstadual(dto.getInscricaoEstadual());
        pj.setNomeFantasia(dto.getNomeFantasia());
        pj.setRazaoSocial(dto.getRazaoSocial());
        pj.setNomeResponsavel(dto.getNomeResponsavel());
        pj.setSobrenomeResponsavel(dto.getSobrenomeResponsavel());
        pj.setComoNosConheceu(dto.getComoNosConheceu());

        Endereco emp = new Endereco();
        atualizarDadosEndereco(emp, dto.getEnderecoEmpresa());
        emp.setUsuario(pj); 
        pj.setEnderecoEmpresa(emp);

        Endereco ent = new Endereco();
        atualizarDadosEndereco(ent, dto.getEnderecoEntrega());
        ent.setUsuario(pj);
        pj.setEnderecoEntrega(ent);

        PessoaJuridica salvo = usuarioRepository.save(pj);
        try { emailService.enviarEmailBoasVindas(salvo.getEmail(), salvo.getNomeFantasia()); } catch (Exception ignored) {}
        return salvo;
    }

    // --- ATUALIZAÇÃO DE PESSOA FÍSICA ---

    @Transactional
    public Usuario atualizarPessoaFisica(PessoaFisica usuarioLogado, PessoaFisica dadosAtualizados) {
        PessoaFisica usuarioBanco = (PessoaFisica) usuarioRepository.findById(usuarioLogado.getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (isValido(dadosAtualizados.getNome())) usuarioBanco.setNome(dadosAtualizados.getNome());
        if (isValido(dadosAtualizados.getSobrenome())) usuarioBanco.setSobrenome(dadosAtualizados.getSobrenome());
        if (isValido(dadosAtualizados.getTelefone())) usuarioBanco.setTelefone(limparFormatacao(dadosAtualizados.getTelefone()));
        if (dadosAtualizados.getDataNascimento() != null) usuarioBanco.setDataNascimento(dadosAtualizados.getDataNascimento());
        if (dadosAtualizados.getPreferenciaContato() != null) usuarioBanco.setPreferenciaContato(dadosAtualizados.getPreferenciaContato());

        // Atualização de Endereço com segurança
        if (dadosAtualizados.getEndereco() != null) {
            if (usuarioBanco.getEndereco() == null) {
                Endereco novoEnd = new Endereco();
                novoEnd.setUsuario(usuarioBanco); // Garante vínculo se for novo
                usuarioBanco.setEndereco(novoEnd);
            }
            atualizarDadosEndereco(usuarioBanco.getEndereco(), dadosAtualizados.getEndereco());
        }

        return usuarioRepository.save(usuarioBanco);
    }

    // --- ATUALIZAÇÃO DE PESSOA JURÍDICA ---

    @Transactional
    public Usuario atualizarPessoaJuridica(PessoaJuridica usuarioLogado, PessoaJuridica dadosAtualizados) {
        PessoaJuridica usuarioBanco = (PessoaJuridica) usuarioRepository.findById(usuarioLogado.getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (isValido(dadosAtualizados.getNomeFantasia())) usuarioBanco.setNomeFantasia(dadosAtualizados.getNomeFantasia());
        if (isValido(dadosAtualizados.getRazaoSocial())) usuarioBanco.setRazaoSocial(dadosAtualizados.getRazaoSocial());
        if (isValido(dadosAtualizados.getTelefone())) usuarioBanco.setTelefone(limparFormatacao(dadosAtualizados.getTelefone()));
        if (isValido(dadosAtualizados.getInscricaoEstadual())) usuarioBanco.setInscricaoEstadual(dadosAtualizados.getInscricaoEstadual());
        if (isValido(dadosAtualizados.getNomeResponsavel())) usuarioBanco.setNomeResponsavel(dadosAtualizados.getNomeResponsavel());
        if (isValido(dadosAtualizados.getSobrenomeResponsavel())) usuarioBanco.setSobrenomeResponsavel(dadosAtualizados.getSobrenomeResponsavel());
        if (isValido(dadosAtualizados.getComoNosConheceu())) usuarioBanco.setComoNosConheceu(dadosAtualizados.getComoNosConheceu());

        if (dadosAtualizados.getEnderecoEmpresa() != null) {
            if (usuarioBanco.getEnderecoEmpresa() == null) {
                Endereco novo = new Endereco();
                novo.setUsuario(usuarioBanco);
                usuarioBanco.setEnderecoEmpresa(novo);
            }
            atualizarDadosEndereco(usuarioBanco.getEnderecoEmpresa(), dadosAtualizados.getEnderecoEmpresa());
        }

        if (dadosAtualizados.getEnderecoEntrega() != null) {
            if (usuarioBanco.getEnderecoEntrega() == null) {
                Endereco novo = new Endereco();
                novo.setUsuario(usuarioBanco);
                usuarioBanco.setEnderecoEntrega(novo);
            }
            atualizarDadosEndereco(usuarioBanco.getEnderecoEntrega(), dadosAtualizados.getEnderecoEntrega());
        }

        return usuarioRepository.save(usuarioBanco);
    }

    /**
     * Verifica se um CNPJ já existe no banco de dados
     * @param cnpjLimpo CNPJ sem formatação (apenas dígitos)
     * @return true se o CNPJ já está cadastrado, false caso contrário
     */
    public boolean cnpjJaExiste(String cnpjLimpo) {
        return usuarioRepository.findAll().stream()
                .filter(u -> u instanceof PessoaJuridica)
                .map(u -> (PessoaJuridica) u)
                .anyMatch(pj -> cnpjLimpo.equals(pj.getCnpj()));
    }

    // --- RESTO MANTIDO IGUAL ---
    public Optional<Usuario> buscarPorEmail(String email) { return usuarioRepository.findByEmail(email); }
    public Optional<Usuario> buscarPorId(Long id) { return usuarioRepository.findById(id); }
    public boolean existePorEmail(String email) { return usuarioRepository.existsByEmail(email); }
    public List<Usuario> listarTodos() { return usuarioRepository.findAll(); }
    public List<Usuario> listarAtivos() { return usuarioRepository.findByAtivoTrue(); }
    public List<Usuario> listarPorRole(String role) { return usuarioRepository.findByRole(role); }
    @Transactional
    public boolean atualizarSenha(Long usuarioId, String senhaAtual, String novaSenha) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        if (!passwordEncoder.matches(senhaAtual, usuario.getSenha())) throw new RuntimeException("Senha incorreta");
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);
        return true;
    }

    @Transactional
    public boolean setSenha(Long usuarioId,  String novaSenha) {    //TODO: REMOVER ISSO AQUI ASSIM Q N PRECISAR MAIS
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);
        return true;
    }
    @Transactional
    public void gerarTokenResetSenha(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("E-mail não encontrado"));
        if (!usuario.isAtivo()) throw new RuntimeException("Usuário inativo");
        usuario.setTokenResetSenha(UUID.randomUUID().toString());
        usuario.setTokenResetSenhaExpiracao(LocalDateTime.now().plusMinutes(30));
        usuarioRepository.save(usuario);
        try { emailService.sendPasswordResetEmail(usuario.getEmail(), usuario.getTokenResetSenha()); }
        catch (Exception e) { throw new RuntimeException("Erro ao enviar email"); }
    }
    @Transactional
    public boolean resetarSenha(String token, String novaSenha) {
        Usuario u = usuarioRepository.findByTokenResetSenha(token).orElseThrow(() -> new RuntimeException("Token inválido"));
        if (u.getTokenResetSenhaExpiracao().isBefore(LocalDateTime.now())) throw new RuntimeException("Token expirado");
        u.setSenha(passwordEncoder.encode(novaSenha));
        u.setTokenResetSenha(null);
        u.setTokenResetSenhaExpiracao(null);
        usuarioRepository.save(u);
        return true;
    }
    @Transactional
    public void ativarUsuario(Long id) { usuarioRepository.findById(id).ifPresent(u -> { u.ativar(); usuarioRepository.save(u); }); }
    @Transactional
    public void desativarUsuario(Long id) { usuarioRepository.findById(id).ifPresent(u -> { u.desativar(); usuarioRepository.save(u); }); }
    public boolean validarCredenciais(String email, String senha) {
        Optional<Usuario> opt = usuarioRepository.findByEmail(email);
        return opt.isPresent() && passwordEncoder.matches(senha, opt.get().getSenha()) && opt.get().isAtivo();
    }
    @Transactional
    public Usuario promoverParaAdmin(Long id) {
        Usuario u = usuarioRepository.findById(id).orElseThrow();
        u.setRole("ADMIN");
        return usuarioRepository.save(u);
    }
    @Transactional
    public Usuario rebaixarParaUser(Long id) {
        Usuario u = usuarioRepository.findById(id).orElseThrow();
        u.setRole("USER");
        return usuarioRepository.save(u);
    }
    public Long contarUsuariosAtivos() { return usuarioRepository.countUsuariosAtivos(); }
    public List<Usuario> listarAdministradores() { return usuarioRepository.findAdministradores(); }
}