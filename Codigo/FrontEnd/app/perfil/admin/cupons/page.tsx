"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Search, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useCoupons, type Coupon } from "@/contexts/coupon-context"

type DiscountType = "PORCENTAGEM" | "VALOR_FIXO"
type CouponType = "CNPJ" | "CPF"

export default function CuponsAdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { coupons, isLoading, createCoupon, updateCoupon, deleteCoupon, toggleCouponStatus } = useCoupons()

  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [selectedCouponType, setSelectedCouponType] = useState<CouponType>("CNPJ")
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [discountType, setDiscountType] = useState<DiscountType>("PORCENTAGEM")
  const [isActive, setIsActive] = useState(true)
  const [discountValue, setDiscountValue] = useState("10")
  const [minOrderValue, setMinOrderValue] = useState("400.00")
  const [couponCode, setCouponCode] = useState("")
  const [usageLimit, setUsageLimit] = useState("100")

  const filteredCoupons = (coupons || []).filter((coupon) =>
    coupon.codigo.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateCoupon = (type: CouponType) => {
    setSelectedCouponType(type)
    setEditingCoupon(null)
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setSelectedCouponType(coupon.tipoCNPJ ? "CNPJ" : "CPF")
    setDiscountType(coupon.tipoDesconto)
    setIsActive(coupon.ativo)
    setDiscountValue(coupon.valor.toString())
    setMinOrderValue(coupon.valorMinimoPedido.toFixed(2))
    setCouponCode(coupon.codigo)
    setUsageLimit(coupon.quantidadeUsos.toString())
    setIsDialogOpen(true)
  }

  const handleDeleteCoupon = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este cupom?")) {
      await deleteCoupon(id)
    }
  }

  const handleToggleActive = async (id: number) => {
    await toggleCouponStatus(id)
  }

  const resetForm = () => {
    setDiscountType("PORCENTAGEM")
    setIsActive(true)
    setDiscountValue("10")
    setMinOrderValue("400.00")
    setCouponCode("")
    setUsageLimit("100")
  }

  const handleSaveCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o código do cupom.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const couponData = {
        codigo: couponCode.toUpperCase(),
        tipoDesconto: discountType,
        valor: Number.parseFloat(discountValue),
        valorMinimoPedido: Number.parseFloat(minOrderValue),
        quantidadeUsos: Number.parseInt(usageLimit),
        ativo: isActive,
        tipoCNPJ: selectedCouponType === "CNPJ",
      }

      if (editingCoupon) {
        await updateCoupon(editingCoupon.id, couponData)
      } else {
        await createCoupon(couponData)
      }

      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Erro ao salvar cupom:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Loja
        </Button>

        <h1 className="luxury-title text-3xl md:text-4xl text-foreground mb-2">Gerenciar Descontos</h1>
      </div>

      {/* Create Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button onClick={() => handleCreateCoupon("CNPJ")} className="btn-luxury flex-1" size="lg">
          Criar Novo Cupom CNPJ
        </Button>
        <Button onClick={() => handleCreateCoupon("CPF")} className="btn-luxury flex-1" size="lg">
          Criar Novo Cupom CPF
        </Button>
      </div>

      {/* Coupons List */}
      <Card className="p-6">
        <h2 className="luxury-subtitle text-lg mb-4">Cupons cadastrados</h2>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cupom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                {/* 1. ADICIONADO: text-center para centralizar o título */}
                <TableHead className="text-center">Progresso de Uso</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : filteredCoupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum cupom encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredCoupons.map((coupon) => {
                  const percentUsed = ((coupon.quantidadeUsos - coupon.usosRestantes) / coupon.quantidadeUsos) * 100
                  const isExhausted = coupon.usosRestantes === 0
                  const usados = coupon.quantidadeUsos - coupon.usosRestantes

                  return (
                    <TableRow key={coupon.id} className={isExhausted ? "bg-muted/30 opacity-90" : ""}>
                      {/* Código + Badge Esgotado */}
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="flex items-center gap-2">
                            {coupon.codigo}
                            {isExhausted && <AlertCircle className="h-3 w-3 text-destructive" />}
                          </span>
                          {isExhausted && (
                            <span className="text-[10px] text-destructive font-bold uppercase tracking-wider">
                              Esgotado
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        {coupon.tipoDesconto === "PORCENTAGEM" ? `${coupon.valor}%` : `R$ ${coupon.valor.toFixed(2)}`}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch checked={coupon.ativo} onCheckedChange={() => handleToggleActive(coupon.id)} />
                          <span className="text-xs text-muted-foreground">{coupon.ativo ? "Ativo" : "Inativo"}</span>
                        </div>
                      </TableCell>

                      {/* Barra de Progresso MELHORADA */}
                      <TableCell>
                        {/* 2. ADICIONADO: mx-auto para centralizar o bloco na coluna */}
                        <div className="w-full max-w-[140px] mx-auto">
                          
                          {/* Texto alinhado e mais limpo */}
                          <div className="flex justify-between items-end text-xs mb-1.5 px-1">
                            <span className={isExhausted ? "text-destructive font-bold" : "font-medium text-foreground"}>
                              {usados}
                            </span>
                            <span className="text-muted-foreground text-[10px] uppercase tracking-wide">
                              de {coupon.quantidadeUsos} usados
                            </span>
                          </div>
                          
                          {/* Barra um pouco mais alta (h-2.5) para destaque */}
                          <div className="h-2.5 w-full bg-secondary/50 rounded-full overflow-hidden border border-border/50">
                            <div 
                              className={`h-full transition-all duration-500 rounded-full ${
                                isExhausted ? "bg-destructive" : "bg-primary"
                              }`}
                              style={{ width: `${percentUsed}%` }}
                            />
                          </div>
                          
                          {isExhausted && (
                            <p className="text-[10px] text-destructive mt-1 text-center font-medium">Limites Atingidos</p>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditCoupon(coupon)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCoupon(coupon.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="luxury-title text-2xl">
              {editingCoupon ? "Editar Desconto" : `Criar Desconto ${selectedCouponType}`}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">Tipo de desconto por {selectedCouponType}</p>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Discount Type */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base">Tipo de desconto</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Ativa/Desativar</span>
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                </div>
              </div>
              <RadioGroup
                value={discountType}
                onValueChange={(value) => setDiscountType(value as DiscountType)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PORCENTAGEM" id="percentage" />
                  <Label htmlFor="percentage">Porcentagem</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="VALOR_FIXO" id="fixed" />
                  <Label htmlFor="fixed">Valor Fixo</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Value Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{discountType === "PORCENTAGEM" ? "Valor da Porcentagem" : "Valor Fixo (R$)"}</Label>
                <Input
                  type="number"
                  placeholder={discountType === "PORCENTAGEM" ? "10" : "50.00"}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  step={discountType === "PORCENTAGEM" ? "1" : "0.01"}
                />
              </div>
              <div className="space-y-2">
                <Label>Valor mínimo do Pedido (R$)</Label>
                <Input
                  type="number"
                  placeholder="400.00"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(e.target.value)}
                  step="0.01"
                />
              </div>
            </div>

            {/* Coupon Code and Usage */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Código do Cupom</Label>
                <Input
                  placeholder="BEMVINDO"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="uppercase"
                  // Removi o disabled na edição para permitir corrigir typos, 
                  // o backend cuida de não deixar duplicar
                />
              </div>
              <div className="space-y-2">
                <Label>Quantidade Total de Usos</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                />
                {editingCoupon && (
                   <p className="text-[10px] text-muted-foreground">
                     Aumentar este valor reabastecerá o cupom.
                   </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button onClick={handleSaveCoupon} className="btn-luxury w-full" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full" disabled={isSaving}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}