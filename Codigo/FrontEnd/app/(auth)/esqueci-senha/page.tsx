'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/services/api';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { set } from 'react-hook-form';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    /* try {
      const response = await api.get('/usuarios/buscar', { params: { email } });
      if (response.status === 200) {
        setIsResetting(true);
      } else {
        setError('Ocorreu um erro ao processar sua solicitação. Tente novamente.');
      }
    } catch (err) {
      setError('Ocorreu um erro ao processar sua solicitação. Tente novamente.');
      console.error("Erro ao solicitar redefinição de senha:", err);
    } finally {
      setIsLoading(false);
    } */

    try {
      await api.post('/auth/esqueci-senha', { email });
      setMessage('Se o e-mail estiver cadastrado em nosso sistema, você receberá um link para redefinir sua senha em breve.');
    } catch (err) {
      setError('Ocorreu um erro ao processar sua solicitação. Tente novamente.');
      console.error("Erro ao solicitar redefinição de senha:", err);
    } finally {
      setIsLoading(false);
    }
    
  };
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');
    //check if password has more than 8 characters
    if(password.length < 8){
      setError('A senha deve ter no mínimo 8 caracteres.');
      setIsLoading(false);
      return;
    }
    if(password !== confirmPassword){
      setError('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }
    try {
      const id = (await api.get('/usuarios/buscar', { params: { email } })).data.id;
      await api.post('/auth/set-senha', { id: id, //TODO: remover assim que nao precisar mais
        token: '1',
        newPassword: password 
      });
      setMessage('Senha redefinida com sucesso. Você já pode fazer login com sua nova senha.');
      setIsResetting(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      /* setTimeout(() => {
        globalThis.location.href = '/login';
      }, 3000); */
    } catch (err) {
      setError('Ocorreu um erro ao redefinir sua senha. Tente novamente.');
      console.error("Erro ao redefinir senha:", err);
    } finally {
      setIsLoading(false);
    }
  };
  /* if(isResetting)
    return (
    <Card className="w-full max-w-lg border-none shadow-none bg-transparent">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl luxury-serif">Recuperar Senha</CardTitle>
        <CardDescription>Digite sua nova senha.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleReset} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">Nova Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua nova senha"
              className="bg-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua nova senha"
              className="bg-input"
            />
          </div>
          {error && <p className="text-sm text-center text-destructive">{error}</p>}
          <Button className="w-full btn-luxury" disabled={isLoading}>
            {isLoading ? "Redefinindo..." : "Redefinir Senha"}
          </Button>
        </form>
      </CardContent>
    </Card>
  ); */
  return (
    <Card className="w-full max-w-lg border-none shadow-none bg-transparent">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl luxury-serif">Recuperar Senha</CardTitle>
        <CardDescription>Digite seu e-mail.</CardDescription>
      </CardHeader>
      <CardContent>
        {message ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-green-600">{message}</p>
            <Button variant="outline" asChild>
              <Link href="/login" className="inline-flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para o Login
              </Link>
            </Button>
          </div>
        ) : (
          <form className="space-y-6"
          onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu-email@exemplo.com"
                required
                disabled={isLoading}
                className="bg-input"
              />
            </div>
            
            {error && <p className="text-sm text-center text-destructive">{error}</p>}
            
            <Button type="submit" className="w-full btn-luxury" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Redefinir senha"}
            </Button>
            
            <div className="text-center">
                <Button variant="link" size="sm" asChild>
                    <Link href="/login" className="text-xs text-muted-foreground">
                        Lembrou a senha? Voltar para o login
                    </Link>
                </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

