package com.detalhePrata.BackEnd.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;

/**
 * Serviço para integração com BrasilAPI
 * Valida CNPJs contra a base de dados da Receita Federal
 */
@Service
public class BrasilAPIService {

    private static final String BRASIL_API_URL = "https://api.cnpja.com.br/office/{cnpj}";
    private static final String BRASIL_API_BACKUP = "https://brasilapi.com.br/api/cnpj/v1/{cnpj}";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public BrasilAPIService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Valida CNPJ contra a BrasilAPI
     * Tenta múltiplas fontes para garantir confiabilidade
     *
     * @param cnpjLimpo CNPJ sem formatação (apenas dígitos)
     * @return Map com resultado da validação contendo:
     *         - valido: boolean
     *         - ativo: boolean (se conseguiu validar)
     *         - razaoSocial: String (nome da empresa)
     *         - erro: String (mensagem de erro se houver)
     */
    public Map<String, Object> validarCNPJComBrasilAPI(String cnpjLimpo) {
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("valido", false);
        resultado.put("ativo", false);

        if (cnpjLimpo == null || cnpjLimpo.length() != 14) {
            resultado.put("erro", "CNPJ inválido");
            return resultado;
        }

        try {
            // Tenta primeira API (cnpja.com.br)
            Map<String, Object> resultadoPrimeira = tentarValidarComCNPJA(cnpjLimpo);
            if (resultadoPrimeira != null) {
                return resultadoPrimeira;
            }

            // Se falhar, tenta segunda API (brasilapi.com.br)
            Map<String, Object> resultadoSegunda = tentarValidarComBrasilAPI(cnpjLimpo);
            if (resultadoSegunda != null) {
                return resultadoSegunda;
            }

            // Se ambas falharem, retorna erro
            resultado.put("erro", "Não foi possível validar CNPJ neste momento");
            return resultado;

        } catch (Exception e) {
            resultado.put("erro", "Erro ao comunicar com API de validação: " + e.getMessage());
            return resultado;
        }
    }

    /**
     * Tenta validar usando API cnpja.com.br
     */
    private Map<String, Object> tentarValidarComCNPJA(String cnpjLimpo) {
        try {
            String url = BRASIL_API_URL.replace("{cnpj}", cnpjLimpo);
            String response = restTemplate.getForObject(url, String.class);
            
            if (response != null) {
                JsonNode jsonNode = objectMapper.readTree(response);
                Map<String, Object> resultado = new HashMap<>();
                
                // Verifica se obteve dados válidos
                if (jsonNode.has("name") || jsonNode.has("cnpj")) {
                    resultado.put("valido", true);
                    resultado.put("ativo", true);
                    resultado.put("razaoSocial", jsonNode.has("name") ? 
                        jsonNode.get("name").asText() : "Empresa validada");
                    resultado.put("fonte", "cnpja.com.br");
                    return resultado;
                }
            }
        } catch (RestClientException | com.fasterxml.jackson.core.JsonProcessingException e) {
            // API pode não ter encontrado ou está indisponível, tenta próxima
        } catch (Exception e) {
            // Ignora e tenta próxima
        }
        return null;
    }

    /**
     * Tenta validar usando API brasilapi.com.br
     */
    private Map<String, Object> tentarValidarComBrasilAPI(String cnpjLimpo) {
        try {
            String url = BRASIL_API_BACKUP.replace("{cnpj}", cnpjLimpo);
            String response = restTemplate.getForObject(url, String.class);
            
            if (response != null) {
                JsonNode jsonNode = objectMapper.readTree(response);
                Map<String, Object> resultado = new HashMap<>();
                
                // Verifica se obteve dados válidos
                if (jsonNode.has("nome") || jsonNode.has("cnpj")) {
                    boolean estaAtivo = !jsonNode.has("status") || 
                        !jsonNode.get("status").asText().equalsIgnoreCase("BAIXADA");
                    
                    resultado.put("valido", true);
                    resultado.put("ativo", estaAtivo);
                    resultado.put("razaoSocial", jsonNode.has("nome") ? 
                        jsonNode.get("nome").asText() : "Empresa validada");
                    resultado.put("status", jsonNode.has("status") ? 
                        jsonNode.get("status").asText() : "ATIVA");
                    resultado.put("fonte", "brasilapi.com.br");
                    
                    if (!estaAtivo) {
                        resultado.put("mensagem", "CNPJ encontrado mas não está ativo");
                    }
                    
                    return resultado;
                }
            }
        } catch (RestClientException | com.fasterxml.jackson.core.JsonProcessingException e) {
            // API não encontrou ou está indisponível
        } catch (Exception e) {
            // Ignora
        }
        return null;
    }
}
