// Este ficheiro define a estrutura dos dados que vêm da nossa API Spring Boot,
// espelhando as classes Produto.java e VarianteProduto.java.

export interface VarianteProduto {
  id: number;
  tamanho: string;
  quantidadeEstoque: number;
}

export interface Produto {
  id: number;
  nome: string;
  categoria: string;
  material: string;
  descricao: string;
  precoAtual: number;
  precoOriginal: number | null;
  emPromocao: boolean;
  variantes: VarianteProduto[];
  // Vamos assumir que o backend enviará um campo para a imagem.
  // Se não, podemos ajustar depois.
  imageUrl?: string; 
}

