package com.detalhePrata.BackEnd.services;

import com.detalhePrata.BackEnd.dtos.CarrinhoResponseDTO;
import com.detalhePrata.BackEnd.dtos.ValidacaoCupomResponseDTO;
import com.detalhePrata.BackEnd.dtos.ItemCarrinhoRequestDTO;
import com.detalhePrata.BackEnd.dtos.ItemCarrinhoResponseDTO;
import com.detalhePrata.BackEnd.dtos.ValidacaoCupomRequestDTO;
import com.detalhePrata.BackEnd.models.*;
import com.detalhePrata.BackEnd.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarrinhoService {

    private static final Logger logger = LoggerFactory.getLogger(CarrinhoService.class);

    @Autowired
    private CarrinhoRepository carrinhoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private VarianteProdutoRepository varianteProdutoRepository;

    @Autowired
    private CupomRepository cupomRepository;

    @Autowired
    private CupomService cupomService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public CarrinhoResponseDTO obterCarrinhoPorSessao(String sessaoId) {
        Carrinho carrinho = carrinhoRepository.findBySessaoId(sessaoId)
                .orElseGet(() -> criarNovoCarrinho(sessaoId));
        return converterParaDTO(carrinho);
    }

    @Transactional
    public CarrinhoResponseDTO adicionarItem(String sessaoId, ItemCarrinhoRequestDTO itemRequest) {
        Carrinho carrinho = carrinhoRepository.findBySessaoId(sessaoId)
                .orElseGet(() -> criarNovoCarrinho(sessaoId));

        if (itemRequest.getProdutoId() == null) {
            throw new RuntimeException("ID do produto é obrigatório");
        }

        Produto produto = produtoRepository.findById(itemRequest.getProdutoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        if (!produto.getAtivo()) {
            throw new RuntimeException("Produto não está disponível");
        }

        if (Boolean.TRUE.equals(carrinho.getFinalizado())) {
            throw new RuntimeException("Não é possível adicionar itens a um carrinho finalizado");
        }

        // --- CORREÇÃO CRÍTICA DO ESTOQUE ---
        // Se não foi informada variante, tentamos pegar a variante padrão (a primeira da lista)
        // Isso impede que um item entre no carrinho "solto", sem estar atrelado ao estoque real.
        VarianteProduto variante = null;

        if (itemRequest.getVarianteId() != null) {
            variante = varianteProdutoRepository.findById(itemRequest.getVarianteId())
                    .orElseThrow(() -> new RuntimeException("Variante não encontrada"));
        } else {
            // Se o produto tem variantes cadastradas, USA A PRIMEIRA como padrão
            if (produto.getVariantes() != null && !produto.getVariantes().isEmpty()) {
                variante = produto.getVariantes().get(0);
            } else {
                // Se chegou aqui, o produto existe mas não tem NENHUMA variante (erro de cadastro no Admin)
                throw new RuntimeException("Este produto está sem configuração de estoque (Variantes). Contate o admin.");
            }
        }

        // Validações de consistência
        if (!variante.getProduto().getId().equals(produto.getId())) {
            throw new RuntimeException("A variante informada não pertence ao produto selecionado.");
        }

        int quantidadeSolicitada = itemRequest.getQuantidade() != null ? itemRequest.getQuantidade() : 1;

        // Validação de Estoque Real
        if (variante.getEstoque() < quantidadeSolicitada) {
            throw new RuntimeException("Estoque insuficiente. Disponível: " + variante.getEstoque());
        }

        // Verifica se já existe no carrinho (agora sempre comparamos variante com variante)
        ItemCarrinho itemExistente = carrinho.encontrarItemPorProdutoEVariante(
                produto.getId(),
                variante.getId() // Agora garantimos que nunca é null
        );

        if (itemExistente != null) {
            int novaQuantidade = itemExistente.getQuantidade() + quantidadeSolicitada;
            if (variante.getEstoque() < novaQuantidade) {
                throw new RuntimeException("Estoque insuficiente para a quantidade total. Disponível: " + variante.getEstoque());
            }
            itemExistente.setQuantidade(novaQuantidade);
        } else {
            ItemCarrinho novoItem = new ItemCarrinho();
            novoItem.setProduto(produto);
            novoItem.setVariante(variante); // SEMPRE SETADO
            novoItem.setQuantidade(quantidadeSolicitada);
            novoItem.setPrecoUnitario(calcularPrecoUnitario(produto, variante));
            novoItem.setPrecoOriginalUnitario(produto.getPrecoOriginal());

            carrinho.adicionarItem(novoItem);
        }

        carrinho = carrinhoRepository.save(carrinho);
        return converterParaDTO(carrinho);
    }

    @Transactional
    public CarrinhoResponseDTO atualizarQuantidade(String sessaoId, Long produtoId, Long varianteId, Integer quantidade) {
        if (quantidade == null || quantidade < 0) {
            throw new RuntimeException("Quantidade inválida");
        }

        Carrinho carrinho = carrinhoRepository.findBySessaoId(sessaoId)
                .orElseThrow(() -> new RuntimeException("Carrinho não encontrado"));

        if (Boolean.TRUE.equals(carrinho.getFinalizado())) {
            throw new RuntimeException("Não é possível alterar um carrinho finalizado");
        }

        // Busca o item. Se varianteId vier nulo, precisamos ser espertos,
        // mas idealmente o front deve mandar o ID da variante que retornamos no GET carrinho.
        ItemCarrinho item = null;
        if (varianteId != null) {
            item = carrinho.encontrarItemPorProdutoEVariante(produtoId, varianteId);
        } else {
            // Fallback perigoso, mas tenta achar qualquer item desse produto
            item = carrinho.getItens().stream()
                    .filter(i -> i.getProduto().getId().equals(produtoId))
                    .findFirst()
                    .orElse(null);
        }

        if (item == null) {
            throw new RuntimeException("Item não encontrado no carrinho");
        }

        // Validação de estoque na atualização
        if (quantidade > item.getQuantidade()) {
            int diferenca = quantidade - item.getQuantidade();
            // Como garantimos variante no "adicionarItem", aqui é seguro
            if (item.getVariante().getEstoque() < diferenca) {
                throw new RuntimeException("Estoque insuficiente. Máximo disponível: " + item.getVariante().getEstoque());
            }
        }

        if (quantidade == 0) {
            carrinho.removerItem(item);
        } else {
            item.setQuantidade(quantidade);
        }

        carrinho = carrinhoRepository.save(carrinho);
        return converterParaDTO(carrinho);
    }

    @Transactional
    public CarrinhoResponseDTO removerItem(String sessaoId, Long produtoId, Long varianteId) {
        Carrinho carrinho = carrinhoRepository.findBySessaoId(sessaoId)
                .orElseThrow(() -> new RuntimeException("Carrinho não encontrado"));

        if (Boolean.TRUE.equals(carrinho.getFinalizado())) {
            throw new RuntimeException("Não é possível alterar um carrinho finalizado");
        }

        ItemCarrinho item = carrinho.encontrarItemPorProdutoEVariante(produtoId, varianteId);
        if (item != null) {
            carrinho.removerItem(item);
        }

        carrinho = carrinhoRepository.save(carrinho);
        return converterParaDTO(carrinho);
    }

    @Transactional
    public CarrinhoResponseDTO aplicarCupom(String sessaoId, String codigoCupom) {
        if (codigoCupom == null || codigoCupom.trim().isEmpty()) {
            throw new RuntimeException("Código do cupom é obrigatório");
        }

        Carrinho carrinho = carrinhoRepository.findBySessaoId(sessaoId)
                .orElseThrow(() -> new RuntimeException("Carrinho não encontrado"));

        if (Boolean.TRUE.equals(carrinho.getFinalizado())) {
            throw new RuntimeException("Não é possível alterar um carrinho finalizado");
        }

        Long usuarioId = (carrinho.getUsuario() != null) ? carrinho.getUsuario().getId() : null;

        ValidacaoCupomRequestDTO validacaoRequest = new ValidacaoCupomRequestDTO();
        validacaoRequest.setCodigo(codigoCupom);
        validacaoRequest.setValorPedido(carrinho.getSubtotal());
        validacaoRequest.setUsuarioId(usuarioId);

        ValidacaoCupomResponseDTO validacao = cupomService.validarCupom(validacaoRequest);

        if (!validacao.isValido()) {
            throw new RuntimeException(validacao.getMensagem());
        }

        Cupom cupom = cupomRepository.findByCodigoAndAtivoTrue(codigoCupom.toUpperCase())
                .orElseThrow(() -> new RuntimeException("Cupom não encontrado"));

        carrinho.setCupom(cupom);
        carrinho.setValorDesconto(calcularValorDesconto(cupom, carrinho.getSubtotal()));

        carrinho = carrinhoRepository.save(carrinho);
        return converterParaDTO(carrinho);
    }

    @Transactional
    public CarrinhoResponseDTO removerCupom(String sessaoId) {
        Carrinho carrinho = carrinhoRepository.findBySessaoId(sessaoId)
                .orElseThrow(() -> new RuntimeException("Carrinho não encontrado"));

        if (Boolean.TRUE.equals(carrinho.getFinalizado())) {
            throw new RuntimeException("Não é possível alterar um carrinho finalizado");
        }

        carrinho.setCupom(null);
        carrinho.setValorDesconto(BigDecimal.ZERO);

        carrinho = carrinhoRepository.save(carrinho);
        return converterParaDTO(carrinho);
    }

    @Transactional
    public CarrinhoResponseDTO calcularFrete(String sessaoId, String cep) {
        if (cep == null || cep.trim().isEmpty()) {
            throw new RuntimeException("CEP é obrigatório");
        }

        Carrinho carrinho = carrinhoRepository.findBySessaoId(sessaoId)
                .orElseThrow(() -> new RuntimeException("Carrinho não encontrado"));

        if (Boolean.TRUE.equals(carrinho.getFinalizado())) {
            throw new RuntimeException("Não é possível alterar um carrinho finalizado");
        }

        BigDecimal valorFrete = simularCalculoFrete(cep, carrinho);
        carrinho.setCepFrete(cep);
        carrinho.setValorFrete(valorFrete);

        carrinho = carrinhoRepository.save(carrinho);
        return converterParaDTO(carrinho);
    }

    @Transactional
    public void limparCarrinho(String sessaoId) {
        Carrinho carrinho = carrinhoRepository.findBySessaoId(sessaoId)
                .orElseThrow(() -> new RuntimeException("Carrinho não encontrado"));

        if (Boolean.TRUE.equals(carrinho.getFinalizado())) {
            throw new RuntimeException("Não é possível limpar um carrinho finalizado");
        }

        carrinho.getItens().clear();
        carrinho.setCupom(null);
        carrinho.setValorDesconto(BigDecimal.ZERO);
        carrinho.setCepFrete(null);
        carrinho.setValorFrete(BigDecimal.ZERO);

        carrinhoRepository.save(carrinho);
    }

    @Transactional
    public CarrinhoResponseDTO finalizarCarrinho(String sessaoId, Long usuarioId) {
        Carrinho carrinho = carrinhoRepository.findBySessaoId(sessaoId)
                .orElseThrow(() -> new RuntimeException("Carrinho não encontrado"));

        if (Boolean.TRUE.equals(carrinho.getFinalizado())) {
            throw new RuntimeException("Carrinho já está finalizado");
        }

        if (carrinho.getItens() == null || carrinho.getItens().isEmpty()) {
            throw new RuntimeException("Não é possível finalizar um carrinho vazio");
        }

        if (usuarioId != null && carrinho.getUsuario() == null) {
            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            carrinho.setUsuario(usuario);
        }

        // Como garantimos variante no 'adicionarItem', aqui vai funcionar liso
        validarEstoqueItens(carrinho);
        atualizarEstoqueItens(carrinho);
        atualizarVendasProdutos(carrinho);

        carrinho.finalizar();
        carrinho = carrinhoRepository.save(carrinho);

        logger.info("🏁 CARRINHO FINALIZADO: Carrinho ID {} (SessaoID: {}) foi finalizado.",
                carrinho.getId(), carrinho.getSessaoId());

        return converterParaDTO(carrinho);
    }

    @Transactional(readOnly = true)
    public List<CarrinhoResponseDTO> obterCarrinhosFinalizados() {
        List<Carrinho> carrinhos = carrinhoRepository.findByFinalizadoTrue();
        return carrinhos.stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void mesclarCarrinhos(String sessaoIdAnonima, Usuario usuario) {
        var carrinhoAnonimoOpt = carrinhoRepository.findBySessaoId(sessaoIdAnonima);

        if (carrinhoAnonimoOpt.isEmpty()) return;

        Carrinho carrinhoAnonimo = carrinhoAnonimoOpt.get();

        if (carrinhoAnonimo.getUsuario() != null && carrinhoAnonimo.getUsuario().getId().equals(usuario.getId())) {
            return;
        }

        if (Boolean.TRUE.equals(carrinhoAnonimo.getFinalizado()) || carrinhoAnonimo.getItens().isEmpty()) {
            return;
        }

        Carrinho carrinhoUsuario = carrinhoRepository.findByUsuarioIdAndFinalizadoFalse(usuario.getId())
                .orElseGet(() -> {
                    Carrinho novo = new Carrinho();
                    novo.setUsuario(usuario);
                    novo.setSessaoId("USER_" + usuario.getId());
                    return carrinhoRepository.save(novo);
                });

        for (ItemCarrinho itemAnonimo : carrinhoAnonimo.getItens()) {
            ItemCarrinho novoItem = new ItemCarrinho();
            novoItem.setProduto(itemAnonimo.getProduto());
            novoItem.setVariante(itemAnonimo.getVariante());
            novoItem.setQuantidade(itemAnonimo.getQuantidade());
            novoItem.setPrecoUnitario(itemAnonimo.getPrecoUnitario());
            novoItem.setPrecoOriginalUnitario(itemAnonimo.getPrecoOriginalUnitario());

            carrinhoUsuario.adicionarItem(novoItem);
        }

        carrinhoRepository.save(carrinhoUsuario);
        carrinhoRepository.delete(carrinhoAnonimo);
    }

    // --- MÉTODOS PRIVADOS AUXILIARES ---

    private void validarEstoqueItens(Carrinho carrinho) {
        for (ItemCarrinho item : carrinho.getItens()) {
            // Check de segurança redobrada
            if (item.getVariante() == null) {
                throw new RuntimeException("Erro de sistema: Item no carrinho sem variante definida. Produto: " + item.getNomeProduto());
            }
            if (item.getVariante().getEstoque() < item.getQuantidade()) {
                throw new RuntimeException("Estoque insuficiente: " + item.getNomeProduto() +
                        " (" + item.getVariante().getTamanho() + "). Restam apenas: " + item.getVariante().getEstoque());
            }
        }
    }

    private void atualizarEstoqueItens(Carrinho carrinho) {
        for (ItemCarrinho item : carrinho.getItens()) {
            if (item.getVariante() != null) {
                VarianteProduto variante = item.getVariante();
                int novoEstoque = variante.getEstoque() - item.getQuantidade();
                // Garante que não fica negativo (embora a validação já tenha ocorrido)
                variante.setEstoque(Math.max(0, novoEstoque));
                varianteProdutoRepository.save(variante);
            }
        }
    }

    private void atualizarVendasProdutos(Carrinho carrinho) {
        for (ItemCarrinho item : carrinho.getItens()) {
            Produto produto = item.getProduto();
            produto.incrementarVendas(item.getQuantidade());
            produtoRepository.save(produto);
        }
    }

    private Carrinho criarNovoCarrinho(String sessaoId) {
        Carrinho carrinho = new Carrinho();
        carrinho.setSessaoId(sessaoId);
        carrinho.setFinalizado(false);
        return carrinhoRepository.save(carrinho);
    }

    private BigDecimal calcularPrecoUnitario(Produto produto, VarianteProduto variante) {
        if (produto == null) throw new RuntimeException("Produto nulo");
        BigDecimal preco = produto.getPrecoBase() != null ? produto.getPrecoBase() : BigDecimal.ZERO;
        if (variante != null && variante.getPrecoAdicional() != null) {
            preco = preco.add(variante.getPrecoAdicional());
        }
        return preco;
    }

    private BigDecimal calcularValorDesconto(Cupom cupom, BigDecimal subtotal) {
        if (cupom == null || subtotal == null) return BigDecimal.ZERO;
        if (cupom.getTipoDesconto().name().equals("PORCENTAGEM")) {
            return subtotal.multiply(cupom.getValor()).divide(BigDecimal.valueOf(100));
        } else {
            return cupom.getValor().min(subtotal);
        }
    }

    private BigDecimal simularCalculoFrete(String cep, Carrinho carrinho) {
        int qtd = carrinho.getQuantidadeTotal();
        return qtd <= 5 ? new BigDecimal("15.90") : new BigDecimal("25.90");
    }

    private CarrinhoResponseDTO converterParaDTO(Carrinho carrinho) {
        CarrinhoResponseDTO dto = new CarrinhoResponseDTO();
        List<ItemCarrinhoResponseDTO> itensDTO = carrinho.getItens().stream()
                .map(this::converterItemParaDTO).collect(Collectors.toList());

        dto.setId(carrinho.getId());
        dto.setSessaoId(carrinho.getSessaoId());
        dto.setItens(itensDTO);
        dto.setCupomCodigo(carrinho.getCupom() != null ? carrinho.getCupom().getCodigo() : null);
        dto.setDesconto(carrinho.getValorDesconto());
        dto.setCepFrete(carrinho.getCepFrete());
        dto.setValorFrete(carrinho.getValorFrete());
        dto.setSubtotal(carrinho.getSubtotal());
        dto.setTotal(carrinho.getTotal());
        dto.setQuantidadeTotal(carrinho.getQuantidadeTotal());
        dto.setFinalizado(carrinho.getFinalizado());
        dto.setDataCriacao(carrinho.getDataCriacao());
        dto.setDataAtualizacao(carrinho.getDataAtualizacao());
        return dto;
    }

    private ItemCarrinhoResponseDTO converterItemParaDTO(ItemCarrinho item) {
        ItemCarrinhoResponseDTO dto = new ItemCarrinhoResponseDTO();
        dto.setId(item.getId());
        dto.setProdutoId(item.getProduto().getId());
        dto.setNomeProduto(item.getNomeProduto());
        dto.setPrecoUnitario(item.getPrecoUnitario());
        dto.setPrecoOriginalUnitario(item.getPrecoOriginalUnitario());
        dto.setQuantidade(item.getQuantidade());
        dto.setTamanho(item.getTamanhoSelecionado());
        dto.setImagemUrl(item.getImagemProduto());
        dto.setSubtotal(item.getSubtotal());

        if (item.getVariante() != null) {
            dto.setVarianteId(item.getVariante().getId());
            dto.setCor(item.getVariante().getCor());
            dto.setTamanho(item.getVariante().getTamanho());
        }
        return dto;
    }

    public CarrinhoResponseDTO obterCarrinhoPorId(Long id) {
        var carrinhoOptional = carrinhoRepository.findById(id);
        if (carrinhoOptional.isEmpty()) return null;
        return converterParaDTO(carrinhoOptional.get());
    }
}