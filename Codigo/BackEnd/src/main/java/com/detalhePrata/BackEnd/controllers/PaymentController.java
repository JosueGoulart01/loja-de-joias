package com.detalhePrata.BackEnd.controllers;

import com.detalhePrata.BackEnd.dtos.PaymentIntentRequestDTO;
import com.detalhePrata.BackEnd.dtos.PaymentResponseDTO;
import com.detalhePrata.BackEnd.services.PaymentService;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pagamento")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/intent")
    public ResponseEntity<PaymentResponseDTO> createIntent(@RequestBody PaymentIntentRequestDTO request) throws StripeException {
        return ResponseEntity.ok(paymentService.createPaymentIntent(request.pedidoId()));
    }
}