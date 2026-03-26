package com.detalhePrata.BackEnd;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@SpringBootApplication
public class BackEndApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackEndApplication.class, args);
        System.out.println("Back-end iniciado com sucesso!");
	}

	// <<< CÓDIGO DE DIAGNÓSTICO ADICIONADO >>>
	// Este código especial será executado assim que a aplicação iniciar.
	// Ele vai imprimir no console uma lista de TODAS as rotas (endpoints)
	// que o Spring conseguiu encontrar e registrar. Isso vai nos dizer
	// com 100% de certeza se o seu CadastroController está sendo visto.
	@Bean
public CommandLineRunner commandLineRunner(
        @org.springframework.beans.factory.annotation.Qualifier("requestMappingHandlerMapping")
        RequestMappingHandlerMapping mapping
) {
    return args -> {
        System.out.println("---------- ROTAS MAPEADAS PELA APLICAÇÃO ----------");
        mapping.getHandlerMethods().forEach((key, value) -> {
            System.out.println(key.getMethodsCondition() + " " + key.getPatternsCondition() + " -> " + value);
        });
        System.out.println("----------------------------------------------------");
    };
}
}

