package com.detalhePrata.BackEnd.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.detalhePrata.BackEnd.models.HistoricoPedido;

@Repository
public interface HistoricoPedidoRepository extends JpaRepository<HistoricoPedido, Long> {
    
}
