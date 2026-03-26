package com.detalhePrata.BackEnd.services;

import com.detalhePrata.BackEnd.models.MovimentacaoEstoque;
import com.detalhePrata.BackEnd.models.VarianteProduto;
import com.detalhePrata.BackEnd.models.enums.TipoMovimentacao;
import com.detalhePrata.BackEnd.repositories.MovimentacaoEstoqueRepository;
import com.detalhePrata.BackEnd.repositories.VarianteProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EstoqueService {

    @Autowired
    private VarianteProdutoRepository varianteRepository;

    @Autowired
    private MovimentacaoEstoqueRepository movimentacaoRepository;

    @Transactional
    public void registrarMovimentacao(Long varianteId, Integer qtd, TipoMovimentacao tipo, String motivo) {
        VarianteProduto variante = varianteRepository.findById(varianteId)
                .orElseThrow(() -> new RuntimeException("Variante de produto não encontrada (ID: " + varianteId + ")"));

        // Atualiza o saldo na VARIANTE
        int saldoAtual = variante.getEstoque();

        if (tipo == TipoMovimentacao.ENTRADA) {
            saldoAtual += qtd;
        } else {
            if (saldoAtual < qtd) {
                // CORREÇÃO: Usando getTamanho() pois variante não tem getNome()
                throw new RuntimeException("Estoque insuficiente para: " +
                        variante.getProduto().getNome() + " - Tamanho: " + variante.getTamanho());
            }
            saldoAtual -= qtd;
        }

        variante.setEstoque(saldoAtual);
        varianteRepository.save(variante);

        // Grava Histórico
        MovimentacaoEstoque mov = new MovimentacaoEstoque();
        mov.setVariante(variante);
        mov.setQuantidade(qtd);
        mov.setTipo(tipo);
        mov.setMotivo(motivo);

        movimentacaoRepository.save(mov);
    }
}