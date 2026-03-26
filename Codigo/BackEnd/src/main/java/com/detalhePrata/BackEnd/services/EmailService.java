package com.detalhePrata.BackEnd.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private Environment env;

    public void sendPasswordResetEmail(String to, String token) {
        String resetUrl = env.getProperty("website.url", "http://localhost:3000") + "/resetar-senha?token=" + token;
        String subject = "Redefinição de Senha - Detalhe Prata";
        String body = "Olá,\n\n" +
                "Você solicitou a redefinição da sua senha. Clique no link abaixo para criar uma nova senha:\n\n" +
                resetUrl + "\n\n" +
                "Se você não solicitou isso, por favor, ignore este e-mail.\n\n" +
                "Atenciosamente,\nEquipe Detalhe Prata";
        sendEmail(to, subject, body);
    }

    public void enviarEmailResetSenha(String to, String token) {
        sendPasswordResetEmail(to, token);
    }

    public void enviarEmailConfirmacaoCadastro(String to, String nome) {
        String subject = "Bem-vindo ao Detalhe Prata!";
        String body = "Olá " + nome + ",\n\n" +
                "Seu cadastro foi realizado com sucesso!\n\n" +
                "Agora você pode aproveitar todos os nossos produtos e benefícios.\n\n" +
                "Atenciosamente,\nEquipe Detalhe Prata";
        sendEmail(to, subject, body);
    }

    public void enviarEmailBoasVindas(String to, String nome) {
        String subject = "Boas-vindas ao Detalhe Prata!";
        String body = "Olá " + nome + ",\n\n" +
                "Seja muito bem-vindo(a) à nossa loja!\n\n" +
                "Estamos muito felizes em tê-lo(a) conosco.\n\n" +
                "Atenciosamente,\nEquipe Detalhe Prata";
        sendEmail(to, subject, body);
    }

    public void enviarEmailConfirmacaoPedido(String to, String nome, String numeroPedido) {
        String subject = "Confirmação de Pedido - Detalhe Prata";
        String body = "Olá " + nome + ",\n\n" +
                "Seu pedido #" + numeroPedido + " foi confirmado com sucesso!\n\n" +
                "Acompanhe o status do seu pedido em nossa plataforma.\n\n" +
                "Atenciosamente,\nEquipe Detalhe Prata";
        sendEmail(to, subject, body);
    }

    // --- NOVO MÉTODO REQ 5 ---
    public void enviarEmailRastreio(String to, String numeroPedido, String codigoRastreio) {
        String subject = "Pedido #" + numeroPedido + " Enviado! - Detalhe Prata";
        String body = "Olá,\n\n" +
                "Boas notícias! Seu pedido #" + numeroPedido + " já está a caminho.\n\n" +
                "Código de Rastreio: " + codigoRastreio + "\n\n" +
                "Você pode acompanhar a entrega pelo site dos Correios ou em 'Meus Pedidos' no nosso site.\n\n" +
                "Atenciosamente,\nEquipe Detalhe Prata";
        sendEmail(to, subject, body);
    }

    public void enviarEmailMarketing(String to, String assunto, String mensagem) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("[Oferta Detalhe Prata] " + assunto);
        message.setText(mensagem + "\n\nPara cancelar a inscrição, responda este e-mail.");
        mailSender.send(message);
    }

    // Método auxiliar para evitar repetição
    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}