package com.detalhePrata.BackEnd.repositories;

import com.detalhePrata.BackEnd.models.Cupom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CupomRepository extends JpaRepository<Cupom, Long> {

    Optional<Cupom> findByCodigo(String codigo);
    
    Optional<Cupom> findByCodigoAndAtivoTrue(String codigo);
    
    List<Cupom> findByAtivoTrue();
    
    boolean existsByCodigo(String codigo);
    
    boolean existsByCodigoAndIdNot(String codigo, Long id);
    
    @Query("SELECT c FROM Cupom c WHERE c.ativo = true ORDER BY c.dataCriacao DESC")
    List<Cupom> findAllActiveCoupons();
    
    // Novo método para buscar cupons válidos
    @Query("SELECT c FROM Cupom c WHERE c.ativo = true AND c.usosRestantes > 0 ORDER BY c.dataCriacao DESC")
    List<Cupom> findValidCoupons();
}