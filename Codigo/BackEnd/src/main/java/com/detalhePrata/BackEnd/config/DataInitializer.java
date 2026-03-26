package com.detalhePrata.BackEnd.config;

import com.detalhePrata.BackEnd.models.Categoria;
import com.detalhePrata.BackEnd.models.PessoaFisica;
import com.detalhePrata.BackEnd.models.enums.PreferenciaContato;
import com.detalhePrata.BackEnd.repositories.CategoriaRepository;
import com.detalhePrata.BackEnd.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // --- 1. LÓGICA DE ATUALIZAÇÃO FORÇADA DO ADMIN ---
        Optional<PessoaFisica> adminOpt = usuarioRepository.findByEmail("admin@detalheprata.com")
                .filter(PessoaFisica.class::isInstance)
                .map(PessoaFisica.class::cast);

        PessoaFisica admin;
        if (adminOpt.isEmpty()) {
            admin = new PessoaFisica();
            admin.setEmail("admin@detalheprata.com");
            admin.setSenha(passwordEncoder.encode("admin123"));
            admin.setNome("Admin");
            admin.setSobrenome("do Sistema");
            admin.setCpf("00000000000");
            admin.setTelefone("00000000000");
            admin.setDataNascimento(LocalDate.of(1990, 1, 1));
            admin.setPreferenciaContato(PreferenciaContato.EMAIL);
            System.out.println(">>> Usuário ADMIN padrão CRIADO. <<<");
        } else {
            admin = adminOpt.get();
            System.out.println(">>> Usuário ADMIN encontrado. Verificando permissão... <<<");
        }

        // Tente usar o Enum se possível, ou String se seu banco estiver assim
        // admin.setRole(UserRole.ADMIN);
        admin.setRole("ADMIN");

        usuarioRepository.save(admin);
        System.out.println(">>> Permissão de ADMIN garantida para admin@detalheprata.com <<<");

        // --- 2. LÓGICA DE CRIAÇÃO DAS CATEGORIAS ---
        if (categoriaRepository.count() == 0) {
            System.out.println(">>> Criando categorias padrão... <<<");

            List<String> nomes = List.of(
                    "Lançamento/Reposição", "Anéis", "Brincos", "Trios",
                    "Colares", "Conjuntos", "Pulseiras", "Berloques",
                    "Masculino", "Suprimentos"
            );

            List<Categoria> categoriasParaSalvar = new ArrayList<>();

            for (String nome : nomes) {
                Categoria c = new Categoria();
                c.setNome(nome);
                c.setAtiva(true);
                categoriasParaSalvar.add(c);
            }

            categoriaRepository.saveAll(categoriasParaSalvar);
            System.out.println(">>> " + categoriasParaSalvar.size() + " categorias padrão criadas com sucesso! <<<");
        }
    }
}