package com.detalhePrata.BackEnd.services;

import com.detalhePrata.BackEnd.dtos.PaymentResponseDTO;
import com.detalhePrata.BackEnd.models.Pedido;
import com.detalhePrata.BackEnd.models.Usuario;
import com.detalhePrata.BackEnd.repositories.PedidoRepository;
import com.detalhePrata.BackEnd.repositories.UsuarioRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class PaymentService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository; // Injeção Correta

    @Transactional
    public PaymentResponseDTO createPaymentIntent(Long pedidoId) throws StripeException {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        if ("PAGO".equalsIgnoreCase(pedido.getStatus()) || "Pagamento aprovado".equalsIgnoreCase(pedido.getStatus())) {
            throw new RuntimeException("Este pedido já está pago.");
        }

        long amountInCents = pedido.getValor().multiply(new BigDecimal(100)).longValue();

        // LÓGICA CORRIGIDA: Busca usuário pelo ID do repositório
        String userEmail = "guest@detalheprata.com";
        if (pedido.getUsuarioId() != null) {
            userEmail = usuarioRepository.findById(pedido.getUsuarioId())
                    .map(Usuario::getEmail)
                    .orElse(userEmail);
        }

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("brl")
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .putMetadata("pedido_id", pedido.getId().toString())
                .putMetadata("usuario_email", userEmail)
                .build();

        PaymentIntent intent = PaymentIntent.create(params);

        return new PaymentResponseDTO(intent.getClientSecret());
    }
}