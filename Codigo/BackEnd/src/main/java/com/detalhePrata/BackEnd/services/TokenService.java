package com.detalhePrata.BackEnd.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.detalhePrata.BackEnd.models.PessoaFisica;
import com.detalhePrata.BackEnd.models.PessoaJuridica;
import com.detalhePrata.BackEnd.models.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.auth0.jwt.JWTVerifier;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    public String gerarToken(Usuario usuario) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);

            String nomeUsuario = "";
            if (usuario instanceof PessoaFisica) {
                nomeUsuario = ((PessoaFisica) usuario).getNome();
            } else if (usuario instanceof PessoaJuridica) {
                nomeUsuario = ((PessoaJuridica) usuario).getNomeFantasia();
            }

            return JWT.create()
                    .withIssuer("API Detalhe Prata")
                    .withSubject(usuario.getEmail())
                    .withClaim("nome", nomeUsuario)

                    // <<< ADICIONE ESTA LINHA CRUCIAL >>>
                    .withClaim("role", usuario.getRole()) // Adiciona a role (ex: "ADMIN") ao token

                    .withExpiresAt(gerarDataExpiracao())
                    .sign(algoritmo);
        } catch (JWTCreationException exception){
            throw new RuntimeException("Erro ao gerar token JWT", exception);
        }
    }

    private Instant gerarDataExpiracao() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }

    public String getSubject(String tokenJWT) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);
            JWTVerifier verifier = JWT.require(algoritmo)
                    .withIssuer("API Detalhe Prata")
                    .build();
            return verifier.verify(tokenJWT).getSubject();
        } catch (Exception exception) {
            throw new RuntimeException("Token JWT inválido ou expirado!");
        }
    }
}