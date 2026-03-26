export interface Usuario {
  id: number
  email: string
  telefone?: string
  role: "USER" | "ADMIN"
  dataCriacao: string
  dataAtualizacao: string
  ativo: boolean
}

export interface PessoaFisica extends Usuario {
  nome: string
  cpf: string
  tipo: "PF"
}

export interface PessoaJuridica extends Usuario {
  razaoSocial: string
  cnpj: string
  tipo: "PJ"
}

export type UsuarioCompleto = PessoaFisica | PessoaJuridica
