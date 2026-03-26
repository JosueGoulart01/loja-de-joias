"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { api } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const [urlInput, setUrlInput] = useState("")

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) {
      toast({
        title: "URL vazia",
        description: "Informe uma URL de imagem válida.",
        variant: "destructive",
      })
      return  
    }

    try {
      // Validação simples de URL
      new URL(urlInput)
    } catch {
      toast({
        title: "URL inválida",
        description: "Verifique se a URL está correta.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      // Envia a URL para o backend em JSON (ajuste o endpoint se necessário)
      //const response = await api.post("/upload", { url: urlInput })
      const imageUrl = urlInput
      onChange(imageUrl)
      toast({
        title: "Sucesso",
        description: "URL enviada com sucesso.",
      })
      setUrlInput("")
    } catch (error) {
      console.error("Erro no upload de URL:", error)
      toast({
        title: "Erro",
        description: "Falha ao enviar a URL. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      {/* Campo de texto para URL */}
      {!value && (
        <div className="w-full flex gap-2">
          <input
            type="url"
            placeholder="Cole a URL da imagem (http/https)"
            className="flex-1 border rounded-md px-3 py-2 text-sm"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            disabled={disabled || isUploading}
          />
          <Button
            type="button"
            onClick={handleUrlSubmit}
            disabled={disabled || isUploading}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Enviando
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4" /> Enviar URL
              </span>
            )}
          </Button>
        </div>
      )}

      {value ? (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border group">
          {/* Preview da imagem usando a URL resultante */}
          <img
            src={value}
            alt="Imagem do produto"
            className="w-full h-full object-contain bg-secondary/20"
          />
          <div className="absolute top-2 right-2">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center bg-secondary/5">
          {isUploading ? (
            <div className="flex flex-col items-center text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin mb-2" />
              <p>Enviando...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-muted-foreground">
              <ImageIcon className="h-10 w-10 mb-2" />
              <p className="font-semibold">Informe uma URL para enviar</p>
              <p className="text-xs">Ex.: https://exemplo.com/imagem.jpg</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}