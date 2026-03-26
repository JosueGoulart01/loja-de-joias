package com.detalhePrata.BackEnd.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

// Usando record, os métodos varianteId() e quantidade() são gerados automaticamente
public record UpdateQuantityDTO(
        @NotNull(message = "ID da variante não pode ser nulo")
        Long varianteId,

        @NotNull(message = "Quantidade não pode ser nula")
        @Min(value = 0, message = "Quantidade não pode ser negativa") // Permite 0 para remover
        Integer quantidade
) {}