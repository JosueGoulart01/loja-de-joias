// EnderecoDTO.java
package com.detalhePrata.BackEnd.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EnderecoDTO {
    
    @NotBlank(message = "Rua é obrigatória")
    private String rua;
    
    @NotBlank(message = "Número é obrigatório")
    private String numero;
    
    private String complemento;
    
    @NotBlank(message = "Bairro é obrigatório")
    private String bairro;
    
    @NotBlank(message = "Cidade é obrigatória")
    private String cidade;
    
    @NotBlank(message = "Estado é obrigatório")
    private String estado;
    
    @NotBlank(message = "CEP é obrigatório")
    private String cep;
    
    private String pontoReferencia;
}