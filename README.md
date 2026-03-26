# Detalhes Prata

O projeto consiste na criação de um site de vendas automatizado para a loja "Detalhes em Prata", que hoje realiza suas vendas de forma manual pelo WhatsApp e Instagram. O objetivo é desenvolver uma plataforma de e-commerce para facilitar a comercialização de joias e otimizar tanto a experiência do cliente quanto o controle administrativo do negócio.

A solução permitirá que os produtos sejam exibidos em um catálogo online completo, com fotos, descrições detalhadas e informações de estoque. Os clientes poderão navegar por categorias, adicionar produtos ao carrinho e finalizar a compra diretamente pelo site, com diversos métodos de pagamento. Para a proprietária, o sistema oferecerá um painel administrativo para gerenciar produtos, estoque e visualizar relatórios, substituindo o controle manual e fortalecendo a imagem da marca.

## Alunos integrantes da equipe

* Josue Carlos Goulart Dos Reis
* Kelvyn Dantas Leal
* Luiz Fernando Batista Moreira
* Miguel Gomes do Nascimento
* Nicolas Kiffer de Oliveira Soares

## Professores responsáveis

* Eveline Alonso Veloso
* Juliana Amaral Baroni de Carvalho

## Instruções de utilização

Essa sessão de instruções assume que você tem **Docker, Java 21, Maven e Node.js (com PNPM)** instalados.

### 1. Configurar o Ambiente

**a. Banco de Dados (Back-end):**

Crie um arquivo `docker-compose.yml` na raiz do projeto com o conteúdo abaixo e, no terminal, execute `docker-compose up -d`.

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres-db:
    image: postgres:15-alpine
    container_name: detalhes-prata-db
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=seu-usuario
      - POSTGRES_PASSWORD=sua-senha-forte
      - POSTGRES_DB=detalhesprata
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
```

**b. Variáveis de Ambiente (Back-end):**

Acesse `Codigo/BackEnd/src/main/resources/`, acesse -> `application.properties`. Preencha com suas credenciais do banco de dados e outras chaves de API.

**c. Variáveis de Ambiente (Front-end):**

Crie o arquivo `Codigo/FrontEnd/.env.local` e adicione a seguinte linha:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 2. Executar a Aplicação

1.  **Instalar dependências do Front-end:** `cd Codigo/FrontEnd && pnpm install`
2.  **Iniciar o Back-end:** `cd Codigo/BackEnd && mvn spring-boot:run`
3.  **Iniciar o Front-end (em outro terminal):** `cd Codigo/FrontEnd && pnpm run dev`

Acesse a loja em **http://localhost:3000**.
