"use client"

import { useState, useMemo, useEffect } from "react"
import { api } from "@/services/api"
import { Search, UserPlus, Pencil, Trash2, Users, Shield, UserCheck, Mail, Phone, Calendar, UserCircle, Building2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UsuarioCompleto, PessoaFisica, PessoaJuridica } from "@/types/usuario"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UsuarioCompleto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingUser, setEditingUser] = useState<UsuarioCompleto | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null)
  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/usuarios")
      
      const data = response.data.map((u: any) => ({
        ...u,
        tipo: u.cpf ? "PF" : "PJ" 
      }))
      
      setUsers(data)
    } catch (error) {
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível buscar a lista de usuários.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const getDisplayName = (user: UsuarioCompleto): string => {
    return user.tipo === "PF" ? user.nome : user.razaoSocial
  }

  const getDocumento = (user: UsuarioCompleto): string => {
    return user.tipo === "PF" ? user.cpf : user.cnpj
  }

  const getDocumentoLabel = (user: UsuarioCompleto): string => {
    return user.tipo === "PF" ? "CPF" : "CNPJ"
  }

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users

    const query = searchQuery.toLowerCase().trim()
    const queryClean = query.replace(/[.\-/\s]/g, "")

    return users.filter((user) => {
      const displayName = (getDisplayName(user) || "").toLowerCase()
      const email = (user.email || "").toLowerCase()
      const documento = getDocumento(user) || ""
      const documentoClean = documento.replace(/[.\-/\s]/g, "")

      return (
        displayName.includes(query) ||
        email.includes(query) ||
        documento.includes(query) ||
        documentoClean.includes(queryClean)
      )
    })
  }, [users, searchQuery])

  const handleUpdateUser = async () => {
    if (!editingUser) return

    try {
      const { dataCriacao, dataAtualizacao, ...payload } = editingUser;

      const response = await api.put(`/usuarios/${editingUser.id}`, payload)
      
      setUsers((prev) => 
        prev.map((user) => (user.id === editingUser.id ? { ...user, ...response.data } : user))
      )

      fetchUsers()

      toast({
        title: "Usuário atualizado",
        description: `${getDisplayName(editingUser)} foi atualizado com sucesso.`,
      })

      setEditingUser(null)
    } catch (error) {
      toast({
        title: "Erro na atualização",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async () => {
    if (!deletingUserId) return

    try {
      await api.delete(`/usuarios/${deletingUserId}`)
      
      const user = users.find((u) => u.id === deletingUserId)
      setUsers((prev) => prev.filter((user) => user.id !== deletingUserId))

      toast({
        title: "Usuário excluído",
        description: `${user ? getDisplayName(user) : 'Usuário'} foi removido do sistema.`,
        variant: "destructive",
      })
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Verifique se o usuário não possui pedidos vinculados.",
        variant: "destructive",
      })
    } finally {
      setDeletingUserId(null)
    }
  }

  const handleToggleAtivo = async (userId: number) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    const previousState = user.ativo
    setUsers((prev) =>
      prev.map((u) => u.id === userId ? { ...u, ativo: !u.ativo } : u)
    )

    try {
      await api.patch(`/usuarios/${userId}/status`)
      
      toast({
        title: !previousState ? "Usuário ativado" : "Usuário desativado",
        description: `Status alterado com sucesso.`,
      })
    } catch (error) {
      setUsers((prev) =>
        prev.map((u) => u.id === userId ? { ...u, ativo: previousState } : u)
      )
      toast({
        title: "Erro ao alterar status",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) return "-"
    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      })
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="luxury-title text-3xl sm:text-4xl lg:text-5xl text-foreground mb-2 text-balance">
            Gerenciar Usuários
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gerencie todos os usuários cadastrados na plataforma
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar por nome, CPF ou CNPJ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
            </div>
         </div>

        <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3 space-y-0">
              <CardDescription className="text-xs sm:text-sm flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Total de Usuários
              </CardDescription>
              <CardTitle className="text-2xl sm:text-3xl font-bold">{isLoading ? "..." : users.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3 space-y-0">
              <CardDescription className="text-xs sm:text-sm flex items-center gap-1.5">
                <UserCircle className="h-3.5 w-3.5" />
                Pessoas Físicas
              </CardDescription>
              <CardTitle className="text-2xl sm:text-3xl font-bold">
                {isLoading ? "..." : users.filter((u) => u.tipo === "PF").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3 space-y-0">
              <CardDescription className="text-xs sm:text-sm flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                Pessoas Jurídicas
              </CardDescription>
              <CardTitle className="text-2xl sm:text-3xl font-bold">
                {isLoading ? "..." : users.filter((u) => u.tipo === "PJ").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3 space-y-0">
              <CardDescription className="text-xs sm:text-sm flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                Administradores
              </CardDescription>
              <CardTitle className="text-2xl sm:text-3xl font-bold">
                {isLoading ? "..." : users.filter((u) => u.role === "ADMIN").length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {isLoading ? (
          <div className="text-center p-12 text-muted-foreground">Carregando usuários...</div>
        ) : filteredUsers.length === 0 ? (
          <Card className="p-8 sm:p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">
                {searchQuery ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-4">
                {searchQuery
                  ? "Tente buscar por outros termos ou verifique a ortografia."
                  : "Comece adicionando o primeiro usuário ao sistema."}
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Limpar busca
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {filteredUsers.map((user) => (
              <Card 
                key={user.id} 
                className="group hover:shadow-xl hover:border-primary/30 transition-all duration-300 overflow-hidden relative"
              >
                {!user.ativo && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-destructive" />
                )}
                
                <CardHeader className="pb-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {user.tipo === "PF" ? (
                          <UserCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                        ) : (
                          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <CardTitle className="text-base sm:text-lg truncate group-hover:text-primary transition-colors">
                          {getDisplayName(user)}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 items-end shrink-0">
                      <Badge 
                        variant={user.tipo === "PF" ? "default" : "secondary"}
                        className="text-xs font-medium"
                      >
                        {user.tipo}
                      </Badge>
                      {user.role === "ADMIN" && (
                        <Badge variant="outline" className="gap-1 text-xs border-primary/50 text-primary">
                          <Shield className="h-3 w-3" />
                          Admin
                        </Badge>
                      )}
                      {!user.ativo && (
                        <Badge variant="destructive" className="text-xs">
                          Inativo
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm p-2.5 rounded-md bg-muted/50 border border-border">
                      <span className="text-muted-foreground font-medium">
                        {getDocumentoLabel(user)}:
                      </span>
                      <span className="font-mono text-foreground font-semibold tracking-tight">
                        {getDocumento(user)}
                      </span>
                    </div>
                    
                    {user.telefone && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm p-2 rounded-md hover:bg-muted/30 transition-colors">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="font-mono text-foreground">{user.telefone}</span>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          Cadastrado em {formatDate(user.dataCriacao)}
                        </span>
                      </div>
                      
                      {user.dataAtualizacao !== user.dataCriacao && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>
                            Atualizado em {formatDate(user.dataAtualizacao)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="group/btn hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                      onClick={() => setEditingUser(user)}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1.5 group-hover/btn:scale-110 transition-transform" />
                      <span className="hidden sm:inline">Editar</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleAtivo(user.id)}
                      className={`transition-all ${
                        user.ativo 
                          ? "hover:border-amber-600 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20" 
                          : "hover:border-green-600 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                      }`}
                    >
                      <UserCheck className="h-3.5 w-3.5 mr-1.5" />
                      <span className="hidden sm:inline">{user.ativo ? "Desativar" : "Ativar"}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="col-span-2 text-destructive hover:text-destructive hover:border-destructive hover:bg-destructive/5 transition-all"
                      onClick={() => setDeletingUserId(user.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Excluir Usuário
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Editar Usuário</DialogTitle>
              <DialogDescription className="text-sm">
                Atualize as informações do usuário abaixo. Todos os campos são obrigatórios.
              </DialogDescription>
            </DialogHeader>
            {editingUser && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="displayName" className="text-sm font-medium flex items-center gap-2">
                    {editingUser.tipo === "PF" ? (
                      <>
                        <UserCircle className="h-4 w-4" />
                        Nome Completo
                      </>
                    ) : (
                      <>
                        <Building2 className="h-4 w-4" />
                        Razão Social
                      </>
                    )}
                  </Label>
                  <Input
                    id="displayName"
                    value={getDisplayName(editingUser)}
                    onChange={(e) => {
                      if (editingUser.tipo === "PF") {
                        setEditingUser({ ...editingUser, nome: e.target.value } as PessoaFisica)
                      } else {
                        setEditingUser({ ...editingUser, razaoSocial: e.target.value } as PessoaJuridica)
                      }
                    }}
                    className="h-11"
                    placeholder={editingUser.tipo === "PF" ? "Digite o nome completo" : "Digite a razão social"}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                    className="h-11"
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="documento" className="text-sm font-medium">
                    {getDocumentoLabel(editingUser)}
                  </Label>
                  <Input
                    id="documento"
                    value={getDocumento(editingUser)}
                    onChange={(e) => {
                      if (editingUser.tipo === "PF") {
                        setEditingUser({ ...editingUser, cpf: e.target.value } as PessoaFisica)
                      } else {
                        setEditingUser({ ...editingUser, cnpj: e.target.value } as PessoaJuridica)
                      }
                    }}
                    className="h-11"
                    placeholder={editingUser.tipo === "PF" ? "000.000.000-00" : "00.000.000/0000-00"}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telefone" className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    value={editingUser.telefone || ""}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, telefone: e.target.value })
                    }
                    className="h-11"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role" className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Tipo de Acesso
                  </Label>
                  <Select
                    value={editingUser.role}
                    onValueChange={(value: "USER" | "ADMIN") =>
                      setEditingUser({ ...editingUser, role: value })
                    }
                  >
                    <SelectTrigger id="role" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">Usuário</SelectItem>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                  <div className="space-y-0.5">
                    <Label htmlFor="ativo" className="text-sm font-medium cursor-pointer">
                      Conta Ativa
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {editingUser.ativo ? "Usuário pode acessar o sistema" : "Usuário bloqueado"}
                    </p>
                  </div>
                  <Switch
                    id="ativo"
                    checked={editingUser.ativo}
                    onCheckedChange={(checked) =>
                      setEditingUser({ ...editingUser, ativo: checked })
                    }
                  />
                </div>
              </div>
            )}
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={() => setEditingUser(null)}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleUpdateUser} 
                className="btn-luxury w-full sm:w-auto order-1 sm:order-2"
              >
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={!!deletingUserId}
          onOpenChange={(open) => !open && setDeletingUserId(null)}
        >
          <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg sm:text-xl">Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription className="text-sm leading-relaxed">
                Esta ação não pode ser desfeita. O usuário será permanentemente removido do
                sistema e todos os dados associados serão perdidos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel className="w-full sm:w-auto m-0">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteUser}
                className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir Usuário
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}