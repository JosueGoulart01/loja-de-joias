import type { Metadata } from "next"
import ProductDetailPageClient from "./client"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `Produto - Detalhe Prata`,
    description: "Confira os detalhes deste produto exclusivo de nossa coleção de semijoias em prata.",
  }
}

export default function ProductDetailPage() {
  return <ProductDetailPageClient />
}
