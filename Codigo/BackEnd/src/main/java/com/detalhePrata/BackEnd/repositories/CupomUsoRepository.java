package com.detalhePrata.BackEnd.repositories;

import com.detalhePrata.BackEnd.models.CupomUso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CupomUsoRepository extends JpaRepository<CupomUso, Long> {

    // Verifica se existe algum registro de uso deste cupom por este usuário
    boolean existsByCupomIdAndUsuarioId(Long cupomId, Long usuarioId);
}