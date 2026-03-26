import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formata data: "22/11/2025 às 14:30"
export function formatarData(dataString: string) {
  if (!dataString) return ""
  
  const data = new Date(dataString)
  if (isNaN(data.getTime())) return "Data inválida"

  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).replace(",", " às")
}

// Formata moeda: "R$ 150,00"
export function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}