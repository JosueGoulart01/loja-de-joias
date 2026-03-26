// PessoaFisicaDTO.java
package com.detalhePrata.BackEnd.dtos;

import com.detalhePrata.BackEnd.models.enums.PreferenciaContato;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class PessoaFisicaDTO {
    
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    
    @NotBlank(message = "Sobrenome é obrigatório")
    private String sobrenome;
    
    @NotBlank(message = "CPF é obrigatório")
    @Pattern(regexp = "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}", message = "CPF deve estar no formato 000.000.000-00")
    private String cpf;
    
    @NotBlank(message = "Data de nascimento é obrigatória")
    private String dataNascimento;
    
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    private String email;
    
    @NotBlank(message = "Telefone é obrigatório")
    private String telefone;
    
    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter pelo menos 6 caracteres")
    private String senha;
    
    @NotNull(message = "Endereço é obrigatório")
    private EnderecoDTO endereco;
    
    @NotNull(message = "Preferência de contato é obrigatória")
    private PreferenciaContato preferenciaContato;
}