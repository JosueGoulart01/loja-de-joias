package com.detalhePrata.BackEnd.services;

import com.detalhePrata.BackEnd.dtos.CarrinhoResponseDTO;
import com.detalhePrata.BackEnd.dtos.ItemCarrinhoResponseDTO;
import com.detalhePrata.BackEnd.dtos.PedidoDTO;
import com.detalhePrata.BackEnd.dtos.PedidoResponseDTO;
import com.detalhePrata.BackEnd.dtos.ValidacaoCupomRequestDTO;
import com.detalhePrata.BackEnd.models.*;
import com.detalhePrata.BackEnd.models.enums.TipoMovimentacao;
import com.detalhePrata.BackEnd.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PedidoService {

    @Autowired private PedidoRepository pedidoRepository;
    @Autowired private ItemPedidoRepository itemPedidoRepository;
    @Autowired private HistoricoPedidoRepository historicoPedidoRepository;
    @Autowired private ProdutoRepository produtoRepository;
    @Autowired private VarianteProdutoRepository varianteRepository;

    @Autowired private CarrinhoService carrinhoService;
    @Autowired private CupomService cupomService;
    @Autowired private UsuarioService usuarioService;
    @Autowired private EstoqueService estoqueService;
    
    // --- ALTERAÇÃO AQUI: Novo Repository ---
    @Autowired private EnderecoRepository enderecoRepository; 

    // --- MÉTODOS DTO ---
    
    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> getAllAsDTO() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        pedidos.forEach(p -> {
            if(p.getItens() != null) p.getItens().size();
        });
        return pedidos.stream()
                .map(PedidoResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> getByUsuarioAsDTO(Long usuarioId) {
        List<Pedido> pedidos = pedidoRepository.findByUsuarioId(usuarioId);
        pedidos.forEach(p -> {
            if(p.getItens() != null) p.getItens().size();
        });
        return pedidos.stream()
                .map(PedidoResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PedidoResponseDTO getByIdAsDTO(Long id, Usuario usuarioLogado) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        
        if (!usuarioLogado.isAdmin() && !pedido.getUsuarioId().equals(usuarioLogado.getId())) {
            throw new RuntimeException("Acesso negado.");
        }
        
        if(pedido.getItens() != null) pedido.getItens().size();
        
        return PedidoResponseDTO.fromEntity(pedido);
    }

    public Pedido getById(Long id) {
        return pedidoRepository.findById(id).orElse(null);
    }

    // --- MÉTODOS DE NEGÓCIO ---

    @Transactional
    public Pedido create(PedidoDTO dto) {
        CarrinhoResponseDTO carrinho = carrinhoService.obterCarrinhoPorId(dto.listaId());

        if (carrinho == null || carrinho.getItens().isEmpty()) {
            throw new RuntimeException("Carrinho vazio ou não encontrado.");
        }

        if (Boolean.TRUE.equals(carrinho.getFinalizado())) {
            throw new RuntimeException("Este carrinho já foi finalizado.");
        }

        // --- ALTERAÇÃO AQUI: Lógica de Endereço ---
        if (dto.enderecoId() == null) {
            throw new RuntimeException("É obrigatório informar o endereço de entrega.");
        }

        Endereco endereco = enderecoRepository.findById(dto.enderecoId())
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado ID: " + dto.enderecoId()));

        if (!endereco.getUsuario().getId().equals(dto.usuarioId())) {
            throw new RuntimeException("Endereço inválido para este usuário.");
        }
        // ------------------------------------------

        Pedido pedido = new Pedido();
        pedido.setUsuarioId(dto.usuarioId());
        pedido.setEnderecoEntrega(endereco); // Seta o endereço
        pedido.setCarrinhoOrigemId(dto.listaId());
        pedido.setStatus("Aguardando pagamento");
        pedido.setMetodoPagamento(dto.metodoPagamento());
        pedido.setCodigoPagamento(dto.codigoPagamento());
        
        pedido.setFrete(dto.frete() != null ? dto.frete() : BigDecimal.ZERO);
        pedido.setSubtotal(BigDecimal.ZERO);
        pedido.setValor(BigDecimal.ZERO);
        pedido.setValorDesconto(BigDecimal.ZERO);

        Pedido pedidoSalvo = pedidoRepository.save(pedido);

        BigDecimal subtotalCalculado = BigDecimal.ZERO;
        List<ItemPedido> itensParaSalvar = new ArrayList<>();

        for (ItemCarrinhoResponseDTO itemDTO : carrinho.getItens()) {
            Produto produto = produtoRepository.findById(itemDTO.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado ID: " + itemDTO.getProdutoId()));

            VarianteProduto variante = null;
            if (itemDTO.getVarianteId() != null) {
                variante = varianteRepository.findById(itemDTO.getVarianteId()).orElse(null);
            }

            ItemPedido itemPedido = new ItemPedido(
                    produto,
                    variante,
                    itemDTO.getQuantidade(),
                    itemDTO.getPrecoUnitario()
            );
            itemPedido.setPedido(pedidoSalvo);
            itensParaSalvar.add(itemPedido);

            subtotalCalculado = subtotalCalculado.add(itemPedido.getSubtotal());

            if (variante != null) {
                estoqueService.registrarMovimentacao(
                        variante.getId(),
                        itemDTO.getQuantidade(),
                        TipoMovimentacao.SAIDA,
                        "Venda Simulada - Pedido #" + pedidoSalvo.getId()
                );
            }

            produto.incrementarVendas(itemDTO.getQuantidade());
            produtoRepository.save(produto);
        }

        itemPedidoRepository.saveAll(itensParaSalvar);
        
        pedidoSalvo.setItens(itensParaSalvar);
        pedidoSalvo.setSubtotal(subtotalCalculado);

        BigDecimal valorDesconto = BigDecimal.ZERO;
        if (dto.cupomCodigo() != null && !dto.cupomCodigo().isEmpty()) {
            var validacao = cupomService.validarCupom(new ValidacaoCupomRequestDTO(dto.cupomCodigo(), subtotalCalculado, dto.usuarioId()));

            if (validacao.isValido()) {
                Cupom cupom = cupomService.buscarAtivoPorCodigo(dto.cupomCodigo()).orElse(null);
                if (cupom != null && Boolean.TRUE.equals(cupom.getTipoCNPJ())) {
                    Usuario usuario = usuarioService.buscarPorId(dto.usuarioId()).orElseThrow();
                    if (!(usuario instanceof PessoaJuridica)) {
                        throw new RuntimeException("Cupom exclusivo para clientes com CNPJ.");
                    }
                }

                valorDesconto = validacao.getValorDesconto();
                pedidoSalvo.setCupomCodigo(dto.cupomCodigo());
                pedidoSalvo.setValorDesconto(valorDesconto);
                cupomService.registrarUso(dto.cupomCodigo(), dto.usuarioId());
            }
        }

        BigDecimal total = subtotalCalculado.subtract(valorDesconto).add(pedidoSalvo.getFrete());
        pedidoSalvo.setValor(total.max(BigDecimal.ZERO));

        Pedido finalPedido = pedidoRepository.save(pedidoSalvo);
        
        finalPedido.setItens(itensParaSalvar);
        
        createHistorico(finalPedido.getId(), finalPedido.getStatus());
        carrinhoService.limparCarrinho(carrinho.getSessaoId());

        return finalPedido;
    }

    public Pedido save(Pedido pedido) { return pedidoRepository.save(pedido); }
    
    public boolean setStatus(Pedido pedido, String status) {
        if(status.equals(pedido.getStatus())) return false;
        pedido.setStatus(status);
        createHistorico(pedido.getId(), status);
        return true;
    }

    @Transactional
    public Pedido atualizarRastreio(Long pedidoId, String codigoRastreio, String urlNotaFiscal) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        pedido.setCodigoRastreio(codigoRastreio);
        pedido.setUrlNotaFiscal(urlNotaFiscal);
        
        if (!"ENVIADO".equalsIgnoreCase(pedido.getStatus()) && !"ENTREGUE".equalsIgnoreCase(pedido.getStatus())) {
            setStatus(pedido, "ENVIADO");
        } else {
            pedidoRepository.save(pedido);
        }
        return pedido;
    }

    public List<HistoricoPedido> getHistorico(Long id) {
        return historicoPedidoRepository.findAll().stream()
                .filter(h -> h.getPedidoId().equals(id))
                .toList();
    }

    private void createHistorico(Long id, String status) {
        HistoricoPedido historico = new HistoricoPedido();
        historico.setPedidoId(id);
        historico.setStatus(status);
        historicoPedidoRepository.save(historico);
    }
}