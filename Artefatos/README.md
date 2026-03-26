###  Artefatos do Projeto
Este diretório armazena toda a documentação e artefatos produzidos durante o ciclo de vida de desenvolvimento do projeto **Detalhes Prata**. Abaixo, a lista detalhada por diretório e seu conteúdo:
* `/Artefatos`

#### 1. Documento de Visão
> *Definição do escopo, problemas a resolver e objetivos do negócio.*

* **[Documento de Visão - Detalhes em Prata](DocumentoDeVisao/Documento%20de%20Visão%20-%20Detalhes%20em%20Prata.docx%20(1).pdf)**
    * *Resumo:* Formaliza a necessidade da cliente Daniela de migrar suas vendas manuais (feitas via WhatsApp/Instagram e planilhas Excel) para uma plataforma de E-Commerce automatizada. O documento define o escopo da solução (Catálogo Online, Carrinho, Checkout e Painel Administrativo) e estabelece os Requisitos Não-Funcionais técnicos, como suporte a 50 usuários simultâneos, responsividade mobile (iOS/Android) e criptografia de senhas.

#### 2. Documentação Geral
* **[Documento E-Book - Detalhes Prata](Documento%20E-Book.pdf)**
* *Resumo:* Documento completo que narra todo o ciclo de vida do projeto. Ele detalha o cenário inicial do cliente (vendas manuais via WhatsApp e Instagram), a especificação da solução de E-commerce, a arquitetura técnica utilizada (Back-end Java Spring Boot e Front-end React) e apresenta o resultado final com as telas desenvolvidas e conclusões sobre o impacto no negócio.
  
#### 3. Atas de Reunião
> *Histórico oficial das reuniões com o cliente, contendo alinhamentos de escopo, aprovações de entregas e solicitações de mudança.*

* **[Ata de Reunião - 14/08/2025 (Kick-off)](Atas/Ata-Primeira-Reuniao.pdf)**
    * *Resumo:* Reunião inicial de alinhamento e análise de negócio. Foram definidos requisitos fundamentais como o filtro por categorias, sistema de cupons, paleta de cores (Cinza, Branco e Preto) e a decisão de priorizar *wireframes* para mobile e suporte via chatbot.

* **[Ata de Reunião - 15/09/2025](Atas/Ata%20de%20Reunião%2015.09.2025.pdf)**
    * *Resumo:* Revisão de progresso da sprint e validação dos fluxos de navegação. O cliente aprovou formalmente os *wireframes* apresentados, liberando o início da próxima fase de desenvolvimento.

* **[Ata de Reunião - 25/09/2025 (Release 1)](Atas/Ata-Reuniao25.09.2025%20(1).pdf)**
    * *Resumo:* Apresentação do primeiro release do software com navegação guiada. O cliente aprovou a entrega, solicitando apenas ajustes pontuais na barra de navegação e um método de edição no rodapé do site.

* **[Ata de Reunião - 17/10/2025](Atas/Ata-Reuniao17.10.2025%20(1).pdf)**
    * *Resumo:* Discussão sobre requisitos fiscais (Nota Fiscal, CPF/CNPJ). Ficou definido como pendência a inclusão de tipos de preço (Normal e Promocional) e listas de categorias para consulta nos filtros.

* **[Ata de Reunião - 03/11/2025](Atas/Ata-Reuniao03.11.2025.pdf)**
    * *Resumo:* Alinhamento sobre o processo legal necessário para a implementação da emissão de notas fiscais. O cliente aprovou o andamento e a equipe focou na correção de pequenos erros apontados.

* **[Ata de Reunião - 17/11/2025](Atas/Ata-Reuniao17.11.2025.pdf)**
    * *Resumo:* Reunião de reta final de desenvolvimento para alinhamento de expectativas. O sistema foi mantido na linha aprovada, com foco total na correção de *bugs* para a entrega final.

* **[Ata de Reunião - 26/11/2025](Atas/Ata-Reuniao26.11.2025.pdf)**
    * *Resumo:* Definições finais sobre hospedagem, manutenção e publicação do site. O cliente sugeriu pequenos ajustes finais necessários para a publicação oficial do sistema.

* `/Artefatos/DocInterfacesDeUsuarios`
    > *Especificações das interfaces gráficas associadas aos Requisitos Funcionais (RF), detalhando como o usuário interage com cada funcionalidade.*
#### 4. Interfaces de Usuário (Requisitos Funcionais)
> *Especificações detalhadas das telas e fluxos de interação do sistema.*

