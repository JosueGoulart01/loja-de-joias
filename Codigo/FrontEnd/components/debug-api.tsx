"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ApiDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  const testApi = async () => {
    try {
      const response = await fetch(api_url + '/categorias/debug')
      const text = await response.text()
      setDebugInfo({
        status: response.status,
        statusText: response.statusText,
        data: text
      })
    } catch (error) {
      setDebugInfo({ error: error instanceof Error ? error.message : 'Erro desconhecido' })
    }
  }

  const testAdminApi = async () => {
    try {
      const response = await fetch(api_url + '/categorias/admin')
      const text = await response.text()
      setDebugInfo({
        status: response.status,
        statusText: response.statusText,
        data: text
      })
    } catch (error) {
      setDebugInfo({ error: error instanceof Error ? error.message : 'Erro desconhecido' })
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Debug API</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testApi} variant="outline">
            Testar Debug Endpoint
          </Button>
          <Button onClick={testAdminApi} variant="outline">
            Testar Admin Endpoint
          </Button>
        </div>
        {debugInfo && (
          <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  )
}