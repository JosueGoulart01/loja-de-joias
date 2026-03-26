package com.detalhePrata.BackEnd.controllers;

import com.detalhePrata.BackEnd.models.Pedido;
import com.detalhePrata.BackEnd.repositories.PedidoRepository;
import com.detalhePrata.BackEnd.services.PedidoService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pagamento")
public class StripeWebhookController {

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private PedidoService pedidoService; // Para usar o setStatus que grava histórico

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeEvent(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        if (sigHeader == null) return ResponseEntity.badRequest().build();

        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Assinatura inválida");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro no parse");
        }

        if ("payment_intent.succeeded".equals(event.getType())) {
            // O objeto dentro do evento é um PaymentIntent
            PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer().getObject().orElse(null);

            if (paymentIntent != null) {
                String pedidoIdStr = paymentIntent.getMetadata().get("pedido_id");
                if (pedidoIdStr != null) {
                    Long pedidoId = Long.parseLong(pedidoIdStr);

                    Pedido pedido = pedidoRepository.findById(pedidoId).orElse(null);
                    if (pedido != null) {
                        // Atualiza o pedido de forma segura usando seu Service existente
                        pedidoService.setStatus(pedido, "Pagamento aprovado");

                        // Opcional: Salvar o ID da transação do Stripe
                        pedido.setCodigoPagamento(paymentIntent.getId());
                        pedidoRepository.save(pedido);

                        System.out.println("✅ Pedido #" + pedidoId + " pago com sucesso via Stripe!");
                    }
                }
            }
        }

        return ResponseEntity.ok("Recebido");
    }
}