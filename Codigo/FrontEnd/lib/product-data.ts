export interface ProductSize {
  size: string
  stock: number
}

export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  images?: string[] // Additional product images
  isOnSale?: boolean
  description: string
  details: string[]
  category: string
  material: string
  sizes?: ProductSize[] // For rings and adjustable items
  stock: number // General stock for non-sized items
  sku: string
}

// Enhanced product data with detailed information
export const allProducts: Product[] = [
  {
    id: 1,
    name: "Anel Solitário Elegante",
    price: 149.9,
    image: "/elegant-silver-solitaire-ring.jpg",
    images: ["/elegant-silver-solitaire-ring.jpg"],
    description:
      "Um anel solitário clássico em prata 925, perfeito para ocasiões especiais. Design atemporal que combina elegância e sofisticação.",
    details: [
      "Prata 925 de alta qualidade",
      "Pedra zircônia cúbica premium",
      "Acabamento polido",
      "Garantia de 1 ano",
      "Acompanha certificado de autenticidade",
    ],
    category: "Anéis",
    material: "Prata 925",
    sizes: [
      { size: "14", stock: 5 },
      { size: "15", stock: 8 },
      { size: "16", stock: 12 },
      { size: "17", stock: 10 },
      { size: "18", stock: 6 },
      { size: "19", stock: 4 },
      { size: "20", stock: 3 },
    ],
    stock: 48,
    sku: "ASE001",
  },
  {
    id: 2,
    name: "Colar Delicado Prata",
    price: 189.9,
    image: "/delicate-silver-necklace.jpg",
    images: ["/delicate-silver-necklace.jpg"],
    description:
      "Colar delicado em prata 925 com corrente veneziana. Peça versátil que complementa qualquer look com elegância.",
    details: [
      "Prata 925 de alta qualidade",
      "Corrente veneziana 45cm",
      "Fecho lagosta seguro",
      "Acabamento rhodium",
      "Hipoalergênico",
    ],
    category: "Colares",
    material: "Prata 925",
    stock: 25,
    sku: "CDP002",
  },
  {
    id: 3,
    name: "Brincos Minimalistas",
    price: 89.9,
    image: "/minimalist-silver-earrings.jpg",
    images: ["/minimalist-silver-earrings.jpg"],
    description:
      "Brincos minimalistas em prata 925 com design clean e moderno. Perfeitos para o dia a dia ou ocasiões especiais.",
    details: [
      "Prata 925 de alta qualidade",
      "Design minimalista",
      "Tarraxa de pressão",
      "Acabamento polido",
      "Hipoalergênico",
    ],
    category: "Brincos",
    material: "Prata 925",
    stock: 18,
    sku: "BM003",
  },
  {
    id: 4,
    name: "Pulseira Charm Prata",
    price: 129.9,
    image: "/silver-charm-bracelet.jpg",
    images: ["/silver-charm-bracelet.jpg"],
    description: "Pulseira charm em prata 925 com berloques delicados. Peça personalizável que conta sua história.",
    details: [
      "Prata 925 de alta qualidade",
      "Comprimento ajustável 16-20cm",
      "Berloques inclusos",
      "Fecho seguro",
      "Possibilidade de adicionar novos charms",
    ],
    category: "Pulseiras",
    material: "Prata 925",
    stock: 15,
    sku: "PCP004",
  },
  {
    id: 5,
    name: "Conjunto Harmonia",
    price: 104.93,
    originalPrice: 149.9,
    image: "/silver-jewelry-harmony-set.jpg",
    images: ["/silver-jewelry-harmony-set.jpg"],
    isOnSale: true,
    description:
      "Conjunto harmonioso com colar e brincos em prata 925. Design coordenado para um look completo e elegante.",
    details: [
      "Prata 925 de alta qualidade",
      "Colar 42cm + brincos",
      "Design coordenado",
      "Acabamento rhodium",
      "Embalagem presente inclusa",
    ],
    category: "Conjuntos",
    material: "Prata 925",
    stock: 12,
    sku: "CH005",
  },
  {
    id: 6,
    name: "Anel Vintage Prata",
    price: 104.93,
    originalPrice: 149.9,
    image: "/vintage-silver-ring.jpg",
    images: ["/vintage-silver-ring.jpg"],
    isOnSale: true,
    description: "Anel vintage em prata 925 com detalhes trabalhados. Design clássico que nunca sai de moda.",
    details: [
      "Prata 925 de alta qualidade",
      "Design vintage trabalhado",
      "Acabamento envelhecido",
      "Peça única",
      "Inspiração art déco",
    ],
    category: "Anéis",
    material: "Prata 925",
    sizes: [
      { size: "14", stock: 2 },
      { size: "15", stock: 4 },
      { size: "16", stock: 6 },
      { size: "17", stock: 5 },
      { size: "18", stock: 3 },
      { size: "19", stock: 2 },
      { size: "20", stock: 1 },
    ],
    stock: 23,
    sku: "AVP006",
  },
  {
    id: 7,
    name: "Colar Coração Clássico",
    price: 159.9,
    image: "/classic-heart-silver-necklace.jpg",
    images: ["/classic-heart-silver-necklace.jpg"],
    description: "Colar com pingente de coração em prata 925. Símbolo eterno do amor e carinho.",
    details: [
      "Prata 925 de alta qualidade",
      "Pingente coração 1,5cm",
      "Corrente 45cm",
      "Acabamento polido",
      "Embalagem presente",
    ],
    category: "Colares",
    material: "Prata 925",
    stock: 20,
    sku: "CCC007",
  },
  {
    id: 8,
    name: "Brincos Argola Média",
    price: 119.9,
    image: "/medium-silver-hoop-earrings.jpg",
    images: ["/medium-silver-hoop-earrings.jpg"],
    description: "Brincos argola média em prata 925. Clássicos atemporais que complementam qualquer estilo.",
    details: [
      "Prata 925 de alta qualidade",
      "Diâmetro 2,5cm",
      "Fecho de pressão",
      "Acabamento polido",
      "Design clássico",
    ],
    category: "Brincos",
    material: "Prata 925",
    stock: 22,
    sku: "BAM008",
  },
  {
    id: 9,
    name: "Pulseira Elos Prata",
    price: 139.9,
    image: "/silver-chain-link-bracelet.jpg",
    images: ["/silver-chain-link-bracelet.jpg"],
    description: "Pulseira de elos em prata 925 com design robusto e elegante. Peça statement para looks marcantes.",
    details: [
      "Prata 925 de alta qualidade",
      "Elos trabalhados",
      "Comprimento 19cm",
      "Fecho seguro",
      "Acabamento polido",
    ],
    category: "Pulseiras",
    material: "Prata 925",
    stock: 14,
    sku: "PEP009",
  },
  {
    id: 10,
    name: "Anel Infinito Delicado",
    price: 99.9,
    image: "/delicate-infinity-silver-ring.jpg",
    images: ["/delicate-infinity-silver-ring.jpg"],
    description: "Anel infinito delicado em prata 925. Símbolo do amor eterno em design minimalista.",
    details: [
      "Prata 925 de alta qualidade",
      "Design infinito",
      "Acabamento polido",
      "Anel delicado",
      "Significado especial",
    ],
    category: "Anéis",
    material: "Prata 925",
    sizes: [
      { size: "14", stock: 3 },
      { size: "15", stock: 6 },
      { size: "16", stock: 8 },
      { size: "17", stock: 7 },
      { size: "18", stock: 5 },
      { size: "19", stock: 3 },
      { size: "20", stock: 2 },
    ],
    stock: 34,
    sku: "AID010",
  },
]

// Helper functions
export function getProductById(id: number): Product | undefined {
  return allProducts.find((product) => product.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return allProducts.filter((product) => product.category === category)
}

export function getTotalStock(product: Product): number {
  if (product.sizes) {
    return product.sizes.reduce((total, size) => total + size.stock, 0)
  }
  return product.stock
}
