package com.detalhePrata.BackEnd.services;

import com.detalhePrata.BackEnd.dtos.*;
import com.detalhePrata.BackEnd.models.Cupom;
import com.detalhePrata.BackEnd.models.CupomUso;
import com.detalhePrata.BackEnd.models.Usuario;
import com.detalhePrata.BackEnd.models.enums.TipoDesconto;
import com.detalhePrata.BackEnd.repositories.CupomRepository;
import com.detalhePrata.BackEnd.repositories.CupomUsoRepository;
import com.detalhePrata.BackEnd.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
public class CupomService {

    @Autowired
    private CupomRepository cupomRepository;

    @Autowired
    private CupomUsoRepository cupomUsoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Cupom> listarTodos() {
        return cupomRepository.findAll();
    }

    public List<Cupom> listarAtivos() {
        return cupomRepository.findByAtivoTrue();
    }

    public Optional<Cupom> buscarPorId(Long id) {
        return cupomRepository.findById(id);
    }

    public Optional<Cupom> buscarPorCodigo(String codigo) {
        return cupomRepository.findByCodigo(codigo.toUpperCase());
    }

    public Optional<Cupom> buscarAtivoPorCodigo(String codigo) {
        return cupomRepository.findByCodigoAndAtivoTrue(codigo.toUpperCase());
    }

    @Transactional
    public Cupom criar(CupomRequestDTO cupomDTO) {
        if (cupomRepository.existsByCodigo(cupomDTO.getCodigo().toUpperCase())) {
            throw new RuntimeException("Já existe um cupom com este código");
        }

        Cupom cupom = new Cupom();
        cupom.setCodigo(cupomDTO.getCodigo().toUpperCase());
        cupom.setTipoDesconto(cupomDTO.getTipoDesconto());
        cupom.setValor(cupomDTO.getValor());
        cupom.setValorMinimoPedido(cupomDTO.getValorMinimoPedido());
        cupom.setQuantidadeUsos(cupomDTO.getQuantidadeUsos());
        // Na criação, usos restantes = total
        cupom.setUsosRestantes(cupomDTO.getQuantidadeUsos());
        cupom.setAtivo(cupomDTO.getAtivo());
        cupom.setTipoCNPJ(cupomDTO.getTipoCNPJ());

        return cupomRepository.save(cupom);
    }

    @Transactional
    public Cupom atualizar(Long id, CupomRequestDTO cupomDTO) {
        Cupom cupom = cupomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cupom não encontrado"));

        if (!cupom.getCodigo().equals(cupomDTO.getCodigo().toUpperCase()) &&
            cupomRepository.existsByCodigoAndIdNot(cupomDTO.getCodigo().toUpperCase(), id)) {
            throw new RuntimeException("Já existe um cupom com este código");
        }

        int quantidadeAntiga = cupom.getQuantidadeUsos();
        int novaQuantidade = cupomDTO.getQuantidadeUsos();

        if (quantidadeAntiga != novaQuantidade) {
            int diferenca = novaQuantidade - quantidadeAntiga;
            int novosRestantes = cupom.getUsosRestantes() + diferenca;
            cupom.setUsosRestantes(Math.max(0, novosRestantes));
        }

        cupom.setQuantidadeUsos(novaQuantidade);
        cupom.setCodigo(cupomDTO.getCodigo().toUpperCase());
        cupom.setTipoDesconto(cupomDTO.getTipoDesconto());
        cupom.setValor(cupomDTO.getValor());
        cupom.setValorMinimoPedido(cupomDTO.getValorMinimoPedido());
        cupom.setAtivo(cupomDTO.getAtivo());
        cupom.setTipoCNPJ(cupomDTO.getTipoCNPJ());

        return cupomRepository.save(cupom);
    }

    @Transactional
    public void deletar(Long id) {
        Cupom cupom = cupomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cupom não encontrado"));
        cupomRepository.delete(cupom);
    }

    @Transactional
    public Cupom alternarStatus(Long id) {
        Cupom cupom = cupomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cupom não encontrado"));
        cupom.setAtivo(!cupom.getAtivo());
        return cupomRepository.save(cupom);
    }

    public ValidacaoCupomResponseDTO validarCupom(ValidacaoCupomRequestDTO validacaoDTO) {
        try {
            Cupom cupom = buscarAtivoPorCodigo(validacaoDTO.getCodigo())
                    .orElseThrow(() -> new RuntimeException("Cupom não encontrado ou inativo"));

            if (cupom.getUsosRestantes() <= 0) {
                return new ValidacaoCupomResponseDTO(false, "Cupom esgotado");
            }

            if (validacaoDTO.getValorPedido().compareTo(cupom.getValorMinimoPedido()) < 0) {
                return new ValidacaoCupomResponseDTO(false,
                    String.format("Valor mínimo do pedido: R$ %.2f", cupom.getValorMinimoPedido()));
            }

            // Verifica se usuário já usou (Usando seu método existsByCupomIdAndUsuarioId)
            if (validacaoDTO.getUsuarioId() != null) {
                boolean jaUsou = cupomUsoRepository.existsByCupomIdAndUsuarioId(cupom.getId(), validacaoDTO.getUsuarioId());
                if (jaUsou) {
                    // Descomente se quiser proibir uso repetido:
                    // return new ValidacaoCupomResponseDTO(false, "Você já utilizou este cupom.");
                }
            }

            BigDecimal desconto = calcularDesconto(cupom, validacaoDTO.getValorPedido());
            return new ValidacaoCupomResponseDTO(true, cupom, desconto);

        } catch (RuntimeException e) {
            return new ValidacaoCupomResponseDTO(false, e.getMessage());
        }
    }

    @Transactional
    public void usarCupom(String codigo) {
        // Mantido para compatibilidade reversa
        Cupom cupom = buscarAtivoPorCodigo(codigo)
                .orElseThrow(() -> new RuntimeException("Cupom não encontrado"));

        if (cupom.getUsosRestantes() <= 0) {
            throw new RuntimeException("Cupom esgotado");
        }

        cupom.setUsosRestantes(cupom.getUsosRestantes() - 1);
        cupomRepository.save(cupom);
    }

    // --- MÉTODO PRINCIPAL DE USO NO PEDIDO ---
    @Transactional
    public void registrarUso(String codigo, Long usuarioId) {
        Cupom cupom = buscarAtivoPorCodigo(codigo)
                .orElseThrow(() -> new RuntimeException("Cupom não encontrado"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (cupom.getUsosRestantes() <= 0) {
            throw new RuntimeException("Cupom esgotado");
        }

        // 1. Decrementa do Cupom
        cupom.setUsosRestantes(cupom.getUsosRestantes() - 1);
        cupomRepository.save(cupom);

        // 2. Cria registro na tabela CupomUso
        CupomUso uso = new CupomUso(cupom, usuario);
        cupomUsoRepository.save(uso);
    }

    private BigDecimal calcularDesconto(Cupom cupom, BigDecimal valorPedido) {
        if (cupom.getTipoDesconto() == TipoDesconto.PORCENTAGEM) {
            return valorPedido.multiply(cupom.getValor())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else {
            return cupom.getValor();
        }
    }
}