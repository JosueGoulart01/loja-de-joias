package com.detalhePrata.BackEnd.dtos;

public record NotificacaoDTO(
        String titulo,
        String mensagem,
        String codigoCupom, // Opcional
        boolean enviarParaTodos // Se false, respeita a preferência de contato do usuário
) {}