'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/services/api';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';


// Componente interno que lida com a lógica para evitar erros com Suspense
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Efeito para ler o token da URL assim que a página carrega
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Token de redefinição inválido ou não encontrado na URL.');
    }
  }, [searchParams]);

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // Envia o token e a nova senha para o backend
      await api.post('/auth/redefinir-senha', {
        token,
        newPassword: password,
      });

      setMessage('Senha redefinida com sucesso! Você será redirecionado para o login em alguns segundos.');
      // Redireciona para o login após 4 segundos
      setTimeout(() => {
        router.push('/login');
      }, 4000);

    } catch (err: any) {
      const errorMessage = err.response?.data || "Token inválido ou expirado. Por favor, solicite um novo link.";
      //setError(errorMessage);
      console.error("Erro ao redefinir senha:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Se uma mensagem de sucesso for mostrada, exibe apenas ela.
  if (message) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-green-600">{message}</p>
        <Button variant="outline" asChild>
          <Link href="/login" className="inline-flex items-center">
            Ir para o Login Agora
          </Link>
        </Button>
      </div>
    );
  }

  // Se houver um erro fundamental (como a falta do token), mostra o erro.
  if (!token && error) {
      return (
          <div className="text-center space-y-4">
              <p className="text-sm text-red-600">{error}</p>
              <Button variant="outline" asChild>
                  <Link href="/esqueci-senha">
                      Solicitar Novo Link
                  </Link>
              </Button>
          </div>
      )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="password">Nova Senha</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          className="bg-input"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirme a Nova Senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
          className="bg-input"
        />
      </div>
      
      {error && <p className="text-sm text-center text-red-500">{error}</p>}
      
      <Button type="submit" className="w-full btn-luxury" disabled={isLoading}>
        {isLoading ? "Salvando..." : "Redefinir Senha"}
      </Button>
      
      <div className="text-center">
          <Button variant="ghost" size="sm" asChild>
              <Link href="/login" className="text-xs text-gray-500 inline-flex items-center">
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Voltar para o login
              </Link>
          </Button>
      </div>
    </form>
  );
}

// Componente principal da página que organiza o Card e o formulário
export default function ResetPasswordPage() {
    return (
        <Card className="w-full max-w-lg border-none shadow-none bg-transparent">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl luxury-serif">Crie uma Nova Senha</CardTitle>
                <CardDescription>Digite e confirme sua nova senha abaixo.</CardDescription>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<div>Carregando...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </CardContent>
        </Card>
    )
}