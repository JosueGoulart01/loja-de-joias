package com.detalhePrata.BackEnd.dtos;

/**
 * Representa uma resposta de erro padronizada.
 */
public record ErrorResponse(int statusCode, String message) {
    
    // --- ADIÇÃO: Construtor secundário ---
    // Isso resolve o erro "The constructor ErrorResponse(String) is undefined"
    // Ao passar só a mensagem, ele assume automaticamente o erro 400 (Bad Request).
    public ErrorResponse(String message) {
        this(400, message);
    }
}