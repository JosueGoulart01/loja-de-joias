"use client"

import { useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button" // Supondo que você usa shadcn/ui ou similar

export default function StripeCheckoutForm({ pedidoId }: { pedidoId: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Redireciona para uma página de sucesso
        return_url: `${window.location.origin}/pedido/sucesso/${pedidoId}`,
      },
    })

    if (error) {
      setErrorMessage(error.message || "Erro no pagamento")
      toast({
        title: "Erro no pagamento",
        description: error.message,
        variant: "destructive",
      })
    }
    
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
      <Button 
        type="submit" 
        disabled={!stripe || isLoading} 
        className="w-full bg-slate-900 text-white"
      >
        {isLoading ? "Processando..." : "Pagar Agora"}
      </Button>
    </form>
  )
}