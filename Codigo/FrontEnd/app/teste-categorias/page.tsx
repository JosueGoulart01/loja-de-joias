// app/teste-categorias/page.tsx
"use client"

import { useState } from "react"

export default function TesteCategorias() {
  const [result, setResult] = useState("Clique em um teste para começar...")
  const [loading, setLoading] = useState(false)
  const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  const testarBackend = async () => {
    setLoading(true)
    setResult("🔄 Testando conexão com backend...")
    try {
      console.log(api_url);
      const response = await fetch(api_url + "/categorias/debug")
      const data = await response.text()
      setResult(`✅ BACKEND FUNCIONANDO!\nStatus: ${response.status}\nResposta: ${data}`)
    } catch (error: any) {
      setResult(`❌ ERRO NO BACKEND:\n${error.message}\n\nVerifique se:\n- Spring Boot está rodando na porta 8080\n- Não há erros no console do Spring`)
    } finally {
      setLoading(false)
    }
  }

  const testarListagem = async () => {
    setLoading(true)
    setResult("🔄 Buscando categorias...")
    try {
      const response = await fetch(api_url + "/categorias")
      const data = await response.json()
      setResult(`✅ LISTAGEM FUNCIONANDO!\nStatus: ${response.status}\nCategorias encontradas: ${data.length}\n\n${JSON.stringify(data, null, 2)}`)
    } catch (error: any) {
      setResult(`❌ ERRO NA LISTAGEM:\n${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testarCriacao = async () => {
    setLoading(true)
    setResult("🔄 Criando categoria de teste...")
    try {
      const categoriaTeste = {
        nome: "Categoria Teste " + new Date().toLocaleTimeString(),
        ativa: true
      }
      
      const response = await fetch(api_url + "/categorias", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoriaTeste)
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      
      const data = await response.json()
      setResult(`✅ CRIAÇÃO FUNCIONANDO!\nStatus: ${response.status}\nCategoria criada:\n${JSON.stringify(data, null, 2)}`)
    } catch (error: any) {
      setResult(`❌ ERRO NA CRIAÇÃO:\n${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testarListagemAdmin = async () => {
    setLoading(true)
    setResult("🔄 Buscando categorias para admin...")
    try {
      const response = await fetch(api_url + "/categorias/admin")
      const data = await response.json()
      setResult(`✅ LISTAGEM ADMIN FUNCIONANDO!\nStatus: ${response.status}\nCategorias encontradas: ${data.length}\n\n${JSON.stringify(data, null, 2)}`)
    } catch (error: any) {
      setResult(`❌ ERRO NA LISTAGEM ADMIN:\n${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧪 Teste de Categorias - Debug Completo</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button 
          onClick={testarBackend}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-3 rounded disabled:bg-gray-400 font-medium"
        >
          Testar Backend
        </button>
        
        <button 
          onClick={testarListagem}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-3 rounded disabled:bg-gray-400 font-medium"
        >
          Testar Listagem
        </button>
        
        <button 
          onClick={testarCriacao}
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-3 rounded disabled:bg-gray-400 font-medium"
        >
          Testar Criação
        </button>
        
        <button 
          onClick={testarListagemAdmin}
          disabled={loading}
          className="bg-orange-500 text-white px-4 py-3 rounded disabled:bg-gray-400 font-medium"
        >
          Testar Listagem Admin
        </button>
      </div>

      <div className="p-4 bg-gray-100 rounded border">
        <pre className="whitespace-pre-wrap text-sm">{loading ? "⏳ Executando teste..." : result}</pre>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded border border-yellow-200">
        <h2 className="font-bold text-yellow-800 mb-2">📋 O Que Verificar:</h2>
        <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
          <li>Spring Boot está rodando na porta 8080</li>
          <li>Não há erros no console do Spring</li>
          <li>Banco de dados PostgreSQL está conectado</li>
          <li>Não há erros de CORS no console do navegador</li>
        </ul>
      </div>
    </div>
  )
}