"use client"

import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Maria Silva",
    text: "Qualidade excepcional! As peças são lindas e o acabamento é perfeito. Recomendo muito!",
    rating: 5,
    image: "/woman-profile-avatar.png",
  },
  {
    id: 2,
    name: "Ana Costa",
    text: "Adorei minha compra! O atendimento foi excelente e a entrega super rápida.",
    rating: 5,
    image: "/woman-profile-avatar.png",
  },
  {
    id: 3,
    name: "Juliana Santos",
    text: "Peças elegantes e sofisticadas. Uso todos os dias e recebo muitos elogios!",
    rating: 5,
    image: "/woman-profile-avatar.png",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 bg-accent/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="luxury-title text-3xl md:text-4xl text-foreground mb-4">O Que Dizem Nossas Clientes</h2>
          <div className="w-24 h-px bg-primary mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-background/50 backdrop-blur-sm p-8 rounded-sm border border-border/30 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-light text-foreground">{testimonial.name}</h3>
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
