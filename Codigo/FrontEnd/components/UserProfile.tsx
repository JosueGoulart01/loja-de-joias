'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Save, User, Building } from 'lucide-react';

// Interface para os tipos das props dos sub-componentes
interface FormularioProps {
  data: any;
  isEditing: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

// --- Sub-componente para o formulário de Pessoa Física ---
const FormularioPessoaFisica = ({ data, isEditing, handleChange, handleSelectChange }: FormularioProps) => (
  <div className="space-y-8">
    <section>
        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Informações Pessoais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"> <Label htmlFor="nome">Nome</Label> <Input id="nome" name="nome" value={data.nome || ''} onChange={handleChange} disabled={!isEditing} /> </div>
            <div className="space-y-2"> <Label htmlFor="sobrenome">Sobrenome</Label> <Input id="sobrenome" name="sobrenome" value={data.sobrenome || ''} onChange={handleChange} disabled={!isEditing} /> </div>
            <div className="space-y-2"> <Label htmlFor="dataNascimento">Data de Nascimento</Label> <Input id="dataNascimento" name="dataNascimento" type="date" value={data.dataNascimento || ''} onChange={handleChange} disabled={!isEditing} /> </div>
            <div className="space-y-2"> <Label htmlFor="cpf">CPF</Label> <Input id="cpf" name="cpf" value={data.cpf || ''} disabled /> </div>
            <div className="space-y-2"> <Label htmlFor="email">E-mail</Label> <Input id="email" name="email" type="email" value={data.email || ''} onChange={handleChange} disabled={!isEditing} /> </div>
            <div className="space-y-2"> <Label htmlFor="telefone">Telefone</Label> <Input id="telefone" name="telefone" type="tel" value={data.telefone || ''} onChange={handleChange} disabled={!isEditing} /> </div>
        </div>
    </section>
    
    <section>
      <h3 className="text-lg font-semibold border-b pb-2 mb-4">Endereço de Entrega</h3>
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
        <div className="space-y-2 sm:col-span-4"> <Label htmlFor="endereco.rua">Rua</Label> <Input name="endereco.rua" value={data.endereco?.rua || ''} onChange={handleChange} disabled={!isEditing} /> </div>
        <div className="space-y-2 sm:col-span-2"> <Label htmlFor="endereco.numero">Número</Label> <Input name="endereco.numero" value={data.endereco?.numero || ''} onChange={handleChange} disabled={!isEditing} /> </div>
        <div className="space-y-2 sm:col-span-3"> <Label htmlFor="endereco.complemento">Complemento</Label> <Input name="endereco.complemento" value={data.endereco?.complemento || ''} onChange={handleChange} disabled={!isEditing} /> </div>
        <div className="space-y-2 sm:col-span-3"> <Label htmlFor="endereco.bairro">Bairro</Label> <Input name="endereco.bairro" value={data.endereco?.bairro || ''} onChange={handleChange} disabled={!isEditing} /> </div>
        <div className="space-y-2 sm:col-span-3"> <Label htmlFor="endereco.cidade">Cidade</Label> <Input name="endereco.cidade" value={data.endereco?.cidade || ''} onChange={handleChange} disabled={!isEditing} /> </div>
        <div className="space-y-2 sm:col-span-1"> <Label htmlFor="endereco.estado">Estado</Label> <Input name="endereco.estado" value={data.endereco?.estado || ''} onChange={handleChange} disabled={!isEditing} /> </div>
        <div className="space-y-2 sm:col-span-2"> <Label htmlFor="endereco.cep">CEP</Label> <Input name="endereco.cep" value={data.endereco?.cep || ''} onChange={handleChange} disabled={!isEditing} /> </div>
        <div className="space-y-2 sm:col-span-6"> <Label htmlFor="endereco.pontoReferencia">Ponto de Referência</Label> <Input name="endereco.pontoReferencia" value={data.endereco?.pontoReferencia || ''} onChange={handleChange} disabled={!isEditing} /> </div>
      </div>
    </section>

    <div className="space-y-2"> <Label>Preferência de Contato</Label> <Select name="preferenciaContato" value={data.preferenciaContato} onValueChange={(value) => handleSelectChange('preferenciaContato', value)} disabled={!isEditing}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="WHATSAPP">WhatsApp</SelectItem><SelectItem value="EMAIL">E-mail</SelectItem><SelectItem value="LIGACAO">Ligação</SelectItem></SelectContent></Select> </div>
  </div>
);

const FormularioPessoaJuridica = ({ data, isEditing, handleChange, handleSelectChange }: FormularioProps) => (
    <div className="space-y-8">
        <section>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Dados da Empresa</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"> <Label htmlFor="cnpj">CNPJ</Label> <Input id="cnpj" value={data.cnpj || ''} disabled /> </div>
                <div className="space-y-2"> <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label> <Input id="inscricaoEstadual" name="inscricaoEstadual" value={data.inscricaoEstadual || ''} onChange={handleChange} disabled={!isEditing} /> </div>
                <div className="space-y-2"> <Label htmlFor="nomeFantasia">Nome Fantasia</Label> <Input id="nomeFantasia" name="nomeFantasia" value={data.nomeFantasia || ''} onChange={handleChange} disabled={!isEditing} /> </div>
                <div className="space-y-2"> <Label htmlFor="razaoSocial">Razão Social</Label> <Input id="razaoSocial" name="razaoSocial" value={data.razaoSocial || ''} onChange={handleChange} disabled={!isEditing} /> </div>
                <div className="space-y-2"> <Label htmlFor="email">E-mail</Label> <Input id="email" name="email" type="email" value={data.email || ''} onChange={handleChange} disabled={!isEditing} /> </div>
                <div className="space-y-2"> <Label htmlFor="telefone">Telefone</Label> <Input id="telefone" name="telefone" type="tel" value={data.telefone || ''} onChange={handleChange} disabled={!isEditing} /> </div>
            </div>
        </section>
        <section>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Responsável</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"> <Label htmlFor="nomeResponsavel">Nome do Responsável</Label> <Input id="nomeResponsavel" name="nomeResponsavel" value={data.nomeResponsavel || ''} onChange={handleChange} disabled={!isEditing} /> </div>
                <div className="space-y-2"> <Label htmlFor="sobrenomeResponsavel">Sobrenome do Responsável</Label> <Input id="sobrenomeResponsavel" name="sobrenomeResponsavel" value={data.sobrenomeResponsavel || ''} onChange={handleChange} disabled={!isEditing} /> </div>
            </div>
        </section>
        <section>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Endereço da Empresa</h3>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                <div className="space-y-2 sm:col-span-4"> <Label htmlFor="enderecoEmpresa.rua">Rua</Label> <Input name="enderecoEmpresa.rua" value={data.enderecoEmpresa?.rua || ''} onChange={handleChange} disabled={!isEditing} /> </div>
                <div className="space-y-2 sm:col-span-2"> <Label htmlFor="enderecoEmpresa.numero">Número</Label> <Input name="enderecoEmpresa.numero" value={data.enderecoEmpresa?.numero || ''} onChange={handleChange} disabled={!isEditing} /> </div>
            </div>
        </section>
        <section>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Endereço de Entrega</h3>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                <div className="space-y-2 sm:col-span-4"> <Label htmlFor="enderecoEntrega.rua">Rua</Label> <Input name="enderecoEntrega.rua" value={data.enderecoEntrega?.rua || ''} onChange={handleChange} disabled={!isEditing} /> </div>
                <div className="space-y-2 sm:col-span-2"> <Label htmlFor="enderecoEntrega.numero">Número</Label> <Input name="enderecoEntrega.numero" value={data.enderecoEntrega?.numero || ''} onChange={handleChange} disabled={!isEditing} /> </div>
            </div>
        </section>
        <div className="space-y-2"> <Label>Como nos conheceu</Label> <Select name="comoNosConheceu" value={data.comoNosConheceu} onValueChange={(value) => handleSelectChange('comoNosConheceu', value)} disabled={!isEditing}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="INSTAGRAM">Instagram</SelectItem><SelectItem value="SITE">Site</SelectItem><SelectItem value="INDICACAO">Indicação</SelectItem></SelectContent></Select> </div>
    </div>
);

export function UserProfile() {
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) { router.push('/login'); return; }

