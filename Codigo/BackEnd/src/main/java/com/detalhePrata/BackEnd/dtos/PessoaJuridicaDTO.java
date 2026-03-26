// PessoaJuridicaDTO.java
package com.detalhePrata.BackEnd.dtos;

import jakarta.validation.constraints.*;
import com.detalhePrata.BackEnd.validations.CNPJ;
import lombok.Data;

@Data
public class PessoaJuridicaDTO {
    
    @NotBlank(message = "CNPJ é obrigatório")
    @CNPJ(message = "CNPJ inválido")
    private String cnpj;
    
    private String inscricaoEstadual;
    
    @NotBlank(message = "Nome fantasia é obrigatório")
    private String nomeFantasia;
    
    @NotBlank(message = "Razão social é obrigatória")
    private String razaoSocial;
    
    @NotBlank(message = "Nome do responsável é obrigatório")
    private String nomeResponsavel;
    
    @NotBlank(message = "Sobrenome do responsável é obrigatório")
    private String sobrenomeResponsavel;
    
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    private String email;
    
    @NotBlank(message = "Telefone é obrigatório")
    private String telefone;
    
    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter pelo menos 6 caracteres")
    private String senha;
    
    @NotNull(message = "Endereço da empresa é obrigatório")
    private EnderecoDTO enderecoEmpresa;
    
    @NotNull(message = "Endereço de entrega é obrigatório")
    private EnderecoDTO enderecoEntrega;
    
    @NotBlank(message = "Como nos conheceu é obrigatório")
    private String comoNosConheceu;
}