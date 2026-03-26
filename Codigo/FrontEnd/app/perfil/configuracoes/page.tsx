"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, MapPin, Phone, Mail, Save, CheckCircle2, Loader2, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface UserData {
  nome: string
  sobrenome: string
  email: string
  telefone: string
  cpf: string
  dataNascimento: string
}

interface AddressData {
  cep: string
  rua: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  pontoReferencia: string
}

export default function ConfiguracoesPage() {
  const { usuario } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)

  const [userData, setUserData] = useState<UserData>({
    nome: "",
    sobrenome: "",
    email: "",
    telefone: "",
    cpf: "",
    dataNascimento: ""
  })

  const [addressData, setAddressData] = useState<AddressData>({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    pontoReferencia: ""
  })

  // --- CARREGAR DADOS ---
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await api.get("/usuarios/perfil")
        const data = response.data

        // Formata a data para o input type="date" (YYYY-MM-DD)
        let dataFormatada = "";
        if (data.dataNascimento) {
            if (Array.isArray(data.dataNascimento)) {
                // Se vier como array [2000, 1, 1]
                const [ano, mes, dia] = data.dataNascimento;
                const mesF = mes.toString().padStart(2, '0');
                const diaF = dia.toString().padStart(2, '0');
                dataFormatada = `${ano}-${mesF}-${diaF}`;
            } else {
                // Se vier como string "2000-01-01"
                dataFormatada = data.dataNascimento.toString().split("T")[0];
            }
        }

        setUserData({
          nome: data.nome || "",
          sobrenome: data.sobrenome || "",
          email: data.email || "",
          telefone: data.telefone || "",
          cpf: data.cpf || "",
          dataNascimento: dataFormatada
        })

        if (data.endereco) {
          setAddressData({
            cep: data.endereco.cep || "",
            rua: data.endereco.rua || "",
            numero: data.endereco.numero || "",
            complemento: data.endereco.complemento || "",
            bairro: data.endereco.bairro || "",
            cidade: data.endereco.cidade || "",
            estado: data.endereco.estado || "",
            pontoReferencia: data.endereco.pontoReferencia || ""
          })
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error)
        toast({
          title: "Erro ao carregar",
          description: "Não foi possível obter seus dados.",
          variant: "destructive",
        })
      } finally {
        setIsPageLoading(false)
      }
    }

    fetchPerfil()
  }, [toast])

  const handleUserDataChange = (field: keyof UserData, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
    setIsSaved(false)
  }

  const handleAddressDataChange = (field: keyof AddressData, value: string) => {
    setAddressData((prev) => ({ ...prev, [field]: value }))
    setIsSaved(false)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Limpa formatação antes de enviar
      const cpfLimpo = userData.cpf.replace(/\D/g, "")
      const telefoneLimpo = userData.telefone.replace(/\D/g, "")
      const cepLimpo = addressData.cep.replace(/\D/g, "")

      const payload = {
        ...userData,
        cpf: cpfLimpo,
        telefone: telefoneLimpo,
        endereco: {
            ...addressData,
            cep: cepLimpo
        }
      }

      await api.put("/usuarios/perfil/pf", payload)

      setIsSaved(true)
      toast({ title: "Sucesso!", description: "Dados atualizados." })
      setTimeout(() => setIsSaved(false), 3000)

    } catch (error: any) {
      console.error("Erro ao salvar:", error)
      const mensagemErro = error.response?.data?.message || "Verifique os campos obrigatórios."
      toast({ title: "Erro", description: mensagemErro, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const buscarCep = async () => {
    const cepLimpo = addressData.cep.replace(/\D/g, "")
    if (cepLimpo.length !== 8) return
    setIsLoading(true)
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      if (!response.data.erro) {
        setAddressData((prev) => ({
          ...prev,
          rua: response.data.logradouro,
          bairro: response.data.bairro,
          cidade: response.data.localidade,
          estado: response.data.uf,
        }))
      }
    } catch (e) {} finally { setIsLoading(false) }
  }

  if (isPageLoading) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Carregando...</p>
            </div>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20 p-6 md:p-8 animate-in fade-in duration-500">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Configurações
          </h1>
          <p className="text-lg text-muted-foreground">
            Gerencie suas informações pessoais e endereço de entrega
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* DADOS PESSOAIS */}
          <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardHeader className="relative space-y-3 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-blue-600 shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="font-serif text-2xl">Dados Pessoais</CardTitle>
                  <CardDescription className="text-base">Atualize suas informações básicas</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Nome</Label>
                  <Input value={userData.nome} onChange={(e) => handleUserDataChange("nome", e.target.value)} className="h-11 border-2 transition-all focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Sobrenome</Label>
                  <Input value={userData.sobrenome} onChange={(e) => handleUserDataChange("sobrenome", e.target.value)} className="h-11 border-2 transition-all focus:border-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold"><Mail className="mr-2 inline h-4 w-4" /> E-mail</Label>
                <Input value={userData.email} disabled className="h-11 border-2 bg-muted/50 opacity-70 cursor-not-allowed" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold"><Phone className="mr-2 inline h-4 w-4" /> Telefone</Label>
                  <Input value={userData.telefone} onChange={(e) => handleUserDataChange("telefone", e.target.value)} className="h-11 border-2 transition-all focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold"><Calendar className="mr-2 inline h-4 w-4" /> Nascimento</Label>
                  <Input type="date" value={userData.dataNascimento} onChange={(e) => handleUserDataChange("dataNascimento", e.target.value)} className="h-11 border-2 transition-all focus:border-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">CPF</Label>
                <Input value={userData.cpf} disabled className="h-11 border-2 bg-muted/50 opacity-70 cursor-not-allowed" />
              </div>
            </CardContent>
          </Card>

          {/* ENDEREÇO */}
          <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardHeader className="relative space-y-3 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="font-serif text-2xl">Endereço</CardTitle>
                  <CardDescription className="text-base">Endereço de entrega dos pedidos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-6">
               <div className="flex gap-3">
                <div className="flex-1 space-y-2">
                  <Label className="text-sm font-semibold">CEP</Label>
                  <Input value={addressData.cep} onChange={(e) => handleAddressDataChange("cep", e.target.value)} className="h-11 border-2 transition-all focus:border-primary" maxLength={9} />
                </div>
                <div className="flex items-end">
                  <Button onClick={buscarCep} disabled={isLoading} variant="outline" className="h-11 border-2 px-6 hover:bg-primary hover:text-white">Buscar</Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm font-semibold">Rua</Label>
                  <Input value={addressData.rua} onChange={(e) => handleAddressDataChange("rua", e.target.value)} className="h-11 border-2 transition-all focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Número</Label>
                  <Input value={addressData.numero} onChange={(e) => handleAddressDataChange("numero", e.target.value)} className="h-11 border-2 transition-all focus:border-primary" />
                </div>
              </div>

              <div className="space-y-2">
                  <Label className="text-sm font-semibold">Complemento</Label>
                  <Input value={addressData.complemento} onChange={(e) => handleAddressDataChange("complemento", e.target.value)} className="h-11 border-2 transition-all focus:border-primary" />
              </div>

              <div className="space-y-2">
                  <Label className="text-sm font-semibold">Bairro</Label>
                  <Input value={addressData.bairro} onChange={(e) => handleAddressDataChange("bairro", e.target.value)} className="h-11 border-2 transition-all focus:border-primary" />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                 <div className="space-y-2 sm:col-span-2">
                    <Label className="text-sm font-semibold">Cidade</Label>
                    <Input value={addressData.cidade} onChange={(e) => handleAddressDataChange("cidade", e.target.value)} className="h-11 border-2 transition-all focus:border-primary" />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-sm font-semibold">UF</Label>
                    <Input value={addressData.estado} onChange={(e) => handleAddressDataChange("estado", e.target.value)} className="h-11 border-2 transition-all focus:border-primary" maxLength={2} />
                 </div>
              </div>
              <div className="space-y-2">
                  <Label className="text-sm font-semibold">Ponto de Referência</Label>
                  <Input value={addressData.pontoReferencia} onChange={(e) => handleAddressDataChange("pontoReferencia", e.target.value)} className="h-11 border-2 transition-all focus:border-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botão Salvar */}
        <Card className="border-2 bg-linear-to-br from-background to-muted/20 sticky bottom-4 z-10 shadow-xl backdrop-blur-sm">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-1">
              <p className="font-semibold text-foreground">Salvar Alterações</p>
              <p className="text-sm text-muted-foreground">Clique para atualizar suas informações</p>
            </div>
            <Button onClick={handleSave} disabled={isLoading} size="lg" className="group relative h-12 overflow-hidden bg-linear-to-r from-primary to-primary/80 px-8 font-semibold shadow-lg hover:shadow-xl">
               <span className="relative flex items-center gap-2">
                 {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> Salvando...</> : isSaved ? <><CheckCircle2 className="h-5 w-5" /> Salvo!</> : <><Save className="h-5 w-5" /> Salvar Alterações</>}
               </span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}