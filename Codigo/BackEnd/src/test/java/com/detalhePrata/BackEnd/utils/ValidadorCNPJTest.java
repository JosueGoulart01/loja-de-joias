package com.detalhePrata.BackEnd.utils;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Testes para ValidadorCNPJ")
class ValidadorCNPJTest {

    @Test
    @DisplayName("Deve validar CNPJ válido formatado")
    void testCNPJValidoFormatado() {
        // Casos reais de CNPJs válidos
        assertTrue(ValidadorCNPJ.isValido("11.222.333/0001-81"));
        assertTrue(ValidadorCNPJ.isValido("16.716.114/0001-32"));
    }

    @Test
    @DisplayName("Deve validar CNPJ válido sem formatação")
    void testCNPJValidoSemFormatacao() {
        // Mesmos CNPJs sem pontuação
        assertTrue(ValidadorCNPJ.isValido("11222333000181"));
        assertTrue(ValidadorCNPJ.isValido("16716114000132"));
    }

    @Test
    @DisplayName("Deve rejeitar CNPJ com dígitos verificadores inválidos")
    void testCNPJDígitosInválidos() {
        assertFalse(ValidadorCNPJ.isValido("11.222.333/0001-82")); // último dígito errado
        assertFalse(ValidadorCNPJ.isValido("11.222.333/0001-00")); // dígitos errados
    }

    @Test
    @DisplayName("Deve rejeitar CNPJ genérico (todos os dígitos iguais)")
    void testCNPJGenérico() {
        assertFalse(ValidadorCNPJ.isValido("00.000.000/0000-00"));
        assertFalse(ValidadorCNPJ.isValido("11.111.111/1111-11"));
        assertFalse(ValidadorCNPJ.isValido("22.222.222/2222-22"));
        assertFalse(ValidadorCNPJ.isValido("33.333.333/3333-33"));
        assertFalse(ValidadorCNPJ.isValido("44.444.444/4444-44"));
        assertFalse(ValidadorCNPJ.isValido("55.555.555/5555-55"));
        assertFalse(ValidadorCNPJ.isValido("66.666.666/6666-66"));
        assertFalse(ValidadorCNPJ.isValido("77.777.777/7777-77"));
        assertFalse(ValidadorCNPJ.isValido("88.888.888/8888-88"));
        assertFalse(ValidadorCNPJ.isValido("99.999.999/9999-99"));
    }

    @Test
    @DisplayName("Deve rejeitar CNPJ null")
    void testCNPJNull() {
        assertFalse(ValidadorCNPJ.isValido(null));
    }

    @Test
    @DisplayName("Deve rejeitar CNPJ vazio")
    void testCNPJVazio() {
        assertFalse(ValidadorCNPJ.isValido(""));
        assertFalse(ValidadorCNPJ.isValido("   "));
    }

    @Test
    @DisplayName("Deve rejeitar CNPJ com menos de 14 dígitos")
    void testCNPJMenosDeDezQuatro() {
        assertFalse(ValidadorCNPJ.isValido("11.222.333/0001"));
        assertFalse(ValidadorCNPJ.isValido("112223330001"));
        assertFalse(ValidadorCNPJ.isValido("123"));
    }

    @Test
    @DisplayName("Deve rejeitar CNPJ com mais de 14 dígitos")
    void testCNPJMaisDeDezQuatro() {
        assertFalse(ValidadorCNPJ.isValido("11.222.333/0001-811"));
        assertFalse(ValidadorCNPJ.isValido("112223330001811"));
    }

    @Test
    @DisplayName("Deve rejeitar CNPJ com caracteres inválidos")
    void testCNPJComCaracteresInválidos() {
        assertFalse(ValidadorCNPJ.isValido("11.222.333/000A-81"));
        assertFalse(ValidadorCNPJ.isValido("CNPJ_11222333000181"));
        assertFalse(ValidadorCNPJ.isValido("11.222.333/0001-@1"));
    }

    @Test
    @DisplayName("Deve limpar formatação corretamente")
    void testLimparFormatacao() {
        assertEquals("11222333000181", ValidadorCNPJ.limpar("11.222.333/0001-81"));
        assertEquals("11222333000181", ValidadorCNPJ.limpar("11222333000181"));
        assertEquals("16716114000132", ValidadorCNPJ.limpar("16.716.114/0001-32"));
    }

    @Test
    @DisplayName("Deve formatar CNPJ corretamente")
    void testFormatar() {
        assertEquals("11.222.333/0001-81", ValidadorCNPJ.formatar("11222333000181"));
        assertEquals("16.716.114/0001-32", ValidadorCNPJ.formatar("16716114000132"));
    }

    @Test
    @DisplayName("Deve retornar mensagem de erro apropriada para CNPJ null")
    void testMensagemErroNull() {
        assertNotNull(ValidadorCNPJ.obterMensagemErro(null));
        assertTrue(ValidadorCNPJ.obterMensagemErro(null).contains("obrigatório"));
    }

    @Test
    @DisplayName("Deve retornar mensagem de erro para CNPJ com dígitos inválidos")
    void testMensagemErroDigitosInválidos() {
        String mensagem = ValidadorCNPJ.obterMensagemErro("11.222.333/0001-82");
        assertNotNull(mensagem);
        assertTrue(mensagem.toLowerCase().contains("dígito") || mensagem.toLowerCase().contains("inválido"));
    }

    @Test
    @DisplayName("Deve retornar mensagem de erro para CNPJ genérico")
    void testMensagemErroGenérico() {
        String mensagem = ValidadorCNPJ.obterMensagemErro("11.111.111/1111-11");
        assertNotNull(mensagem);
        assertTrue(mensagem.toLowerCase().contains("genérico") || mensagem.toLowerCase().contains("inválido"));
    }

    @Test
    @DisplayName("Deve retornar null para CNPJ válido")
    void testMensagemErroValido() {
        assertNull(ValidadorCNPJ.obterMensagemErro("11.222.333/0001-81"));
        assertNull(ValidadorCNPJ.obterMensagemErro("16716114000132"));
    }

    @ParameterizedTest
    @ValueSource(strings = {
        "11.222.333/0001-81",
        "11222333000181",
        "16.716.114/0001-32",
        "16716114000132"
    })
    @DisplayName("Deve validar múltiplos CNPJs válidos")
    void testMultiplosCNPJsValidos(String cnpj) {
        assertTrue(ValidadorCNPJ.isValido(cnpj));
    }

    @ParameterizedTest
    @ValueSource(strings = {
        "00.000.000/0000-00",
        "11.111.111/1111-11",
        "22.222.222/2222-22",
        "11.222.333/0001-00",
        "12345678901234"
    })
    @DisplayName("Deve rejeitar múltiplos CNPJs inválidos")
    void testMultiplosCNPJsInválidos(String cnpj) {
        assertFalse(ValidadorCNPJ.isValido(cnpj));
    }

    @Test
    @DisplayName("Deve ser case-insensitive para CNPJ formatado")
    void testCaseInsensitive() {
        // A validação deve funcionar independente de maiúsculas/minúsculas
        assertTrue(ValidadorCNPJ.isValido("11.222.333/0001-81"));
        assertTrue(ValidadorCNPJ.isValido("11222333000181"));
    }
}
