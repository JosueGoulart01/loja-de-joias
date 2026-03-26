"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Truck, FileText, Loader2 } from "lucide-react"
import { api } from "@/services/api"
import { useToast } from "@/hooks/use-toast"

interface AdminTrackingDialogProps {
  pedidoId: number
  onSuccess: () => void
}

export function AdminTrackingDialog({ pedidoId, onSuccess }: AdminTrackingDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [codigo, setCodigo] = useState("")
  const [urlNota, setUrlNota] = useState("")
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!codigo) {
      toast({ title: "Erro", description: "Informe o código de rastreio.", variant: "destructive" })
      return
    }

    setIsLoading(true)
    try {
      // Chama o endpoint REQ 5
      await api.patch(`/pedidos/${pedidoId}/rastreio`, {
        codigoRastreio: codigo,
        urlNotaFiscal: urlNota
      })

      toast({ 
        title: "Pedido Enviado!", 
        description: "Status atualizado e e-mail enviado ao cliente." 
      })
      
      setOpen(false)
      onSuccess() // Atualiza a lista pai
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao atualizar rastreio.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Truck className="h-4 w-4" />
          Enviar / Rastreio
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Despachar Pedido #{pedidoId}</DialogTitle>
          <DialogDescription>
            Informe os dados de envio. O status mudará para <b>ENVIADO</b> e o cliente receberá um e-mail.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="codigo" className="flex items-center gap-2">
               <Truck className="h-4 w-4" /> Código de Rastreio
            </Label>
            <Input
              id="codigo"
              placeholder="Ex: AA123456789BR"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nota" className="flex items-center gap-2">
               <FileText className="h-4 w-4" /> Link da Nota Fiscal (Opcional)
            </Label>
            <Input
              id="nota"
              placeholder="https://nfe.fazenda..."
              value={urlNota}
              onChange={(e) => setUrlNota(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading} className="btn-luxury w-full">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Confirmar Envio"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}