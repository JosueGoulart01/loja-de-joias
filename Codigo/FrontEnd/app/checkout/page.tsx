'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from 'next/image';
import { 
  MapPin, Loader2, ShoppingCart, CheckCircle2, Lock, ArrowRight, ShieldCheck 
} from 'lucide-react';

import { useCart } from "@/contexts/cart-context";
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/services/api';
import { useToast } from "@/hooks/use-toast";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

// --- TIPOS ---
interface Endereco {
    id: number;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    complemento?: string;
}

// --- PÁGINA PRINCIPAL ---
export default function CheckoutPage() {
  const { cart, isLoading, clearCart } = useCart();
  const { usuario } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Estados para Endereço
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [enderecoSelecionadoId, setEnderecoSelecionadoId] = useState<number | null>(null);
  const [loadingEnderecos, setLoadingEnderecos] = useState(true);

  // 1. BUSCAR DADOS DO USUÁRIO
  useEffect(() => {
    const fetchUserData = async () => {
        if (!usuario) return;

        try {
            const response = await api.get('/usuarios/perfil'); 
            const data = response.data;
            const listaEnderecos: Endereco[] = [];

            // Adiciona endereços disponíveis na lista
            if (data.endereco) listaEnderecos.push(data.endereco);
            if (data.enderecoEntrega) listaEnderecos.push(data.enderecoEntrega);
            if (data.enderecoEmpresa) listaEnderecos.push(data.enderecoEmpresa);

            setEnderecos(listaEnderecos);
            
            // Seleciona o primeiro por padrão
            if (listaEnderecos.length > 0) {
                setEnderecoSelecionadoId(listaEnderecos[0].id);
            }
        } catch (error) {
            console.error("Erro ao buscar endereços", error);
            toast({
                title: "Erro de Conexão",
                description: "Não foi possível carregar seus endereços.",
                variant: "destructive"
            });
        } finally {
            setLoadingEnderecos(false);
        }
    };

    fetchUserData();
  }, [usuario, toast]);

  // --- HANDLERS ---
  
  // Abre o modal de confirmação
  const handleInitiateCheckout = () => {
    if (!enderecoSelecionadoId) {
        toast({
            title: "Endereço Obrigatório",
            description: "Por favor, selecione ou cadastre um endereço de entrega.",
            variant: "destructive"
        });
        return;
    }
    setIsConfirmOpen(true);
  };

  // Cria o pedido no backend
  const handleConfirmOrder = async () => {
    if (!cart || !enderecoSelecionadoId) return;
    setProcessing(true);

    try {
        const payload = {
            valor: cart.subtotal, 
            frete: cart.valorFrete,
            metodoPagamento: 'Stripe Elements', // Genérico, pois será decidido na próxima tela
            codigoPagamento: 'AGUARDANDO_PAGAMENTO',
            status: 'Aguardando pagamento',
            usuarioId: null, // Backend pega pelo token
            email: usuario?.sub, 
            listaId: cart.id,
            cupomCodigo: cart.cupomCodigo,
            enderecoId: enderecoSelecionadoId 
        };

        // 1. Cria o Pedido
        const response = await api.post('/pedidos', payload);
        const novoPedido = response.data;
        
        // 2. Limpa Carrinho
        await clearCart(); 
        setIsConfirmOpen(false);
        
        // 3. Redirecionamento Direto para Pagamento
        toast({
            title: "Pedido Iniciado",
            description: "Redirecionando para o pagamento seguro...",
        });
        router.push(`/pedido/pagamento/${novoPedido.id}`);

    } catch (error: any) {
        console.error(error);
        toast({
            title: "Erro ao processar",
            description: error.response?.data?.message || "Ocorreu um erro ao criar o pedido.",
            variant: "destructive"
        });
    } finally {
        setProcessing(false);
    }
  };

  // --- RENDERIZAÇÃO ---
  if (isLoading) return (
    <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin h-10 w-10 text-primary"/>
        </div>
        <Footer />
    </div>
  );
  
  if (!cart || cart.itens.length === 0) return (
    <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center px-4">
            <div className="bg-muted/30 p-6 rounded-full">
                <ShoppingCart className="h-12 w-12 text-muted-foreground"/>
            </div>
            <div>
                <h2 className="luxury-title text-2xl mb-2">Seu carrinho está vazio</h2>
                <p className="text-muted-foreground">Explore nossas coleções e adicione itens.</p>
            </div>
            <Link href="/"><Button className="btn-luxury px-8">Voltar às compras</Button></Link>
        </div>
        <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto py-8 px-4 md:px-8 max-w-6xl">
            
            {/* MODAL DE CONFIRMAÇÃO FINAL */}
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent className="w-[90vw] max-w-md bg-card border-border">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-lg luxury-title font-normal">
                            <CheckCircle2 className="text-primary h-5 w-5 shrink-0"/> Confirmar Pedido?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3 text-sm text-muted-foreground pt-2">
                            <div className="flex justify-between border-b border-border/50 pb-2">
                                <span>Total a pagar:</span>
                                <strong className="text-foreground">R$ {cart.total.toFixed(2)}</strong>
                            </div>
                            <p className="text-xs">Ao confirmar, você será redirecionado para realizar o pagamento de forma segura.</p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                        <AlertDialogCancel disabled={processing} className="text-xs sm:text-sm h-10">Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={(e) => { e.preventDefault(); handleConfirmOrder(); }} 
                            disabled={processing} 
                            className="btn-luxury text-xs sm:text-sm h-10"
                        >
                            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "IR PARA PAGAMENTO"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <h1 className="luxury-title text-3xl mb-8 font-light tracking-wide">Checkout</h1>
            
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* 1. ENDEREÇO */}
                    <Card className="border-border/60 shadow-sm overflow-hidden">
                        <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
                            <CardTitle className="flex items-center gap-2 text-lg font-medium font-serif">
                                <MapPin className="h-5 w-5 text-primary shrink-0"/> Endereço de Entrega
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 text-sm">
                            {loadingEnderecos ? (
                                <div className="flex justify-center p-4"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground"/></div>
                            ) : enderecos.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                                    <p>Nenhum endereço cadastrado.</p>
                                    <Link href="/perfil" className="text-primary underline mt-2 block hover:text-primary/80 font-medium">
                                        + Cadastrar Novo Endereço
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {enderecos.map((end) => (
                                        <div 
                                            key={end.id} 
                                            onClick={() => setEnderecoSelecionadoId(end.id)}
                                            className={`relative p-4 border rounded-lg cursor-pointer transition-all duration-200 flex items-start gap-4 group ${
                                                enderecoSelecionadoId === end.id 
                                                ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm' 
                                                : 'border-border hover:border-primary/40 hover:bg-muted/10'
                                            }`}
                                        >
                                            <div className={`mt-1 h-5 w-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                                enderecoSelecionadoId === end.id ? 'border-primary' : 'border-muted-foreground group-hover:border-primary/60'
                                            }`}>
                                                {enderecoSelecionadoId === end.id && <div className="h-2.5 w-2.5 rounded-full bg-primary"/>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <p className="font-medium text-sm text-foreground">{end.rua}, {end.numero}</p>
                                                    {enderecoSelecionadoId === end.id && <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Selecionado</span>}
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">{end.bairro} - {end.cidade}/{end.estado}</p>
                                                <p className="text-xs text-muted-foreground">CEP: {end.cep}</p>
                                                {end.complemento && <p className="text-xs text-muted-foreground italic mt-1">Comp: {end.complemento}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* 2. ITENS (COLLAPSIBLE) */}
                    <Card className="border-border/60 shadow-sm">
                        <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
                            <CardTitle className="text-lg font-medium font-serif flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-primary"/> Itens ({cart.quantidadeTotal})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6 text-sm">
                            {cart.itens.map((item) => (
                                <div key={item.id} className="flex justify-between items-center border-b border-border/30 pb-4 last:border-0 last:pb-0 gap-3">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="h-16 w-16 bg-muted rounded-md overflow-hidden shrink-0 relative border border-border">
                                            <Image src={item.imagemUrl || "/placeholder.png"} alt={item.nomeProduto} fill className="object-cover"/>
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground text-base">{item.nomeProduto}</p>
                                            <div className="flex gap-2 mt-1">
                                                <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">Qtd: {item.quantidade}</span>
                                                {item.tamanho && <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">Tam: {item.tamanho}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="font-medium text-foreground whitespace-nowrap">R$ {item.subtotal.toFixed(2)}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* SIDEBAR: RESUMO E AÇÃO */}
                <div className="space-y-6">
                    <Card className="bg-card border-border sticky top-24 shadow-md overflow-hidden">
                        <CardHeader className="pb-4 border-b border-border/40 bg-muted/30">
                            <CardTitle className="luxury-title text-xl">Resumo do Pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-6">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Subtotal</span>
                                <span>R$ {cart.subtotal.toFixed(2)}</span>
                            </div>
                            {cart.desconto > 0 && (
                                <div className="flex justify-between text-sm text-green-600 font-medium">
                                    <span>Desconto</span>
                                    <span>- R$ {cart.desconto.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Frete</span>
                                <span>R$ {cart.valorFrete.toFixed(2)}</span>
                            </div>
                            
                            <Separator className="bg-border my-2"/>
                            
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-base font-medium">Total</span>
                                <span className="text-2xl font-serif font-medium text-foreground">R$ {cart.total.toFixed(2)}</span>
                            </div>

                            <Button 
                                onClick={handleInitiateCheckout} 
                                className="w-full btn-luxury h-12 text-base shadow-lg hover:shadow-xl transition-all"
                            >
                                <ShieldCheck className="mr-2 h-5 w-5" />
                                Ir para Pagamento
                                <ArrowRight className="ml-2 h-4 w-4 opacity-70" />
                            </Button>
                            
                            <p className="text-xs text-center text-muted-foreground mt-2">
                                Você será redirecionado para um ambiente seguro para escolher a forma de pagamento (Cartão, Pix, etc).
                            </p>
                        </CardContent>
                        <CardFooter className="text-[10px] uppercase tracking-widest text-muted-foreground justify-center bg-muted/10 py-3 border-t border-border/40">
                            <Lock className="h-3 w-3 mr-1.5"/> Checkout Seguro SSL
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </main>
        
        <Footer />
    </div>
  );
}