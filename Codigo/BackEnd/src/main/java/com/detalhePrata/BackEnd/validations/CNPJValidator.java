package com.detalhePrata.BackEnd.validations;

import com.detalhePrata.BackEnd.utils.ValidadorCNPJ;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**
 * Implementação do validador para a anotação @CNPJ
 * Usa o ValidadorCNPJ para fazer a validação real
 */
public class CNPJValidator implements ConstraintValidator<CNPJ, String> {

    @Override
    public void initialize(CNPJ annotation) {
        // Nenhuma inicialização necessária
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        // Se o valor é null ou vazio, deixa o @NotBlank tratar (ou outro validador)
        if (value == null || value.trim().isEmpty()) {
            return true;
        }

        // Usa o ValidadorCNPJ para validar
        boolean isValid = ValidadorCNPJ.isValido(value);

        // Se inválido, customiza a mensagem de erro
        if (!isValid) {
            String mensagem = ValidadorCNPJ.obterMensagemErro(value);
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(mensagem)
                    .addConstraintViolation();
        }

        return isValid;
    }
}
