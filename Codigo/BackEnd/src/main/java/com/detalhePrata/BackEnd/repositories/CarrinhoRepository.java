package com.detalhePrata.BackEnd.repositories;

import com.detalhePrata.BackEnd.models.Carrinho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CarrinhoRepository extends JpaRepository<Carrinho, Long> {

    /**
     * Busca um carrinho associado a um identificador de sessão específico.
     * * @param sessaoId ID da sessão do usuário.
     * @return Optional contendo o carrinho, se encontrado.
     */
    Optional<Carrinho> findBySessaoId(String sessaoId);

    /**
     * Busca um carrinho associado a um ID de usuário registrado.
     * * @param usuarioId ID do usuário.
     * @return Optional contendo o carrinho, se encontrado.
     */
    Optional<Carrinho> findByUsuarioId(Long usuarioId);

    /**
     * Lista todos os carrinhos que já foram finalizados.
     * * @return Lista de carrinhos finalizados.
     */
    List<Carrinho> findByFinalizadoTrue();

    /**
     * Lista carrinhos finalizados de um usuário específico.
     * * @param usuarioId ID do usuário.
     * @return Lista de carrinhos do usuário.
     */
    List<Carrinho> findByUsuarioIdAndFinalizadoTrue(Long usuarioId);

    /**
     * Busca carrinhos finalizados dentro de um intervalo de tempo.
     * * @param inicio Data/hora de início.
     * @param fim Data/hora de fim.
     * @return Lista de carrinhos no período.
     */
    @Query("SELECT c FROM Carrinho c " +
           "WHERE c.finalizado = true " +
           "AND c.dataAtualizacao BETWEEN :inicio AND :fim")
    List<Carrinho> findCarrinhosFinalizadosNoPeriodo(
            @Param("inicio") LocalDateTime inicio, 
            @Param("fim") LocalDateTime fim
    );

    /**
     * Recupera o carrinho ativo (não finalizado) do usuário logado.
     * * @param usuarioId ID do usuário.
     * @return Optional com o carrinho ativo.
     */
    @Query("SELECT c FROM Carrinho c " +
           "WHERE c.usuario.id = :usuarioId " +
           "AND c.finalizado = false")
    Optional<Carrinho> findByUsuarioIdAndFinalizadoFalse(@Param("usuarioId") Long usuarioId);

    /**
     * Conta a quantidade de carrinhos ativos por sessão.
     * * @param sessaoId ID da sessão.
     * @return Quantidade de carrinhos.
     */
    @Query("SELECT COUNT(c) FROM Carrinho c " +
           "WHERE c.sessaoId = :sessaoId " +
           "AND c.finalizado = false")
    Long countCarrinhosAtivosPorSessao(@Param("sessaoId") String sessaoId);

    /**
     * Verifica booleanamente se existe um carrinho ativo para o usuário.
     * * @param usuarioId ID do usuário.
     * @return true se existir, false caso contrário.
     */
    @Query("SELECT COUNT(c) > 0 FROM Carrinho c " +
           "WHERE c.usuario.id = :usuarioId " +
           "AND c.finalizado = false")
    boolean existsCarrinhoAtivoPorUsuario(@Param("usuarioId") Long usuarioId);

    /**
     * Remove carrinhos baseados na sessão.
     * * @param sessaoId ID da sessão a ser limpa.
     */
    void deleteBySessaoId(String sessaoId);

    /**
     * Remove carrinhos antigos que não foram finalizados (rotina de limpeza).
     * * @param dataLimite Data limite para considerar o carrinho como antigo.
     */
    @Query("DELETE FROM Carrinho c " +
           "WHERE c.finalizado = false " +
           "AND c.dataCriacao < :dataLimite")
    void deleteCarrinhosAntigosNaoFinalizados(@Param("dataLimite") LocalDateTime dataLimite);
}