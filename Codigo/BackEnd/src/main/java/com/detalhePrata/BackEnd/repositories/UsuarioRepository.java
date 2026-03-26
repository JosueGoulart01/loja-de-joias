package com.detalhePrata.BackEnd.repositories;

import com.detalhePrata.BackEnd.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    Optional<Usuario> findByTokenResetSenha(String tokenResetSenha);
    
    List<Usuario> findByAtivoTrue();
    
    List<Usuario> findByRole(String role);
    
    @Query("SELECT u FROM Usuario u WHERE u.email LIKE %:email%")
    List<Usuario> findByEmailContaining(@Param("email") String email);
    
    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.ativo = true")
    Long countUsuariosAtivos();
    
    @Query("SELECT u FROM Usuario u WHERE u.role = 'ADMIN'")
    List<Usuario> findAdministradores();
}