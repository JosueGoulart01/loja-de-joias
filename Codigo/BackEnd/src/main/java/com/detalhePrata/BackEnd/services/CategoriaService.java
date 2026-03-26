package com.detalhePrata.BackEnd.services;

import com.detalhePrata.BackEnd.dtos.CategoriaComContagemDTO;
import com.detalhePrata.BackEnd.dtos.CategoriaDTO;
import com.detalhePrata.BackEnd.models.Categoria;
import com.detalhePrata.BackEnd.repositories.CategoriaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    // Lista categorias com a contagem de produtos (para o admin)
    public List<CategoriaComContagemDTO> listarCategoriasComContagem() {
        return categoriaRepository.getCategoriasComContagemDeProdutos();
    }

    // Lista apenas categorias ativas (para o cliente)
    public List<Categoria> listarCategoriasAtivas() {
        return categoriaRepository.findByAtivaTrue();
    }

    // Buscar categoria por ID
    public Categoria buscarPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada com ID: " + id));
    }

    // Cria uma nova categoria
    @Transactional
    public Categoria criarCategoria(CategoriaDTO dto) {
        // Validação do nome
        if (dto.nome() == null || dto.nome().trim().isEmpty()) {
            throw new RuntimeException("O nome da categoria é obrigatório");
        }

        String nome = dto.nome().trim();
        
        // Verifica se já existe categoria com este nome
        if (categoriaRepository.findByNome(nome).isPresent()) {
            throw new RuntimeException("Uma categoria com o nome '" + nome + "' já existe.");
        }

        try {
            Categoria novaCategoria = new Categoria(nome, dto.ativa());
            Categoria categoriaSalva = categoriaRepository.save(novaCategoria);
            categoriaRepository.flush(); // Força o flush para garantir o salvamento
            return categoriaSalva;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar categoria: " + e.getMessage());
        }
    }

    // Atualiza uma categoria
    @Transactional
    public Categoria atualizarCategoria(Long id, CategoriaDTO dto) {
        // Validação do nome
        if (dto.nome() == null || dto.nome().trim().isEmpty()) {
            throw new RuntimeException("O nome da categoria é obrigatório");
        }

        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada com ID: " + id));

        String novoNome = dto.nome().trim();

        // Verifica se o novo nome já está em uso por *outra* categoria
        categoriaRepository.findByNome(novoNome)
                .ifPresent(existente -> {
                    if (!existente.getId().equals(id)) {
                        throw new RuntimeException("O nome '" + novoNome + "' já está em uso por outra categoria.");
                    }
                });

        categoria.setNome(novoNome);
        categoria.setAtiva(dto.ativa());
        
        try {
            Categoria categoriaAtualizada = categoriaRepository.save(categoria);
            categoriaRepository.flush();
            return categoriaAtualizada;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar categoria: " + e.getMessage());
        }
    }

    // Deleta uma categoria
    @Transactional
    public void deletarCategoria(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada com ID: " + id));

        // Regra de negócio: não permite deletar se houver produtos associados
        Long quantidadeProdutos = categoriaRepository.countByCategoriaId(id);
        if (quantidadeProdutos > 0) {
            throw new RuntimeException(
                "Não é possível excluir a categoria '" + categoria.getNome() + 
                "', pois ela possui " + quantidadeProdutos + " produto(s) associado(s)."
            );
        }

        try {
            categoriaRepository.delete(categoria);
            categoriaRepository.flush();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao excluir categoria: " + e.getMessage());
        }
    }
}