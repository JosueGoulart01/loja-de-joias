'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/auth-context';
import { AlertTriangle, ArrowRight } from 'lucide-react'; // Importei ícones para o aviso

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // --- NOVO STATE PARA CAPS LOCK ---
  const [capsLock, setCapsLock] = useState(false);

  // Função para verificar se o Caps Lock está ativo
  const handleCheckCapsLock = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (e.getModifierState('CapsLock')) {
      setCapsLock(true);
    } else {
      setCapsLock(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const sessaoId = localStorage.getItem("detalheprata:cart-session-id");

      const response = await api.post('/auth/login', { 
        email, 
        senha,
        sessaoId: sessaoId
      });
      
      const { token } = response.data;
      login(token);

    } catch (err: any) {
      setError(err.response?.data?.message || 'E-mail ou senha inválidos.');
      console.error("Erro no login:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg border-none shadow-none bg-transparent">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl luxury-serif">Bem-vindo de volta</CardTitle>
        <CardDescription>Acesse sua conta para continuar</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="bg-input" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input 
              id="senha" 
              type="password" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              required 
              className="bg-input"
              // --- DETECÇÃO DE CAPS LOCK ---
              onKeyDown={handleCheckCapsLock}
              onKeyUp={handleCheckCapsLock}
              onClick={handleCheckCapsLock} // Detecta também ao clicar no campo
              onBlur={() => setCapsLock(false)} // Oculta aviso ao sair do campo
            />
            
            {/* --- AVISO VISUAL --- */}
            {capsLock && (
              <div className="flex items-center gap-2 text-xs text-amber-600 font-medium animate-in fade-in slide-in-from-top-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Caps Lock está ativado</span>
              </div>
            )}
          </div>
          
          {error && <p className="text-sm text-center text-destructive font-medium">{error}</p>}
          
          <div className="flex items-center justify-between">
            <Button variant="link" size="sm" asChild className="p-0">
              <Link href="/esqueci-senha" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Esqueci minha senha
              </Link>
            </Button>
          </div>

          <Button type="submit" className="w-full btn-luxury group" disabled={isLoading}>
            {isLoading ? 'Entrando...' : (
              <span className="flex items-center gap-2">
                Entrar <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>

          <div className="text-center">
            <Button variant="link" size="sm" asChild>
              <Link href="/cadastro" className="text-xs text-muted-foreground">
                Não tem uma conta? Cadastre-se
              </Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}