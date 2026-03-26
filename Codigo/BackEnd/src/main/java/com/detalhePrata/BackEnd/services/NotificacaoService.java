package com.detalhePrata.BackEnd.services;

import com.detalhePrata.BackEnd.dtos.NotificacaoDTO;
import com.detalhePrata.BackEnd.models.Cupom;
import com.detalhePrata.BackEnd.models.PessoaFisica;
import com.detalhePrata.BackEnd.models.Usuario;
import com.detalhePrata.BackEnd.models.enums.PreferenciaContato;
import com.detalhePrata.BackEnd.repositories.CupomRepository;
import com.detalhePrata.BackEnd.repositories.UsuarioRepository;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificacaoService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CupomRepository cupomRepository;

    @Autowired
    private Environment env;

    // Injeção das chaves que configuramos no application.properties
    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.phone-number}")
    private String fromWhatsAppNumber;

    // Inicializa a Twilio assim que o Spring sobe
    @PostConstruct
    public void initTwilio() {
        if (accountSid != null && !accountSid.isBlank()) {
            try {
                Twilio.init(accountSid, authToken);
                System.out.println("✅ Twilio inicializado com sucesso.");
            } catch (Exception e) {
                System.err.println("❌ Erro ao inicializar Twilio: " + e.getMessage());
            }
        }
    }

    public void enviarNotificacaoEmMassa(NotificacaoDTO dados) {
        List<Usuario> usuarios = usuarioRepository.findAll();

        // Monta a mensagem base
        String mensagemBase = dados.mensagem();
        if (dados.codigoCupom() != null && !dados.codigoCupom().isBlank()) {
            Optional<Cupom> cupomOpt = cupomRepository.findByCodigo(dados.codigoCupom().toUpperCase());
            if (cupomOpt.isPresent()) {
                // Formatação negrito do WhatsApp (*texto*)
                mensagemBase += "\n\n🎁 Use o cupom: *" + dados.codigoCupom() + "* para ganhar desconto!";
            }
        }

        System.out.println("🔄 Iniciando envio de notificações...");

        for (Usuario usuario : usuarios) {
            // Pula usuários inativos
            if (!usuario.isAtivo()) continue;

            if (usuario instanceof PessoaFisica pf) {
                processarEnvioPessoaFisica(pf, dados.titulo(), mensagemBase, dados.enviarParaTodos());
            } else {
                // PJ recebe por e-mail
                enviarEmail(usuario.getEmail(), dados.titulo(), mensagemBase);
            }
        }
    }

    private void processarEnvioPessoaFisica(PessoaFisica pf, String titulo, String msg, boolean forcarTodos) {
        // Envia E-mail se for a preferência OU se for envio forçado para todos
        if (forcarTodos || pf.getPreferenciaContato() == PreferenciaContato.EMAIL) {
            enviarEmail(pf.getEmail(), titulo, msg);
        }

        // Envia WhatsApp se for a preferência OU se for envio forçado para todos
        if (forcarTodos || pf.getPreferenciaContato() == PreferenciaContato.WHATSAPP) {
            // WhatsApp não tem "Assunto", então colocamos o título em negrito no corpo
            String msgWhatsApp = "*" + titulo + "*\n\n" + msg;
            enviarWhatsappReal(pf.getTelefone(), msgWhatsApp);
        }
    }

    private void enviarEmail(String destinatario, String assunto, String corpo) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(env.getProperty("spring.mail.username","contatodetalheprata@gmail.com"));
            message.setTo(destinatario);
            message.setSubject(assunto);
            message.setText(corpo);
            mailSender.send(message);
            System.out.println("📧 E-mail enviado para: " + destinatario);
        } catch (Exception e) {
            System.err.println("❌ Falha ao enviar e-mail para " + destinatario);
        }
    }

    private void enviarWhatsappReal(String telefoneUsuario, String corpoMensagem) {
        try {
            String numeroFormatado = formatarParaE164(telefoneUsuario);

            Message message = Message.creator(
                    new PhoneNumber("whatsapp:" + numeroFormatado), // Destino
                    new PhoneNumber(fromWhatsAppNumber),            // Origem (Sandbox)
                    corpoMensagem
            ).create();

            System.out.println("📱 WhatsApp enviado para " + numeroFormatado + " | SID: " + message.getSid());

        } catch (com.twilio.exception.ApiException e) {
            System.err.println("❌ Erro Twilio (" + telefoneUsuario + "): " + e.getMessage());
            if (e.getCode() == 63015) {
                System.err.println("⚠️ DICA: O número " + telefoneUsuario + " não está cadastrado na Sandbox.");
                System.err.println("⚠️ Peça para o usuário enviar 'join <codigo>' para o número da Twilio.");
            }
        } catch (Exception e) {
            System.err.println("❌ Erro genérico WhatsApp: " + e.getMessage());
        }
    }

    // Formata números brasileiros (ex: 11999998888 -> +5511999998888)
    private String formatarParaE164(String telefone) {
        if (telefone == null) return "";
        String limpo = telefone.replaceAll("\\D", "");

        // Se tiver 10 ou 11 dígitos (DDD + Número), adiciona +55
        if (limpo.length() >= 10 && limpo.length() <= 11) {
            return "+55" + limpo;
        }
        // Se já tiver 13 dígitos (55 + DDD + Numero), só põe o +
        if (limpo.length() == 13) {
            return "+" + limpo;
        }
        return "+" + limpo;
    }
}