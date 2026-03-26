package com.detalhePrata.BackEnd.exceptions;

import com.detalhePrata.BackEnd.dtos.ErrorResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex, WebRequest request) {
        String message = "Ocorreu um erro de integridade dos dados. Verifique se o e-mail ou CPF já estão cadastrados.";
        
        // Lógica para extrair uma mensagem mais específica do erro do banco de dados
        if (ex.getCause() != null && ex.getCause().getCause() != null) {
            String causeMessage = ex.getCause().getCause().getMessage();
            if (causeMessage.contains("uc_pessoas_fisicas_cpf")) {
                message = "O CPF informado já está cadastrado.";
            } else if (causeMessage.contains("uk_pessoas_juridicas_cnpj")) {
                message = "O CNPJ informado já está cadastrado.";
            } else if (causeMessage.contains("uk_usuarios_email")) {
                message = "O e-mail informado já está cadastrado.";
            }
        }

        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.CONFLICT.value(), message);
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    // Você pode adicionar outros handlers de exceção aqui
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Ocorreu um erro inesperado no servidor.");
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