      try {
        const response = await fetch(api_url + '/usuarios/perfil', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Falha ao carregar o perfil. A sua sessão pode ter expirado.');
        const data = await response.json();
        setUserData(data);
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Ocorreu um erro desconhecido.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
        const [outerKey, innerKey] = name.split('.');
        setUserData((prev: any) => ({
            ...prev,
            [outerKey]: {
                ...prev[outerKey],
                [innerKey]: value
            }
        }));
    } else {
        setUserData((prev: any) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setUserData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('authToken');
    if (!userData || !token) return;

    const isPessoaFisica = userData.cpf;
    const endpoint = isPessoaFisica ? '/perfil/pf' : '/perfil/pj';
    const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    const url = api_url + `/usuarios${endpoint}`;
    

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
          let errorMsg = 'Falha ao atualizar o perfil.';
          try {
              const errorData = await response.json();
              errorMsg = errorData.message || errorMsg;
          } catch(e) {
              // Mantém a mensagem genérica se o corpo do erro não for JSON
          }
          throw new Error(errorMsg);
      }

      alert('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error: any) { 
        console.error("Erro ao salvar:", error);
        alert(`Erro ao salvar: ${error.message}`);
    }
  };

  if (isLoading) return <div className="text-center p-10">A carregar...</div>;
  if (error) return <div className="text-center p-10 text-destructive">{error}</div>;
  if (!userData) return <div className="text-center p-10 text-destructive">Não foi possível carregar os dados do utilizador.</div>;
  
  const isPessoaFisica = userData.cpf;

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-card shadow-md rounded-lg">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <div className="flex items-center gap-4">
          {isPessoaFisica ? <User className="h-8 w-8 text-primary" /> : <Building className="h-8 w-8 text-primary" />}
          <h1 className="text-2xl font-bold">O Meu Perfil</h1>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}><Edit className="mr-2 h-4 w-4" /> Editar</Button>
        ) : (
          <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Salvar</Button>
        )}
      </div>

      {isPessoaFisica ? 
        <FormularioPessoaFisica data={userData} isEditing={isEditing} handleChange={handleChange} handleSelectChange={handleSelectChange} /> : 
        <FormularioPessoaJuridica data={userData} isEditing={isEditing} handleChange={handleChange} handleSelectChange={handleSelectChange} />}
    </div>
  );
}