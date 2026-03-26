"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Carrega a chave pública do .env.local
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// --- COMPONENTE DO FORMULÁRIO INTERNO ---
function StripeForm({ pedidoId, valor }: { pedidoId: string; valor: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // IMPORTANTE: Redirecionamento após o sucesso
        // Ajuste a rota se sua página de detalhes for diferente
        return_url: `${window.location.origin}/perfil/pedidos/${pedidoId}`,
      },
    });

    // Se chegou aqui, deu erro (se der certo, o stripe redireciona antes)
    if (error) {
      setMessage(error.message || "Ocorreu um erro inesperado.");
      toast({
        title: "Erro no pagamento",
        description: error.message,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <PaymentElement options={{ layout: "tabs" }} />
      
      {message && (
        <div className="text-destructive text-sm bg-destructive/10 p-3 rounded border border-destructive/20">
          {message}
        </div>
      )}

      <Button 
        disabled={isLoading || !stripe || !elements} 
        className="w-full btn-luxury h-12 text-base font-medium"
      >
        {isLoading ? <Loader2 className="animate-spin mr-2" /> : `Pagar R$ ${valor.toFixed(2)}`}
      </Button>

      <div className="flex justify-center text-xs text-muted-foreground items-center gap-1.5 pt-2">
        <Lock className="h-3 w-3" /> Pagamento processado de forma segura via Stripe.
      </div>
    </form>
  );
}

// --- PÁGINA PRINCIPAL ---
export default function PagamentoPage() {
  const params = useParams();
  const pedidoId = params.id as string;
  const [clientSecret, setClientSecret] = useState("");
  const [valorPedido, setValorPedido] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        // 1. Busca detalhes do pedido para exibir valor e validar existência
        const resPedido = await api.get(`/pedidos/${pedidoId}`);
        setValorPedido(resPedido.data.valor);

        // 2. Cria a Intent no Backend
        const resIntent = await api.post("/pagamento/intent", { pedidoId: Number(pedidoId) });
        setClientSecret(resIntent.data.clientSecret);
      } catch (error) {
        console.error("Erro ao iniciar pagamento", error);
        toast({
            title: "Erro",
            description: "Não foi possível iniciar o pagamento. Verifique se o pedido existe ou se já foi pago.",
            variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (pedidoId) fetchPaymentData();
  }, [pedidoId, toast]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        {loading ? (
          <div className="text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
            <p className="luxury-subtitle text-sm tracking-widest animate-pulse">Iniciando ambiente seguro...</p>
          </div>
        ) : (
          <div className="w-full max-w-md space-y-8 fade-in">
            <div className="text-center space-y-2">
              <h1 className="luxury-title text-3xl">Finalizar Compra</h1>
              <p className="text-muted-foreground">Pedido #{pedidoId}</p>
            </div>

            <Card className="border-border/50 shadow-lg">
              <CardHeader className="text-center pb-2 border-b border-border/40 bg-muted/20">
                <div className="mx-auto bg-primary/5 p-3 rounded-full w-fit mb-2 ring-1 ring-primary/10">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-serif font-normal text-xl">Pagamento Seguro</CardTitle>
                <CardDescription>Insira os dados do seu cartão</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {clientSecret && (
                  <Elements 
                    stripe={stripePromise} 
                    options={{ 
                      clientSecret, 
                      appearance: { 
                        theme: 'stripe',
                        variables: {
                          colorPrimary: '#000000', // Ajuste para sua cor primária
                          fontFamily: 'var(--font-geist-sans), sans-serif',
                        }
                      } 
                    }}
                  >
                    <StripeForm pedidoId={pedidoId} valor={valorPedido} />
                  </Elements>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}