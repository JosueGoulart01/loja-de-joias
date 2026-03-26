"use client"

import type React from "react"
import { useProducts } from "@/contexts/product-context"
import { useCategories } from "@/contexts/category-context"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/image-upload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, X, Loader2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { ProductSize } from "@/types/product"
import { AdminRouteGuard } from "@/components/admin-route-guard"
import { useToast } from "@/hooks/use-toast"

export default function NewProductPage() {
  const { createProduct } = useProducts()
  const { categories, isLoading: isLoadingCategories } = useCategories()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    categoriaId: "",
    categoriaNome: "",
    material: "",
    code: "",
    currentPrice: 0,
    originalPrice: 0,
    onSale: false,
    description: "",
    imageUrl: "",
  })
  
  const [details, setDetails] = useState<string[]>([])
  const [newDetail, setNewDetail] = useState("")
  const [sizes, setSizes] = useState<ProductSize[]>([])
  const [newSize, setNewSize] = useState({ size: "", stock: 0 })

  const validCategories = categories.filter(cat => cat.id != null)

  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = categories.find(cat => cat.id?.toString() === categoryId)
    setFormData({
      ...formData,
      categoriaId: categoryId,
      categoriaNome: selectedCategory ? selectedCategory.nome : "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.categoriaId) {
      toast({ title: "Erro", description: "Selecione uma categoria.", variant: "destructive" })
      return
    }

    if (sizes.length === 0) {
        toast({ title: "Atenção", description: "Adicione pelo menos um tamanho/variante ao estoque.", variant: "destructive" })
        return
    }

    setIsSubmitting(true)
    try {
      // Cálculo automático do estoque geral baseado na soma das variantes
      const calculatedGeneralStock = sizes.reduce((acc, curr) => acc + curr.stock, 0);

      const payload = {
        ...formData,
        generalStock: calculatedGeneralStock, // Envia a soma calculada, ignorando input manual
        details,
        sizes 
      }

      // @ts-ignore
      await createProduct(payload)
      
      toast({ title: "Sucesso", description: "Produto criado com sucesso." })
      router.push("/perfil/admin/produtos")
    } catch (error) {
      console.error(error)
      toast({ title: "Erro", description: "Falha ao criar produto.", variant: "destructive" })
      setIsSubmitting(false)
    }
  }
  
  const addDetail = () => { if (newDetail.trim()) { setDetails([...details, newDetail.trim()]); setNewDetail("") } }
  const removeDetail = (index: number) => { setDetails(details.filter((_, i) => i !== index)) }
  
  const addSize = () => { 
    if (newSize.size.trim() && newSize.stock >= 0) { 
      setSizes([...sizes, { id: Date.now().toString(), size: newSize.size.trim(), stock: newSize.stock }])
      setNewSize({ size: "", stock: 0 }) 
    } 
  }
  const removeSize = (id: string) => { setSizes(sizes.filter((s) => s.id !== id)) }

  // Exibe o total calculado para o usuário
  const totalStockDisplay = sizes.reduce((acc, curr) => acc + curr.stock, 0);

  return (
    <AdminRouteGuard>
      <div className="w-full max-w-3xl mx-auto pb-10">
        <div className="mb-6">
          <Link href="/perfil/admin/produtos">
            <Button variant="ghost" className="gap-2"><ArrowLeft className="h-4 w-4"/> Voltar</Button>
          </Link>
        </div>
        <h1 className="mb-8 font-serif text-3xl font-bold text-center">Criar Novo Produto</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Dados Básicos</CardTitle></CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2"><Label>Nome</Label><Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}/></div>
               <div className="grid gap-4 md:grid-cols-2">
                 <div className="space-y-2">
                   <Label>Categoria</Label>
                   <Select value={formData.categoriaId} onValueChange={handleCategoryChange} disabled={isLoadingCategories}>
                     <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                     <SelectContent>{validCategories.map((cat) => <SelectItem key={cat.id} value={cat.id.toString()}>{cat.nome}</SelectItem>)}</SelectContent>
                   </Select>
                 </div>
                 <div className="space-y-2"><Label>Material</Label><Input required value={formData.material} onChange={(e) => setFormData({ ...formData, material: e.target.value })}/></div>
               </div>
               <div className="grid gap-4 md:grid-cols-2">
                 <div className="space-y-2"><Label>Código</Label><Input required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })}/></div>
                 
                 {/* CAMPO DE INPUT REMOVIDO - Agora mostramos apenas o total calculado */}
                 <div className="space-y-2">
                    <Label className="text-muted-foreground">Estoque Total (Automático)</Label>
                    <div className="h-10 px-3 py-2 bg-muted rounded-md text-sm flex items-center font-medium opacity-80 cursor-not-allowed">
                        {totalStockDisplay} unidades
                    </div>
                 </div>
               </div>
               
               <div className="space-y-2">
                 <Label>Imagem do Produto</Label>
                 <ImageUpload 
                   value={formData.imageUrl} 
                   onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                   disabled={isSubmitting}
                 />
               </div>
            </CardContent>
          </Card>

          <Card>
             <CardHeader><CardTitle>Preços</CardTitle></CardHeader>
             <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Preço Atual</Label><Input type="number" required value={formData.currentPrice} onChange={(e) => setFormData({ ...formData, currentPrice: Number(e.target.value) })}/></div>
                <div className="space-y-2"><Label>Preço Original</Label><Input type="number" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}/></div>
                <div className="flex items-center space-x-2"><Checkbox checked={formData.onSale} onCheckedChange={(c) => setFormData({...formData, onSale: !!c})}/><Label>Promoção</Label></div>
             </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Descrição</CardTitle></CardHeader>
            <CardContent>
              <Textarea 
                required 
                placeholder="Descreva o produto..."
                className="min-h-[120px]"
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Produto</CardTitle>
              <p className="text-sm text-muted-foreground">Adicione características como material, acabamento, etc.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {details.map((d, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input value={d} readOnly />
                    <Button type="button" size="icon" variant="ghost" onClick={() => removeDetail(i)}>
                      <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  value={newDetail} 
                  onChange={(e) => setNewDetail(e.target.value)} 
                  placeholder="Ex: Prata 925, Pedra Zircônia..." 
                  onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); addDetail(); } }}
                />
                <Button type="button" onClick={addDetail} variant="secondary"><Plus className="w-4 h-4 mr-2"/> Adicionar</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">Variantes e Estoque</CardTitle>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3 text-orange-500" />Adicione as variantes. O estoque total será a soma delas.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {sizes.map((size) => (
                <div key={size.id} className="flex items-center gap-2 rounded-lg border bg-card p-3">
                  <span className="flex-1 font-medium">Tamanho {size.size}</span>
                  <div className="flex items-center gap-1">
                    <span className="w-12 text-center font-medium">Estoque: {size.stock}</span>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeSize(size.id)} className="h-8 w-8 text-destructive"><X className="h-4 w-4" /></Button>
                </div>
              ))}
              <div className="flex gap-2 pt-4 border-t border-orange-200">
                <Input placeholder="Tam" value={newSize.size} onChange={(e) => setNewSize({ ...newSize, size: e.target.value })} className="w-24" />
                <Input type="number" placeholder="Qtd" value={newSize.stock} onChange={(e) => setNewSize({ ...newSize, stock: Number(e.target.value) })} className="w-24" />
                <Button type="button" onClick={addSize}><Plus className="h-4 w-4"/> Add</Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex gap-4">
            <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin" /> : "Criar Produto"}</Button>
            <Link href="/perfil/admin/produtos" className="flex-1"><Button variant="outline" size="lg" className="w-full">Cancelar</Button></Link>
          </div>
        </form>
      </div>
    </AdminRouteGuard>
  )
}