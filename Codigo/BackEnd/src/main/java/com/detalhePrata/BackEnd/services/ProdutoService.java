package com.detalhePrata.BackEnd.services;

import com.detalhePrata.BackEnd.dtos.ProdutoDTO;
import com.detalhePrata.BackEnd.dtos.VarianteProdutoDTO;
import com.detalhePrata.BackEnd.models.Categoria;
import com.detalhePrata.BackEnd.models.Produto;
import com.detalhePrata.BackEnd.models.VarianteProduto;
import com.detalhePrata.BackEnd.repositories.CategoriaRepository;
import com.detalhePrata.BackEnd.repositories.ProdutoRepository;
import com.detalhePrata.BackEnd.repositories.VarianteProdutoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private VarianteProdutoRepository varianteProdutoRepository;

    @Transactional
    public Produto salvarProduto(ProdutoDTO dto) {
        System.out.println("🔄 Iniciando salvamento do produto: " + dto.nome());

        if (dto.nome() == null || dto.nome().trim().isEmpty()) throw new RuntimeException("Nome do produto é obrigatório");
        if (dto.precoBase() == null) throw new RuntimeException("Preço base é obrigatório");
        if (dto.categoriaId() == null) throw new RuntimeException("Categoria é obrigatória");
        if (dto.code() == null || dto.code().trim().isEmpty()) throw new RuntimeException("Código do produto é obrigatório");

        try {
            Categoria categoria = categoriaRepository.findById(dto.categoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoria com ID " + dto.categoriaId() + " não encontrada."));

            Optional<Produto> produtoExistente = produtoRepository.findByCode(dto.code());
            if (produtoExistente.isPresent()) {
                throw new RuntimeException("Já existe um produto com o código: " + dto.code());
            }

            Produto produto = Produto.builder()
                    .nome(dto.nome())
                    .categoria(categoria)
                    .material(dto.material())
                    .code(dto.code())
                    .descricao(dto.descricao())
                    .precoBase(dto.precoBase())
                    .precoOriginal(dto.precoOriginal())
                    .ativo(dto.ativo() != null ? dto.ativo() : true)
                    .imagemPrincipal(dto.imagemPrincipal())
                    .imagens(dto.imagens() != null ? new ArrayList<>(dto.imagens()) : new ArrayList<>())
                    .details(dto.details() != null ? new ArrayList<>(dto.details()) : new ArrayList<>())
                    .variantes(new ArrayList<>())
                    .build();

            Produto produtoSalvo = produtoRepository.save(produto);

            if (dto.variantes() == null || dto.variantes().isEmpty()) {
                VarianteProduto variantePadrao = new VarianteProduto();
                variantePadrao.setProduto(produtoSalvo);
                variantePadrao.setTamanho("Único");
                variantePadrao.setCor("Padrão");
                variantePadrao.setEstoque(0);
                variantePadrao.setPrecoAdicional(BigDecimal.ZERO);
                variantePadrao.setImagemVariante(dto.imagemPrincipal());
                varianteProdutoRepository.save(variantePadrao);
                produtoSalvo.getVariantes().add(variantePadrao);
            } else {
                salvarVariantes(dto.variantes(), produtoSalvo);
            }

            return produtoSalvo;

        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar produto: " + e.getMessage());
        }
    }

    private void salvarVariantes(List<VarianteProdutoDTO> variantesDto, Produto produto) {
        if (variantesDto == null || variantesDto.isEmpty()) return;

        for (VarianteProdutoDTO varianteDto : variantesDto) {
            VarianteProduto variante = new VarianteProduto();
            variante.setProduto(produto);
            variante.setTamanho(varianteDto.tamanho() != null ? varianteDto.tamanho() : "Único");
            variante.setCor(varianteDto.cor() != null ? varianteDto.cor() : "Padrão");
            variante.setEstoque(varianteDto.estoque() != null ? varianteDto.estoque() : 0);
            variante.setPrecoAdicional(varianteDto.precoAdicional() != null ? varianteDto.precoAdicional() : BigDecimal.ZERO);
            variante.setImagemVariante(varianteDto.imagemVariante());

            VarianteProduto varianteSalva = varianteProdutoRepository.save(variante);
            produto.getVariantes().add(varianteSalva);
        }
        produtoRepository.save(produto);
    }

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    public List<Produto> listarAtivos() {
        return produtoRepository.findByAtivoTrue();
    }

    public Optional<Produto> buscarPorId(Long id) {
        return produtoRepository.findById(id);
    }

    @Transactional
    public Produto atualizarProduto(Long id, ProdutoDTO dto) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com id: " + id));

        Categoria categoria = categoriaRepository.findById(dto.categoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria com ID " + dto.categoriaId() + " não encontrada."));

        if (dto.code() != null && !dto.code().equals(produto.getCode())) {
            Optional<Produto> produtoComMesmoCodigo = produtoRepository.findByCode(dto.code());
            if (produtoComMesmoCodigo.isPresent() && !produtoComMesmoCodigo.get().getId().equals(id)) {
                throw new RuntimeException("Já existe outro produto com o código: " + dto.code());
            }
        }

        produto.setNome(dto.nome());
        produto.setCategoria(categoria);
        produto.setMaterial(dto.material());
        produto.setCode(dto.code());
        produto.setDescricao(dto.descricao());
        produto.setPrecoBase(dto.precoBase());
        produto.setPrecoOriginal(dto.precoOriginal());
        produto.setAtivo(dto.ativo() != null ? dto.ativo() : produto.getAtivo());
        produto.setImagemPrincipal(dto.imagemPrincipal());

        if (dto.details() != null) produto.setDetails(new ArrayList<>(dto.details()));
        if (dto.imagens() != null) produto.setImagens(new ArrayList<>(dto.imagens()));

        if (dto.variantes() != null) {
            atualizarVariantes(dto.variantes(), produto);
        }

        return produtoRepository.save(produto);
    }

    private void atualizarVariantes(List<VarianteProdutoDTO> variantesDto, Produto produto) {
        List<VarianteProduto> variantesParaRemover = new ArrayList<>();
        for (VarianteProduto varianteExistente : produto.getVariantes()) {
            boolean encontradaNoDto = variantesDto.stream()
                    .anyMatch(v -> v.id() != null && v.id().equals(varianteExistente.getId()));
            if (!encontradaNoDto) variantesParaRemover.add(varianteExistente);
        }
        produto.getVariantes().removeAll(variantesParaRemover);
        if (!variantesParaRemover.isEmpty()) varianteProdutoRepository.deleteAll(variantesParaRemover);

        for (VarianteProdutoDTO varianteDto : variantesDto) {
            if (varianteDto.id() == null) {
                VarianteProduto novaVariante = new VarianteProduto();
                novaVariante.setProduto(produto);
                novaVariante.setTamanho(varianteDto.tamanho() != null ? varianteDto.tamanho() : "Único");
                novaVariante.setCor(varianteDto.cor() != null ? varianteDto.cor() : "Padrão");
                novaVariante.setEstoque(varianteDto.estoque() != null ? varianteDto.estoque() : 0);
                novaVariante.setPrecoAdicional(varianteDto.precoAdicional() != null ? varianteDto.precoAdicional() : BigDecimal.ZERO);
                novaVariante.setImagemVariante(varianteDto.imagemVariante());
                VarianteProduto varianteSalva = varianteProdutoRepository.save(novaVariante);
                produto.getVariantes().add(varianteSalva);
            } else {
                produto.getVariantes().stream()
                        .filter(v -> v.getId().equals(varianteDto.id()))
                        .findFirst()
                        .ifPresent(v -> {
                            v.setTamanho(varianteDto.tamanho() != null ? varianteDto.tamanho() : v.getTamanho());
                            v.setCor(varianteDto.cor() != null ? varianteDto.cor() : v.getCor());
                            v.setEstoque(varianteDto.estoque() != null ? varianteDto.estoque() : v.getEstoque());
                            v.setPrecoAdicional(varianteDto.precoAdicional() != null ? varianteDto.precoAdicional() : v.getPrecoAdicional());
                            v.setImagemVariante(varianteDto.imagemVariante());
                            varianteProdutoRepository.save(v);
                        });
            }
        }
    }

    @Transactional
    public void deletarProduto(Long id) {
        Produto produto = produtoRepository.findById(id).orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        if (produto.getVariantes() != null) {
            varianteProdutoRepository.deleteAll(produto.getVariantes());
            produto.getVariantes().clear();
        }
        produtoRepository.delete(produto);
    }

    // --- MÉTODOS DE ESTOQUE (Mantidos) ---
    @Transactional
    public void decrementarEstoqueVariante(Long varianteId, int quantidadeComprada) {
        VarianteProduto variante = varianteProdutoRepository.findById(varianteId)
                .orElseThrow(() -> new RuntimeException("Variante não encontrada"));

        int estoqueAtual = variante.getEstoque() != null ? variante.getEstoque() : 0;
        if (estoqueAtual < quantidadeComprada) throw new RuntimeException("Estoque insuficiente");

        variante.setEstoque(estoqueAtual - quantidadeComprada);
        varianteProdutoRepository.save(variante);

        // Se acabou o estoque de TODAS as variantes, desativa o produto (Opcional, conforme sua regra)
        Produto pai = variante.getProduto();
        boolean temEstoque = pai.getVariantes().stream().anyMatch(v -> v.getEstoque() > 0);
        if (!temEstoque) {
            pai.setAtivo(false);
            produtoRepository.save(pai);
        }
    }

    @Transactional
    public void aumentarEstoqueVariante(Long varianteId, int quantidade) {
        VarianteProduto variante = varianteProdutoRepository.findById(varianteId)
                .orElseThrow(() -> new RuntimeException("Variante não encontrada"));
        variante.setEstoque((variante.getEstoque() != null ? variante.getEstoque() : 0) + quantidade);
        varianteProdutoRepository.save(variante);
    }

    public Integer getEstoqueVariante(Long varianteId) {
        return varianteProdutoRepository.findById(varianteId).map(VarianteProduto::getEstoque).orElse(0);
    }

    public List<Produto> buscarPorCategoria(Long categoriaId) {
        return produtoRepository.findByCategoriaId(categoriaId);
    }

    @Transactional
    public VarianteProduto adicionarVariante(Long produtoId, VarianteProduto variante) {
        Produto produto = produtoRepository.findById(produtoId).orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        variante.setProduto(produto);
        produto.getVariantes().add(variante);
        return varianteProdutoRepository.save(variante);
    }

    // --- NOVO MÉTODO DE VISUALIZAÇÃO ---
    @Transactional
    public void incrementarVisualizacoes(Long produtoId) {
        produtoRepository.findById(produtoId).ifPresent(produto -> {
            // Proteção contra nulo + incremento
            produto.setVisualizacoes((produto.getVisualizacoes() != null ? produto.getVisualizacoes() : 0) + 1);
            produtoRepository.save(produto);
        });
    }
}