* **[RF01 - Proprietário Gerencia Produtos](DocInterfacesDeUsuarios/Doc%20de%20Interface%20de%20Usuario%20-%20RF01%20Proprietario%20Gerencia%20Produtos.docx)**
    * *Resumo:* Interface administrativa para cadastro e edição de joias. Permite definir nome, categoria, material e preços (Original vs. Atual com validação de promoção). Destaca-se pela funcionalidade de **Gestão de Tamanhos**, onde é possível adicionar estoque específico para cada numeração de anel (ex: Tam 14, Tam 15) e listas de detalhes técnicos.

* **[RF02 - Catálogo de Produtos](DocInterfacesDeUsuarios/Doc%20de%20Interface%20de%20Usuario%20-%20RF02%20Catalogo%20de%20Produtos.docx)**
    * *Resumo:* Interface principal de navegação da loja ("Vitrine"). Apresenta um **Carrossel de Eventos** rotativo no topo para destacar promoções, seguido por uma barra de filtros por categorias (ex: Anéis, Colares, Brincos). A seção de "Novidades" exibe os produtos em grid, onde cada cartão possui botões de ação rápida para **Adicionar ao Carrinho** (verificando estoque automaticamente).

* **[RF03 - Carrinho de Compras](DocInterfacesDeUsuarios/Doc%20de%20Interface%20de%20Usuario%20-%20RF03%20Carrinho%20de%20Compras.docx)**
    * *Resumo:* Interface lateral ("Minha Sacola") que permite ao usuário gerenciar os itens selecionados sem sair da navegação principal. Possui controles intuitivos para ajustar a quantidade de produtos (+/-) ou removê-los. A tela inclui funcionalidades críticas para a decisão de compra: campo para cálculo de frete e prazo via CEP, aplicação de cupons de desconto e exibição dinâmica do Subtotal e Total antes do botão de "Finalizar Compra".

* **[RF04 - Finalizar Compra](DocInterfacesDeUsuarios/Doc%20de%20Interface%20de%20Usuario%20-%20RF04%20Finalizar%20Compra.docx)**
    * *Resumo:* Fluxo de checkout dividido em três etapas sequenciais: **Revisão de Itens**, **Endereço de Entrega** (com preenchimento automático de logradouro via CEP) e **Pagamento**. A interface suporta múltiplos métodos de pagamento: **Cartão de Crédito** (com formulário dinâmico para Número, CVV, Validade e seleção de parcelas), **PIX** (EM MANUTENÇÃO) e **Boleto Bancário**. O documento especifica validações de segurança, como a verificação de campos obrigatórios antes de liberar o botão "Finalizar Compra".

* **[RF06 & 07 - Gerenciar Descontos (CPF/CNPJ)](DocInterfacesDeUsuarios/Doc%20de%20Interface%20de%20Usuario%20-%20RF06%20&%2007%20Gerenciar%20descontos%20CPF%20&%20CNPJ.docx)**
    * *Resumo:* Interface administrativa dedicada à estratégia de vendas, permitindo a criação de cupons segmentados para **Varejo (CPF)** e **Atacado (CNPJ)**. O sistema permite configurar dois tipos de benefício: **Porcentagem** ou **Valor Fixo**. Além disso, oferece controles precisos de validação, como **Valor Mínimo do Pedido** para ativação do desconto (cupom), limite global de usos (ex: "100 primeiros clientes") e um *toggle* rápido para ativar ou desativar promoções instantaneamente.

* **[RF08 - Gerenciar Pedidos](DocInterfacesDeUsuarios/Doc%20de%20Interface%20de%20Usuario%20-%20RF08%20Gerenciar%20Pedidos.docx)**
    * *Resumo:* Painel administrativo para monitoramento de vendas. A tela principal possui abas para filtrar pedidos por status (**Novos**, **Em Preparação**, **Enviados**, **Concluídos**, **Cancelados**). Ao acessar os detalhes de um pedido, o administrador visualiza o resumo financeiro completo (subtotal, frete, descontos e método de pagamento) e possui ferramentas para **atualizar o status** (ex: mudar de "Em Preparação" para "Enviado") e inserir o **Código de Rastreio** da transportadora. O sistema mantém um **Histórico do Pedido** para auditar todas as alterações realizadas.
      
