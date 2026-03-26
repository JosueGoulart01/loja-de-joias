import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="space-y-2 sm:space-y-3">
            <h3 className="luxury-title text-base sm:text-lg">Detalhe Prata</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Joias em prata de alta qualidade para todas as ocasiões.</p>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Produtos</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/produtos?categoria=aneis" className="text-muted-foreground hover:text-foreground transition-colors">
                  Anéis
                </Link>
              </li>
              <li>
                <Link href="/produtos?categoria=brincos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Brincos
                </Link>
              </li>
              <li>
                <Link href="/produtos?categoria=colares" className="text-muted-foreground hover:text-foreground transition-colors">
                  Colares
                </Link>
              </li>
              <li>
                <Link href="/produtos?categoria=pulseiras" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pulseiras
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Institucional</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/sobre" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidade" className="text-muted-foreground hover:text-foreground transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Atendimento</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link href="/trocas-devolucoes" className="text-muted-foreground hover:text-foreground transition-colors">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link href="/entrega" className="text-muted-foreground hover:text-foreground transition-colors">
                  Entrega
                </Link>
              </li>
              <li>
                <Link href="/garantia" className="text-muted-foreground hover:text-foreground transition-colors">
                  Garantia
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 border-t pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Detalhe Prata. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}