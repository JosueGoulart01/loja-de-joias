package com.detalhePrata.BackEnd.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // ====================================================
                        // 🔓 ACESSO PÚBLICO (Qualquer pessoa vê)
                        // ====================================================

                        .requestMatchers(HttpMethod.POST, "/api/pagamento/webhook").permitAll()

                        // Arquivos de Imagem
                        .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()

                        // Catálogo (Ver produtos e categorias)
                        .requestMatchers(HttpMethod.GET, "/api/produtos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()

                        // Login e Cadastro
                        .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/cadastro/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/cadastro/validar-cnpj").permitAll()

                        // Carrinho e Checkout (Necessário para visitante adicionar itens)
                        .requestMatchers("/api/carrinho/**").permitAll()

                        // Cupons (Validação e Uso no Checkout)
                        .requestMatchers(HttpMethod.GET, "/api/cupons/ativos").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/cupons/codigo/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/cupons/validar").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/cupons/usar").permitAll()

                        // ====================================================
                        // 👤 CLIENTE LOGADO (Autenticado)
                        // ====================================================

                        // Histórico de Pedidos e Perfil
                        .requestMatchers("/api/pedidos/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/usuarios/buscar").permitAll()
                        .requestMatchers("/api/usuarios/perfil/**").authenticated()

                        // ====================================================
                        // 🛡️ ADMIN (Restrito)
                        // ====================================================

                        // Gestão de Produtos (Criar, Editar, Deletar)
                        .requestMatchers(HttpMethod.POST, "/api/produtos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/produtos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/produtos/**").hasRole("ADMIN")

                        // Gestão de Categorias (Criar, Editar, Deletar)
                        .requestMatchers(HttpMethod.POST, "/api/categorias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/categorias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/categorias/**").hasRole("ADMIN")

                        // Gestão Geral
                        .requestMatchers("/api/estoque/**").hasRole("ADMIN")
                        .requestMatchers("/api/relatorios/**").hasRole("ADMIN")

                        // Upload de Imagens (Escrita)
                        .requestMatchers(HttpMethod.POST, "/api/upload/**").hasRole("ADMIN")

                        // Gestão de Cupons (CRUD completo)
                        // (Atenção: as rotas públicas de cupons acima têm prioridade sobre esta)
                        .requestMatchers("/api/cupons/**").hasRole("ADMIN")

                        // Gestão de Usuários (Listar todos, Banir, etc)
                        // (Atenção: /usuarios/perfil acima tem prioridade)
                        .requestMatchers("/api/usuarios/**").hasRole("ADMIN")

                        // ====================================================
                        // ⚙️ CONFIGURAÇÃO TÉCNICA
                        // ====================================================
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Permite o front-end local e domínio de produção (se houver)
        // Puxar de System.getenv, separando por virgula e removendo espaco
        List<String> allowedOrigins = System.getenv("CORS_ALLOWED_ORIGINS") != null ?
                List.of(System.getenv("CORS_ALLOWED_ORIGINS").split(","))
                        .stream()
                        .map(String::trim)
                        .toList()
                : List.of("http://localhost:3000");
        configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}