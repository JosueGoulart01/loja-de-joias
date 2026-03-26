package com.detalhePrata.BackEnd.repositories;

import com.detalhePrata.BackEnd.models.ItemCarrinho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemCarrinhoRepository extends JpaRepository<ItemCarrinho, Long> {
    // Métodos customizados se necessário
}