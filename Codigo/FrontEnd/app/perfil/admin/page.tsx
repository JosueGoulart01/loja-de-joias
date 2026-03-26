"use client"

import { useEffect, useState } from "react" // Adicionado useEffect
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Tag, Gift, BarChart3, TrendingUp, ShoppingBag, DollarSign, Settings, AlertCircle, Eye, ShoppingCart, Clock, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useProducts } from "@/contexts/product-context"
import { useCoupons } from "@/contexts/coupon-context"
import { useCategories } from "@/contexts/category-context"
import { api } from "@/services/api" // Importar API

export default function AdminPage() {
  const { products } = useProducts()
  const { coupons } = useCoupons()
  const { categories } = useCategories()
  
  // --- ESTADOS PARA DADOS REAIS DO BACKEND ---
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [topSellingProducts, setTopSellingProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // --- BUSCA DADOS REAIS ---
  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Busca dados gerais (incluindo gráfico)
        const today = new Date()
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]
        
        // Chama endpoint do dashboard (usando datas deste mês apenas para KPIs, mas o gráfico vem junto)
        const dashRes = await api.post("/relatorios/dashboard", { 
            dataInicio: "2024-01-01", // Pega desde o início do ano para garantir dados no gráfico
            dataFim: endOfMonth 
        })
        setDashboardData(dashRes.data)

        // 2. Busca Top 5 produtos
        const topRes = await api.post("/relatorios/mais-vendidos", {
            dataInicio: "2024-01-01",
            dataFim: endOfMonth,
            ordenarPor: "quantity"
        })
        setTopSellingProducts(topRes.data.slice(0, 5))

      } catch (error) {
        console.error("Erro ao carregar dashboard:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // --- MÉTRICAS LOCAIS (Do Contexto) ---
  const lowStockProducts = products?.filter((p) => (p.generalStock || 0) < 10)?.length || 0
  const productsOnSale = products?.filter((p) => p.onSale)?.length || 0
  const totalRevenueStock = products?.reduce((sum, p) => sum + (p.currentPrice || 0) * (p.generalStock || 0), 0) || 0
  const activeCoupons = coupons?.filter((c) => c.ativo)?.length || 0

  // --- DADOS DO GRÁFICO (Vem do Backend ou usa vazio) ---
  const salesData = dashboardData?.vendasMensais || []
  const maxSalesValue = salesData.length > 0 ? Math.max(...salesData.map((d: any) => d.valor)) : 1

  // ... (Mantenha os arrays estáticos 'adminSections', 'quickActions', 'recentActivities', 'alerts' igual ao seu código original) ...
  // Vou simplificar aqui para caber na resposta, mas você deve manter o que já tinha nessas constantes.
  const alerts = lowStockProducts > 0 ? [{ message: `${lowStockProducts} produtos com estoque baixo`, severity: "warning", action: "Ver", href: "/perfil/admin/produtos" }] : []
  const adminSections = [
      { title: "Produtos", icon: Package, href: "/perfil/admin/produtos", color: "from-blue-500 via-blue-600 to-blue-700", stats: `${products?.length || 0} produtos` },
      { title: "Categorias", icon: Tag, href: "/perfil/admin/categorias", color: "from-purple-500 via-purple-600 to-purple-700", stats: `${categories?.length || 0} categorias` },
      { title: "Cupons", icon: Gift, href: "/perfil/admin/cupons", color: "from-green-500 via-green-600 to-green-700", stats: `${activeCoupons} ativos` },
      { title: "Relatórios", icon: BarChart3, href: "/perfil/admin/relatorios", color: "from-amber-500 via-amber-600 to-amber-700", stats: "Ver análises" },
  ]
  const stats = [
    { title: "Total de Produtos", value: products?.length || 0, icon: Package, color: "text-blue-600", bgColor: "bg-blue-100" },
    { title: "Categorias", value: categories?.length || 0, icon: Tag, color: "text-pink-600", bgColor: "bg-pink-100" },
    { title: "Cupons Ativos", value: activeCoupons, icon: Gift, color: "text-green-600", bgColor: "bg-green-100" },
    { title: "Valor em Estoque", value: `R$ ${totalRevenueStock.toLocaleString("pt-BR", {minimumFractionDigits: 2})}`, icon: DollarSign, color: "text-amber-600", bgColor: "bg-amber-100" },
  ]

  if (loading) {
      return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Painel Administrativo</h1>
        <p className="text-muted-foreground">Bem-vindo ao centro de controle da sua loja.</p>
      </div>

      {/* Cards de Alertas e Stats (Mantidos do seu layout) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat: any) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex justify-between mb-4">
                  <div><p className="text-sm text-muted-foreground">{stat.title}</p><p className="text-2xl font-bold">{stat.value}</p></div>
                  <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}><Icon className="h-5 w-5" /></div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* GRÁFICO DE VENDAS (DADOS REAIS) */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Vendas Mensais</CardTitle>
              <CardDescription>Evolução das vendas nos últimos 6 meses (Dados Reais)</CardDescription>
            </div>
            <Badge variant="secondary" className="gap-1"><TrendingUp className="h-3 w-3" /> Atualizado</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesData.length > 0 ? salesData.map((data: any, i: number) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">{data.mes}</span>
                  <span className="text-foreground font-semibold">
                    {data.valor.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(data.valor / maxSalesValue) * 100}%` }}
                  />
                </div>
              </div>
            )) : (
                <div className="text-center text-muted-foreground py-4">Nenhuma venda registrada nos últimos 6 meses.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* PRODUTOS MAIS VENDIDOS (DADOS REAIS) */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Produtos Mais Vendidos</CardTitle>
              <CardDescription>Top 5 geral</CardDescription>
            </div>
            <Link href="/perfil/admin/relatorios/mais-vendidos">
              <Button variant="ghost" size="sm" className="gap-1">Ver todos <ArrowUpRight className="h-3 w-3" /></Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topSellingProducts.length > 0 ? topSellingProducts.map((product: any, i: number) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{product.nome}</p>
                  <p className="text-xs text-muted-foreground bg-muted inline-block px-1 rounded">{product.especificacao}</p>
                  <span className="text-sm text-muted-foreground ml-2">{product.quantidadeVendida} vendas</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {product.receitaTotal.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
              </div>
            )) : (
                <div className="text-center text-muted-foreground py-4">Sem vendas registradas.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seções Administrativas (Links) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
         {adminSections.map((section) => {
            const Icon = section.icon
            return (
                <Link key={section.title} href={section.href}>
                    <Card className="group border-border/50 hover:border-primary/50 transition-all cursor-pointer h-full">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-linear-to-br ${section.color} text-white shadow-md`}>
                                <Icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{section.title}</h3>
                                <p className="text-sm text-muted-foreground">{section.stats}</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            )
         })}
      </div>
    </div>
  )
}