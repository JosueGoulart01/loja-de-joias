"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Eye, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function RelatoriosPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="luxury-title text-4xl text-foreground">Relatórios Administrativos</h1>
        <p className="text-muted-foreground text-lg">
          Análise detalhada de desempenho e métricas estratégicas de vendas
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-border/50">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                <BarChart3 className="h-7 w-7 text-primary" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
            </div>
            <div className="space-y-2">
              <CardTitle className="luxury-subtitle text-lg">Produtos Mais Vendidos</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Ranking detalhado de produtos por quantidade vendida, receita gerada e desempenho no período
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/perfil/admin/relatorios/mais-vendidos">
              <Button className="w-full btn-luxury group-hover:shadow-md">Visualizar Relatório</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-border/50">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                <Eye className="h-7 w-7 text-primary" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
            </div>
            <div className="space-y-2">
              <CardTitle className="luxury-subtitle text-lg">Produtos Mais Visualizados</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Análise de visualizações únicas, engajamento e taxa de conversão por produto
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/perfil/admin/relatorios/mais-visualizados">
              <Button className="w-full btn-luxury group-hover:shadow-md">Visualizar Relatório</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-border/50">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                <TrendingUp className="h-7 w-7 text-primary" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
            </div>
            <div className="space-y-2">
              <CardTitle className="luxury-subtitle text-lg">Dashboard de Vendas</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Visão consolidada com KPIs principais, tendências e indicadores estratégicos de desempenho
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/perfil/admin/relatorios/dashboard">
              <Button className="w-full btn-luxury group-hover:shadow-md">Visualizar Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
