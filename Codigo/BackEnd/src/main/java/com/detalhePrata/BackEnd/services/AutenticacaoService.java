package com.detalhePrata.BackEnd.services;

import com.detalhePrata.BackEnd.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AutenticacaoService implements UserDetailsService {

    @Autowired
    private UsuarioRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Lógica corrigida para trabalhar com Optional, lançando exceção se não encontrar.
        return repository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Dados de usuário inválidos."));
    }
}