package com.detalhePrata.BackEnd.controllers;

import com.detalhePrata.BackEnd.dtos.NotificacaoDTO;
import com.detalhePrata.BackEnd.services.NotificacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notificacoes")
public class NotificacaoController {

    @Autowired
    private NotificacaoService notificacaoService;

    @PostMapping("/enviar")
    public ResponseEntity<String> enviarNotificacao(@RequestBody NotificacaoDTO dados) {
        // Chama o serviço que decide se manda E-mail ou WhatsApp
        notificacaoService.enviarNotificacaoEmMassa(dados);

        return ResponseEntity.ok("Disparo de notificações iniciado! Verifique o console para logs de envio.");
    }
}