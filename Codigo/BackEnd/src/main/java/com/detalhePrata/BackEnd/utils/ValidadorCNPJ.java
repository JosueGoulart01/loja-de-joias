package com.detalhePrata.BackEnd.utils;

/**
 * Utilitário para validação de CNPJ (Cadastro Nacional de Pessoa Jurídica)
 * Valida o formato e os dígitos verificadores conforme algoritmo oficial
 */
public class ValidadorCNPJ {

    /**
     * Lista de CNPJs genéricos/padrão que devem ser rejeitados
     */
    private static final String[] CNPJS_INVALIDOS = {
        "00000000000000",
        "11111111111111",
        "22222222222222",
        "33333333333333",
        "44444444444444",
        "55555555555555",
        "66666666666666",
        "77777777777777",
        "88888888888888",
        "99999999999999"
    };

    /**
     * Remove caracteres especiais de formatação do CNPJ
     * Ex: "12.345.678/0001-90" -> "12345678000190"
     *
     * @param cnpj CNPJ potencialmente formatado
     * @return CNPJ apenas com dígitos
     */
    public static String limpar(String cnpj) {
        if (cnpj == null) return null;
        return cnpj.replaceAll("\\D", "");
    }

    /**
     * Valida se o CNPJ é válido
     * Verifica formato, rejeita CNPJs genéricos e valida dígitos verificadores
     *
     * @param cnpj CNPJ com ou sem formatação
     * @return true se CNPJ válido, false caso contrário
     */
    public static boolean isValido(String cnpj) {
        if (cnpj == null || cnpj.trim().isEmpty()) {
            return false;
        }

        // Remove formatação
        String cnpjLimpo = limpar(cnpj);

        // Deve ter exatamente 14 dígitos
        if (cnpjLimpo.length() != 14) {
            return false;
        }

        // Verifica se é CNPJ genérico
        if (isGenerico(cnpjLimpo)) {
            return false;
        }

        // Valida dígitos verificadores
        return isDigitosVerificadoresValidos(cnpjLimpo);
    }

    /**
     * Verifica se o CNPJ é um dos CNPJs genéricos/inválidos conhecidos
     *
     * @param cnpj CNPJ limpo (apenas dígitos)
     * @return true se for genérico, false caso contrário
     */
    private static boolean isGenerico(String cnpj) {
        for (String cnpjGenerico : CNPJS_INVALIDOS) {
            if (cnpj.equals(cnpjGenerico)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Valida os dígitos verificadores do CNPJ usando o algoritmo módulo 11
     * Aplicado aos dois últimos dígitos do CNPJ
     *
     * @param cnpj CNPJ limpo (apenas dígitos, 14 caracteres)
     * @return true se dígitos verificadores são válidos, false caso contrário
     */
    private static boolean isDigitosVerificadoresValidos(String cnpj) {
        // Extrai os dígitos verificadores
        char digito1 = cnpj.charAt(12);
        char digito2 = cnpj.charAt(13);

        // Calcula primeiro dígito verificador
        int digitoCalculado1 = calcularDigitoVerificador(cnpj.substring(0, 12), 5);
        if (digito1 != Character.forDigit(digitoCalculado1, 10)) {
            return false;
        }

        // Calcula segundo dígito verificador
        int digitoCalculado2 = calcularDigitoVerificador(cnpj.substring(0, 12) + digitoCalculado1, 6);
        return digito2 == Character.forDigit(digitoCalculado2, 10);
    }

    /**
     * Calcula um dígito verificador usando o algoritmo módulo 11
     *
     * @param cnpj Parte do CNPJ para calcular o dígito
     * @param multiplicadorInicial Multiplicador inicial (5 para 1º dígito, 6 para 2º)
     * @return O dígito verificador calculado (0-9)
     */
    private static int calcularDigitoVerificador(String cnpj, int multiplicadorInicial) {
        int soma = 0;
        int multiplicador = multiplicadorInicial;

        // Multiplica cada dígito pela sequência decrescente de multiplicadores
        for (int i = 0; i < cnpj.length(); i++) {
            int digit = Character.getNumericValue(cnpj.charAt(i));
            soma += digit * multiplicador;
            multiplicador--;
            if (multiplicador < 2) {
                multiplicador = 9;
            }
        }

        // Calcula o resto da divisão por 11
        int resto = soma % 11;

        // Se resto for menor que 2, digito é 0; caso contrário é 11 - resto
        return resto < 2 ? 0 : 11 - resto;
    }

    /**
     * Formata um CNPJ limpo no padrão brasileiro: XX.XXX.XXX/XXXX-XX
     *
     * @param cnpjLimpo CNPJ com apenas dígitos (14 caracteres)
     * @return CNPJ formatado
     */
    public static String formatar(String cnpjLimpo) {
        if (cnpjLimpo == null || cnpjLimpo.length() != 14) {
            return cnpjLimpo;
        }
        return String.format("%s.%s.%s/%s-%s",
            cnpjLimpo.substring(0, 2),
            cnpjLimpo.substring(2, 5),
            cnpjLimpo.substring(5, 8),
            cnpjLimpo.substring(8, 12),
            cnpjLimpo.substring(12, 14)
        );
    }

    /**
     * Obtem mensagem de erro específica para o tipo de inválidez
     *
     * @param cnpj CNPJ a validar
     * @return Mensagem de erro específica ou null se válido
     */
    public static String obterMensagemErro(String cnpj) {
        if (cnpj == null || cnpj.trim().isEmpty()) {
            return "CNPJ é obrigatório";
        }

        String cnpjLimpo = limpar(cnpj);

        if (cnpjLimpo.length() != 14) {
            return "CNPJ deve conter exatamente 14 dígitos";
        }

        if (isGenerico(cnpjLimpo)) {
            return "CNPJ inválido (padrão genérico)";
        }

        if (!isDigitosVerificadoresValidos(cnpjLimpo)) {
            return "CNPJ inválido (dígitos verificadores incorretos)";
        }

        return null; // Válido
    }
}
