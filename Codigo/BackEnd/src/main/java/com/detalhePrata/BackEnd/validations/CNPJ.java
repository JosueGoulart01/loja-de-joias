package com.detalhePrata.BackEnd.validations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/**
 * Anotação customizada para validação de CNPJ
 * Pode ser usada em campos String para validar automaticamente o CNPJ
 *
 * Exemplo de uso:
 *   @CNPJ
 *   private String cnpj;
 */
@Documented
@Constraint(validatedBy = CNPJValidator.class)
@Target({ElementType.METHOD, ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface CNPJ {
    
    String message() default "CNPJ inválido";
    
    Class<?>[] groups() default {};
    
    Class<? extends Payload>[] payload() default {};
}
