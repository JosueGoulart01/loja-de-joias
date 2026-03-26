"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles } from "lucide-react"

export function HeroBanner() {
  return (
    <section className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden bg-linear-to-br from-background via-accent/10 to-background">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('/elegant-silver-jewelry-collection-banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 container mx-auto px-3 sm:px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3 md:mb-4">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary" />
            <span className="text-xs sm:text-sm tracking-widest text-muted-foreground uppercase font-light">Coleção Exclusiva</span>
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary" />
          </div>

          <h1 className="luxury-title text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground leading-tight">
            Elegância em Prata
          </h1>

          <p className="luxury-subtitle text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
            Descubra nossa coleção de semijoias em prata 925, onde sofisticação encontra qualidade excepcional
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 md:h-32 bg-linear-to-t from-background to-transparent" />
    </section>
  )
}