* **[RF09 - Relatório de Produtos Mais Vendidos](DocInterfacesDeUsuarios/Doc%20de%20Interface%20de%20Usuario%20-%20RF09%20Gerar%20Relatório%20-%20Produtos%20mais%20Vendidos.docx)**
    * *Resumo:* Ferramenta estratégica para análise de desempenho de vendas. A interface permite filtrar os resultados por **Período** (Data Inicial e Final), **Categoria** e definir uma **Quantidade Mínima** de vendas para cortar produtos de baixo giro. Possui validações para garantir a consistência das datas e permite ordenação personalizada para facilitar a tomada de decisão sobre reposição de estoque.
   
* **[RF10 - Relatório de Produtos Mais Visualizados](DocInterfacesDeUsuarios/Doc%20de%20Interface%20de%20Usuario%20-%20RF10%20Gerar%20Relatório%20-%20Produtos%20mais%20Visualizados.docx)**
    * *Resumo:* Interface analítica focada no engajamento dos clientes. Além dos filtros padrões de **Período** e **Categoria**, esta tela permite definir um limiar de **Visualizações Mínimas** para filtrar o relatório. O grande diferencial é o filtro de **Taxa de Conversão**, que classifica os produtos em **Alta (>5%)**, **Média (1-5%)** ou **Baixa (<1%)**, permitindo ao administrador identificar gargalos (produtos muito visitados, mas pouco comprados) para ajustes de preço ou marketing.
 
* **[RF11 - Central de Relatórios](DocInterfacesDeUsuarios/Doc%20de%20Interface%20de%20Usuario%20-%20RF11%20Gerar%20Relatórios.docx)**
    * *Resumo:* Tela "Hub" administrativa que centraliza o acesso à inteligência de negócios. Apresenta cards resumidos para os três principais módulos analíticos do sistema: **Produtos Mais Vendidos**, **Produtos Mais Visualizados** e **Dashboard de Vendas**. O objetivo desta interface é oferecer uma navegação rápida, onde o administrador pode ler uma breve descrição do que cada relatório oferece antes de clicar em "Visualizar" para acessar os dados detalhados.

* **[RF12 - Dashboard de Vendas](DocInterfacesDeUsuarios/Doc%20de%20Interface%20de%20Usuario%20-%20RF12%20Gerar%20Dashboard%20de%20Vendas.docx)**
    * *Resumo:* Painel de controle estratégico que exibe a saúde financeira da loja em tempo real. Permite filtrar por período e **comparar com meses anteriores** para visualizar o crescimento (ex: "+20%"). A tela destaca KPIs essenciais como **Faturamento Total** e **Quantidade de Itens Vendidos**, além de apresentar rankings automáticos dos **Top 3 Produtos Mais Vend

* **[RF13 - Login e Cadastro (Pessoa Física)](DocInterfacesDeUsuarios/Doc%20de%20Interface%20de%20Usuario%20-%20RF13%20Login%20&%20Cadastro%20Pessoa%20Fisica.docx)**
    * *Resumo:* Interface de registro de novos usuários. O formulário possui um alternador no topo para selecionar o tipo de conta: **Pessoa Física** ou **Pessoa Jurídica**. Para o cadastro padrão (PF), o sistema exige dados pessoais validados (CPF com máscara, Data de Nascimento para verificação de idade) e dados de contato (Email, Telefone). O documento também especifica os campos de **Endereço de Entrega** (CEP, Logradouro, Bairro, Cidade, Estado), essenciais para o cálculo de frete posterior.

* **[RF14 - Gerenciar Clientes](DocInterfacesDeUsuarios/Doc%20de%20Interface%20de%20Usuario%20-%20RF14%20Gerenciar%20Clientes.docx)**
    * *Resumo:* Interface administrativa para manutenção da base de usuários. A tela inicial apresenta uma lista de cards dos clientes com barra de **Busca** e botões rápidos para **Editar** ou **Remover** contas. No formulário de edição, o administrador pode alterar dados pessoais (CPF, Email), endereço de entrega e até redefinir a **Senha** de acesso. Um recurso estratégico desta tela é o botão **"Histórico de Pedidos"**, que permite navegar diretamente para todas as compras realizadas por aquele cliente específico.

* **[RF15 - Gerenciar Categorias](DocInterfacesDeUsuarios/Doc%20de%20Interface%20de%20Usuario%20-%20RF15.1%20Proprietario%20Cria%20Categorias.docx)**
    * *Resumo:* Funcionalidade para criar e editar as categorias de produtos (ex: Colares, Anéis) que aparecem no menu da loja.

