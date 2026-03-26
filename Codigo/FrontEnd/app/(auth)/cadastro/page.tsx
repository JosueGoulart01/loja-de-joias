"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { api } from '@/services/api';
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle, User, Building } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"


export default function CadastroPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("cpf")
  const [error, setError] = useState("")
  const [cnpjValidationError, setCnpjValidationError] = useState("")
  const [cnpjValidationSuccess, setCnpjValidationSuccess] = useState("")
  const [validatingCNPJ, setValidatingCNPJ] = useState(false)

  const [cpfData, setCpfData] = useState({
    nome: "",
    sobrenome: "",
    dataNascimento: "",
    cpf: "",
    email: "",
    telefone: "",
    senha: "",
    endereco: {
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      pontoReferencia: "",
    },
    preferenciaContato: "WHATSAPP",
  })

  const [cnpjData, setCnpjData] = useState({
    cnpj: "",
    inscricaoEstadual: "",
    nomeFantasia: "",
    razaoSocial: "",
    nomeResponsavel: "",
    sobrenomeResponsavel: "",
    email: "",
    telefone: "",
    senha: "",
    enderecoEmpresa: {
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      pontoReferencia: "",
    },
    enderecoEntrega: {
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      pontoReferencia: "",
    },
    comoNosConheceu: "INSTAGRAM",
  })

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      const initialEmail = decodeURIComponent(emailParam)
      setCpfData((prev) => ({ ...prev, email: initialEmail }))
      setCnpjData((prev) => ({ ...prev, email: initialEmail }))
    }
  }, [searchParams])

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (["rua", "numero", "complemento", "bairro", "cidade", "estado", "cep", "pontoReferencia"].includes(name)) {
      setCpfData((prev) => ({ ...prev, endereco: { ...prev.endereco, [name]: value } }))
    } else {
      setCpfData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleCpfSelectChange = (name: string, value: string) => {
    if (name === "estado") {
      setCpfData((prev) => ({ ...prev, endereco: { ...prev.endereco, estado: value } }))
    } else if (name === "preferenciaContato") {
      setCpfData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.startsWith("empresa_")) {
      const key = name.replace("empresa_", "") as keyof typeof cnpjData.enderecoEmpresa
      setCnpjData((prev) => ({ ...prev, enderecoEmpresa: { ...prev.enderecoEmpresa, [key]: value } }))
    } else if (name.startsWith("entrega_")) {
      const key = name.replace("entrega_", "") as keyof typeof cnpjData.enderecoEntrega
      setCnpjData((prev) => ({ ...prev, enderecoEntrega: { ...prev.enderecoEntrega, [key]: value } }))
    } else {
      const key = name as keyof typeof cnpjData
      setCnpjData((prev) => ({ ...prev, [key]: value }))
    }

    // Validar CNPJ em tempo real quando o campo mudar
    if (name === "cnpj" && value.length >= 11) {
      validarCNPJ(value)
    } else if (name === "cnpj") {
      setCnpjValidationError("")
      setCnpjValidationSuccess("")
    }
  }

  /**
   * Valida o CNPJ chamando o endpoint do backend
   */
  const validarCNPJ = async (cnpj: string) => {
    setValidatingCNPJ(true)
    setCnpjValidationError("")
    setCnpjValidationSuccess("")

    try {
      const response = await api.get("/cadastro/validar-cnpj", {
        params: { cnpj },
      })

      if (response.data.valido) {
        setCnpjValidationSuccess("CNPJ válido")
        setCnpjValidationError("")
      } else {
        setCnpjValidationError(response.data.mensagem || "CNPJ inválido")
        setCnpjValidationSuccess("")
      }
    } catch (err: any) {
      console.error("Erro ao validar CNPJ:", err)
      setCnpjValidationError("Erro ao validar CNPJ")
      setCnpjValidationSuccess("")
    } finally {
      setValidatingCNPJ(false)
    }
  }

  const handleCnpjSelectChange = (name: string, value: string) => {
    if (name === "empresa_estado") {
      setCnpjData((prev) => ({ ...prev, enderecoEmpresa: { ...prev.enderecoEmpresa, estado: value } }))
    } else if (name === "entrega_estado") {
      setCnpjData((prev) => ({ ...prev, enderecoEntrega: { ...prev.enderecoEntrega, estado: value } }))
    } else {
      setCnpjData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const isCpfTab = activeTab === "cpf"
    const url = isCpfTab ? "/cadastro/pf" : "/cadastro/pj"
    const payload = isCpfTab ? cpfData : cnpjData

    try {
      await api.post(url, payload)
      alert("Conta criada com sucesso! Você será redirecionado para o login.")
      router.push("/login")
    } catch (err: any) {
      console.error(`Erro no cadastro de ${activeTab.toUpperCase()}:`, err)
      const errorMessage = err.response?.data?.message || "Ocorreu um erro. Verifique os dados e tente novamente."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 flex justify-center items-center">
      <div className="container mx-auto max-w-3xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif">Criar Conta</CardTitle>
            <CardDescription>Complete seu cadastro para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cpf" className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Pessoa Física
                </TabsTrigger>
                <TabsTrigger value="cnpj" className="flex items-center gap-2">
                  <Building className="h-4 w-4" /> Pessoa Jurídica
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cpf" className="mt-6">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome *</Label>
                      <Input id="nome" name="nome" value={cpfData.nome} onChange={handleCpfChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sobrenome">Sobrenome *</Label>
                      <Input
                        id="sobrenome"
                        name="sobrenome"
                        value={cpfData.sobrenome}
                        onChange={handleCpfChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                      <Input
                        id="dataNascimento"
                        name="dataNascimento"
                        type="date"
                        value={cpfData.dataNascimento}
                        onChange={handleCpfChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        name="cpf"
                        placeholder="000.000.000-00"
                        value={cpfData.cpf}
                        onChange={handleCpfChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={cpfData.email}
                        onChange={handleCpfChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone *</Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        placeholder="(00) 00000-0000"
                        value={cpfData.telefone}
                        onChange={handleCpfChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha *</Label>
                    <Input
                      id="senha"
                      name="senha"
                      type="password"
                      value={cpfData.senha}
                      onChange={handleCpfChange}
                      required
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-medium text-foreground">Endereço de Entrega</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="rua">Rua *</Label>
                        <Input id="rua" name="rua" value={cpfData.endereco.rua} onChange={handleCpfChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="numero">Número *</Label>
                        <Input
                          id="numero"
                          name="numero"
                          value={cpfData.endereco.numero}
                          onChange={handleCpfChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="complemento">Complemento</Label>
                        <Input
                          id="complemento"
                          name="complemento"
                          value={cpfData.endereco.complemento}
                          onChange={handleCpfChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bairro">Bairro *</Label>
                        <Input
                          id="bairro"
                          name="bairro"
                          value={cpfData.endereco.bairro}
                          onChange={handleCpfChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade *</Label>
                        <Input
                          id="cidade"
                          name="cidade"
                          value={cpfData.endereco.cidade}
                          onChange={handleCpfChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estado">Estado *</Label>
                        <Select
                          required
                          onValueChange={(value) => handleCpfSelectChange("estado", value)}
                          value={cpfData.endereco.estado}
                        >
                          <SelectTrigger id="estado" name="estado">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SP">São Paulo</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                            <SelectItem value="MG">Minas Gerais</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cep">CEP *</Label>
                        <Input
                          id="cep"
                          name="cep"
                          placeholder="00000-000"
                          value={cpfData.endereco.cep}
                          onChange={handleCpfChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pontoReferencia">Ponto de Referência</Label>
                      <Input
                        id="pontoReferencia"
                        name="pontoReferencia"
                        value={cpfData.endereco.pontoReferencia}
                        onChange={handleCpfChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferenciaContato">Preferência de Contato *</Label>
                    <Select
                      required
                      onValueChange={(value) => handleCpfSelectChange("preferenciaContato", value)}
                      value={cpfData.preferenciaContato}
                    >
                      <SelectTrigger id="preferenciaContato" name="preferenciaContato">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                        <SelectItem value="EMAIL">E-mail</SelectItem>
                        <SelectItem value="LIGACAO">Ligação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {error && <p className="text-sm text-center text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Criando Conta..." : "Criar Conta"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="cnpj" className="mt-6">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ *</Label>
                      <div className="relative">
                        <Input
                          id="cnpj"
                          name="cnpj"
                          value={cnpjData.cnpj}
                          onChange={handleCnpjChange}
                          placeholder="00.000.000/0000-00"
                          required
                          className={cnpjValidationSuccess ? "border-green-500" : cnpjValidationError ? "border-red-500" : ""}
                        />
                        {validatingCNPJ && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                          </div>
                        )}
                        {cnpjValidationSuccess && !validatingCNPJ && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                        )}
                        {cnpjValidationError && !validatingCNPJ && (
                          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                        )}
                      </div>
                      {cnpjValidationSuccess && (
                        <p className="text-xs text-green-600 mt-1">{cnpjValidationSuccess}</p>
                      )}
                      {cnpjValidationError && (
                        <p className="text-xs text-red-600 mt-1">{cnpjValidationError}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                      <Input
                        id="inscricaoEstadual"
                        name="inscricaoEstadual"
                        value={cnpjData.inscricaoEstadual}
                        onChange={handleCnpjChange}
                        placeholder="Se aplicável"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomeFantasia">Nome Fantasia *</Label>
                    <Input
                      id="nomeFantasia"
                      name="nomeFantasia"
                      value={cnpjData.nomeFantasia}
                      onChange={handleCnpjChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="razaoSocial">Razão Social *</Label>
                    <Input
                      id="razaoSocial"
                      name="razaoSocial"
                      value={cnpjData.razaoSocial}
                      onChange={handleCnpjChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nomeResponsavel">Nome do Responsável *</Label>
                      <Input
                        id="nomeResponsavel"
                        name="nomeResponsavel"
                        value={cnpjData.nomeResponsavel}
                        onChange={handleCnpjChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sobrenomeResponsavel">Sobrenome do Responsável *</Label>
                      <Input
                        id="sobrenomeResponsavel"
                        name="sobrenomeResponsavel"
                        value={cnpjData.sobrenomeResponsavel}
                        onChange={handleCnpjChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={cnpjData.email}
                        onChange={handleCnpjChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        placeholder="(00) 00000-0000"
                        value={cnpjData.telefone}
                        onChange={handleCnpjChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha *</Label>
                    <Input
                      id="senha"
                      name="senha"
                      type="password"
                      value={cnpjData.senha}
                      onChange={handleCnpjChange}
                      required
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-medium text-foreground">Endereço da Empresa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="empresa_rua">Rua *</Label>
                        <Input
                          id="empresa_rua"
                          name="empresa_rua"
                          value={cnpjData.enderecoEmpresa.rua}
                          onChange={handleCnpjChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="empresa_numero">Número *</Label>
                        <Input
                          id="empresa_numero"
                          name="empresa_numero"
                          value={cnpjData.enderecoEmpresa.numero}
                          onChange={handleCnpjChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="empresa_complemento">Complemento</Label>
                        <Input
                          id="empresa_complemento"
                          name="empresa_complemento"
                          value={cnpjData.enderecoEmpresa.complemento}
                          onChange={handleCnpjChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="empresa_bairro">Bairro *</Label>
                        <Input
                          id="empresa_bairro"
                          name="empresa_bairro"
                          value={cnpjData.enderecoEmpresa.bairro}
                          onChange={handleCnpjChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="empresa_cidade">Cidade *</Label>
                        <Input
                          id="empresa_cidade"
                          name="empresa_cidade"
                          value={cnpjData.enderecoEmpresa.cidade}
                          onChange={handleCnpjChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="empresa_estado">Estado *</Label>
                        <Select
                          required
                          onValueChange={(value) => handleCnpjSelectChange("empresa_estado", value)}
                          value={cnpjData.enderecoEmpresa.estado}
                        >
                          <SelectTrigger id="empresa_estado" name="empresa_estado">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SP">São Paulo</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                            <SelectItem value="MG">Minas Gerais</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="empresa_cep">CEP *</Label>
                        <Input
                          id="empresa_cep"
                          name="empresa_cep"
                          placeholder="00000-000"
                          value={cnpjData.enderecoEmpresa.cep}
                          onChange={handleCnpjChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="empresa_pontoReferencia">Ponto de Referência</Label>
                      <Input
                        id="empresa_pontoReferencia"
                        name="empresa_pontoReferencia"
                        value={cnpjData.enderecoEmpresa.pontoReferencia}
                        onChange={handleCnpjChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-medium text-foreground">Endereço de Entrega</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="entrega_rua">Rua *</Label>
                        <Input
                          id="entrega_rua"
                          name="entrega_rua"
                          value={cnpjData.enderecoEntrega.rua}
                          onChange={handleCnpjChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="entrega_numero">Número *</Label>
                        <Input
                          id="entrega_numero"
                          name="entrega_numero"
                          value={cnpjData.enderecoEntrega.numero}
                          onChange={handleCnpjChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="entrega_complemento">Complemento</Label>
                        <Input
                          id="entrega_complemento"
                          name="entrega_complemento"
                          value={cnpjData.enderecoEntrega.complemento}
                          onChange={handleCnpjChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="entrega_bairro">Bairro *</Label>
                        <Input
                          id="entrega_bairro"
                          name="entrega_bairro"
                          value={cnpjData.enderecoEntrega.bairro}
                          onChange={handleCnpjChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="entrega_cidade">Cidade *</Label>
                        <Input
                          id="entrega_cidade"
                          name="entrega_cidade"
                          value={cnpjData.enderecoEntrega.cidade}
                          onChange={handleCnpjChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="entrega_estado">Estado *</Label>
                        <Select
                          required
                          onValueChange={(value) => handleCnpjSelectChange("entrega_estado", value)}
                          value={cnpjData.enderecoEntrega.estado}
                        >
                          <SelectTrigger id="entrega_estado" name="entrega_estado">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SP">São Paulo</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                            <SelectItem value="MG">Minas Gerais</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="entrega_cep">CEP *</Label>
                        <Input
                          id="entrega_cep"
                          name="entrega_cep"
                          placeholder="00000-000"
                          value={cnpjData.enderecoEntrega.cep}
                          onChange={handleCnpjChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="entrega_pontoReferencia">Ponto de Referência</Label>
                      <Input
                        id="entrega_pontoReferencia"
                        name="entrega_pontoReferencia"
                        value={cnpjData.enderecoEntrega.pontoReferencia}
                        onChange={handleCnpjChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comoNosConheceu">Como nos conheceu? *</Label>
                    <Select
                      required
                      onValueChange={(value) => handleCnpjSelectChange("comoNosConheceu", value)}
                      value={cnpjData.comoNosConheceu}
                    >
                      <SelectTrigger id="comoNosConheceu" name="comoNosConheceu">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                        <SelectItem value="SITE">Site</SelectItem>
                        <SelectItem value="INDICACAO">Indicação</SelectItem>
                        <SelectItem value="EVENTO">Evento</SelectItem>
                        <SelectItem value="OUTROS">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {error && <p className="text-sm text-center text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Criando Conta..." : "Criar Conta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
