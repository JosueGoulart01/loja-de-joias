"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast" // Verifique se o caminho do hook é este ou @/components/ui/use-toast
import { Send, Megaphone, Ticket } from "lucide-react"

export default function MarketingPage() {
  const { usuario } = useAuth() // O token geralmente está armazenado no localStorage, vamos pegá-lo no fetch
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: "",
    mensagem: "",
    codigoCupom: "",
    enviarParaTodos: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Recupera o token diretamente do localStorage para garantir
    const token = localStorage.getItem("authToken")

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/notificacoes/enviar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Autenticação é obrigatória
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Erro ao conectar com o servidor.")
      }

      toast({
        title: "Disparo Iniciado! 🚀",
        description: "As mensagens estão sendo enviadas para a fila de processamento.",
        variant: "default", 
        className: "bg-green-600 text-white border-none"
      })

      // Limpa o formulário
      setFormData({ titulo: "", mensagem: "", codigoCupom: "", enviarParaTodos: false })

    } catch (error) {
      console.error(error)
      toast({
        title: "Erro no envio",
        description: "Verifique se o backend está rodando e se você é Admin.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">Marketing & Notificações</h1>
        <p className="text-muted-foreground">Envie ofertas e cupons para seus clientes via WhatsApp e E-mail.</p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" /> Nova Campanha
          </CardTitle>
          <CardDescription>
            Preencha os dados abaixo para disparar uma notificação em massa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEnviar} className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="titulo">Título da Campanha (Assunto do E-mail)</Label>
              <Input
                id="titulo"
                name="titulo"
                placeholder="Ex: 🎄 Oferta Especial de Natal!"
                value={formData.titulo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mensagem">Mensagem Principal</Label>
              <Textarea
                id="mensagem"
                name="mensagem"
                placeholder="Escreva sua mensagem aqui..."
                className="min-h-[150px]"
                value={formData.mensagem}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 p-4 border rounded-md bg-muted/20">
                    <Label htmlFor="codigoCupom" className="flex items-center gap-2">
                        <Ticket className="h-4 w-4" /> Código do Cupom (Opcional)
                    </Label>
                    <Input
                        id="codigoCupom"
                        name="codigoCupom"
                        placeholder="Ex: NATAL10"
                        value={formData.codigoCupom}
                        onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground">
                        Se informado, validaremos e anexaremos ao final da mensagem.
                    </p>
                </div>

                <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <Checkbox 
                        id="enviarParaTodos" 
                        checked={formData.enviarParaTodos}
                        onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, enviarParaTodos: checked as boolean }))
                        }
                    />
                    <div className="space-y-1 leading-none">
                        <Label htmlFor="enviarParaTodos" className="font-bold cursor-pointer">
                        Forçar envio MULTICANAL
                        </Label>
                        <p className="text-sm text-muted-foreground text-balance">
                        Se marcado, enviará <b>E-mail E WhatsApp</b> para todos, ignorando a preferência do cliente.
                        </p>
                    </div>
                </div>
            </div>

            <Button type="submit" size="lg" className="w-full btn-luxury" disabled={loading}>
              {loading ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Disparar Campanha
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}