* **[RF16 - Gerenciar Estoque](DocInterfacesDeUsuarios/Doc%20de%20Interface%20de%20Usuario%20-%20RF16%20Gerenciar%20Estoque.docx)**
    * *Resumo:* Interface para controle rigoroso do inventário físico. A tela principal lista os produtos com seus saldos atuais e botões para acessar o **Histórico de Movimentações**, onde é possível auditar todas as entradas e saídas (com data e descrição). O documento especifica um modal de **"Novo Movimento"**,        permitindo ao administrador registrar manualmente reposições (**Entrada**) ou baixas por perda/ajuste (**Saída**

* `/Artefatos/DiagramasDeCasosDeUso`
    > *Representação visual das funcionalidades do sistema e como os atores (usuários) interagem com elas.*
> *Representação técnica da arquitetura e funcionalidades do sistema.*
* **[Diagrama de Caso de Uso - Visão Geral](DiagramasDeCasosDeUso/Diagrama-CasoDeUso.drawio%20(10).png)**
    * *Resumo:* Mapa visual das interações do sistema. O diagrama identifica os atores principais: **Cliente** (focado na jornada de compra: consultar catálogo, gerenciar carrinho e finalizar pedido) e **Proprietário** (focado na gestão: CRUD de produtos, controle de estoque, criação de descontos e visualização de relatórios/KPIs). Também ilustra as relações de *include* e *extend* entre as funcionalidades, como a necessidade de login para acessar a área administrativa.
    * **/CasosDeUsoDescritivos**:
      
    **[Especificação de Caso de Uso - Gerar Relatórios](DiagramasDeCasosDeUso/CasosDeUsoDescritivos/Gerar%20Relatorios.pdf)**
    * *Resumo:* Documento técnico que descreve o passo a passo lógico da funcionalidade de inteligência de negócios. Detalha o **Fluxo Principal** (onde o Proprietário seleciona Data Inicial/Final, Categoria e Ordenação) e os **Fluxos Alternativos e de Exceção**, como o tratamento de erro quando a "Data Final é anterior à Inicial" ou quando "Nenhum dado é encontrado" para os filtros aplicados.**
    * *Resumo:* Documento técnico que descreve o passo a passo lógico da funcionalidade de inteligência de negócios. Detalha o **Fluxo Principal** (onde o Proprietário seleciona Data Inicial/Final, Categoria e Ordenação) e os **Fluxos Alternativos e de Exceção**, como o tratamento de erro quando a "Data Final é anterior à Inicial" ou quando "Nenhum dado é encontrado" para os filtros aplicados.
   * **[Especificação de Caso de Uso - Gerenciar Pedidos em Andamento](DiagramasDeCasosDeUso/CasosDeUsoDescritivos/Gerenciar%20Pedidos%20em%20Andamento.pdf)**
    * *Resumo:* Descreve o fluxo operacional logístico. Detalha como o Proprietário acessa a lista de vendas, utiliza filtros de status (como "Em Preparação") e acessa os detalhes de um pedido específico. O ponto principal deste caso de uso é a ação de **Atualizar Status** (ex: mudar para "Enviado") e a inserção obrigatória do **Código de Rastreio**, finalizando o ciclo de envio da mercadoria.

* `/Artefatos/DiagramaUML`
    > *Modelagem estrutural do software.*
> *Modelagem estrutural do sistema, definindo as entidades e seus relacionamentos.*
* **[Diagrama de Classes - Visualização](DiagramaUML/DiagramaDeClasses.jpg)**
    * *Resumo:* Representação estática da estrutura do sistema. O diagrama detalha as principais classes do domínio, como **Usuário** (com especializações para Cliente e Proprietário), **Produto** (com seus atributos de estoque e preço), **Pedido** e **ItemPedido**. Ele ilustra os relacionamentos de cardinalidade (ex: um Pedido tem muitos Itens) e serve como base para a implementação do Banco de Dados Relacional e das Entidades no Back-end.
* **[Arquivo Fonte Astah (.asta)](DiagramaUML/diagramaDeClasses.asta)**
    * *Resumo:* Arquivo editável original do diagrama, criado na ferramenta Astah. Disponibilizado para permitir a evolução futura da modelagem e manutenção do projeto.

* `/Artefatos/Termos`
    > *Documentação legal e administrativa necessária para a formalização do projeto junto à universidade ou cliente.*
    * **Procuração NIT - Puc Minas.pdf**: Documento de procuração.
    * **Termo de Ciência, Anuência e Compromisso.pdf**: Formalização de compromisso da equipe.
    * **Termo de Sigilo e Confidencialidade.pdf**: Acordo de não divulgação (NDA) de dados sensíveis do cliente.

***
