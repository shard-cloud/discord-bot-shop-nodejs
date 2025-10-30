# Sistema de Loja Virtual

## 🛒 Visão Geral

O sistema de loja virtual é o coração do bot, permitindo que administradores criem e gerenciem produtos digitais que os usuários podem comprar com moedas virtuais. O sistema oferece uma experiência completa de e-commerce dentro do Discord.

## 🎯 Funcionalidades Principais

### ✨ Características da Loja
- **Produtos Virtuais** com preços, descrições e imagens
- **Categorias** para organização dos produtos
- **Controle de Estoque** em tempo real
- **Sistema de Compra** com validação automática
- **Histórico de Transações** completo
- **Interface Interativa** com botões e menus
- **Sistema de Logs** para auditoria

### 🎮 Experiência do Usuário
- **Navegação Intuitiva** com botões e menus
- **Visualização Detalhada** dos produtos
- **Compra Segura** com confirmação
- **Inventário Pessoal** para gerenciar itens
- **Histórico de Compras** completo

## 🛠️ Comandos da Loja

### 👥 Comandos para Usuários

#### `/shop [categoria]`
**Descrição:** Abre a loja do servidor
**Uso:** `/shop` ou `/shop categoria:Games`
**Funcionalidades:**
- Exibe produtos disponíveis
- Navegação por páginas
- Filtro por categoria
- Interface interativa com botões

**Exemplo:**
```
/shop categoria:Games
```

#### `/product <nome>`
**Descrição:** Visualiza detalhes de um produto específico
**Uso:** `/product nome:VIP Pass`
**Funcionalidades:**
- Informações completas do produto
- Preço e estoque atual
- Descrição detalhada
- Opção de compra direta

**Exemplo:**
```
/product nome:VIP Pass
```

#### `/inventory [usuário]`
**Descrição:** Visualiza seu inventário de produtos comprados
**Uso:** `/inventory` ou `/inventory usuário:@usuario`
**Funcionalidades:**
- Lista todos os produtos comprados
- Navegação por páginas
- Informações de cada item
- Data de compra

**Exemplo:**
```
/inventory usuário:@João
```

#### `/mytransactions [limite]`
**Descrição:** Visualiza histórico de suas transações
**Uso:** `/mytransactions` ou `/mytransactions limite:10`
**Funcionalidades:**
- Histórico completo de compras
- Detalhes de cada transação
- Status da compra
- Data e hora

**Exemplo:**
```
/mytransactions limite:5
```

### ⚙️ Comandos Administrativos

#### `/shopadd`
**Descrição:** Adiciona um novo produto à loja
**Uso:** `/shopadd nome:"VIP Pass" preco:1000 estoque:50 descricao:"Acesso VIP ao servidor" categoria:"Premium"`
**Parâmetros:**
- `nome` - Nome do produto (obrigatório)
- `preco` - Preço em moedas (obrigatório)
- `estoque` - Quantidade disponível (obrigatório)
- `descricao` - Descrição do produto (obrigatório)
- `categoria` - Categoria do produto (opcional)
- `imagem` - URL da imagem (opcional)
- `anexo` - Imagem como anexo (opcional)

**Exemplo:**
```
/shopadd nome:"VIP Pass" preco:1000 estoque:50 descricao:"Acesso VIP ao servidor" categoria:"Premium"
```

#### `/shopedit`
**Descrição:** Edita um produto existente
**Uso:** `/shopedit product_id:"abc123" campo:preco novo_valor:1500`
**Campos editáveis:**
- `name` - Nome do produto
- `price` - Preço
- `stock` - Estoque
- `description` - Descrição
- `category` - Categoria
- `image_url` - URL da imagem

**Exemplo:**
```
/shopedit product_id:"abc123" campo:preco novo_valor:1500
```

#### `/shopremove`
**Descrição:** Remove um produto da loja
**Uso:** `/shopremove product_id:"abc123"`
**Funcionalidades:**
- Remove produto permanentemente
- Registra ação nos logs
- Confirmação de remoção

**Exemplo:**
```
/shopremove product_id:"abc123"
```

#### `/shopstock`
**Descrição:** Gerencia o estoque de produtos
**Uso:** `/shopstock product_id:"abc123" quantidade:+10`
**Funcionalidades:**
- Adiciona ou remove estoque
- Suporte a valores positivos e negativos
- Logs de alterações
- Validação de estoque

**Exemplo:**
```
/shopstock product_id:"abc123" quantidade:+10
```

#### `/shopproducts [categoria]`
**Descrição:** Lista todos os produtos da loja
**Uso:** `/shopproducts` ou `/shopproducts categoria:"Games"`
**Funcionalidades:**
- Lista completa de produtos
- Filtro por categoria
- Informações detalhadas
- Status de estoque

**Exemplo:**
```
/shopproducts categoria:"Premium"
```

#### `/shoptransactions [limite]`
**Descrição:** Visualiza todas as transações da loja
**Uso:** `/shoptransactions` ou `/shoptransactions limite:20`
**Funcionalidades:**
- Histórico completo de vendas
- Informações do comprador
- Detalhes da transação
- Status da compra

**Exemplo:**
```
/shoptransactions limite:10
```

## 🎨 Interface da Loja

### 🖼️ Visualização de Produtos

#### Embed do Produto
```
🛍️ VIP Pass
💰 Preço: 1,000 moedas
📦 Estoque: 50 unidades
📂 Categoria: Premium
📝 Descrição: Acesso VIP ao servidor com benefícios exclusivos
🆔 ID: abc123def456
```

#### Botões Interativos
- **🛒 Comprar** - Inicia processo de compra
- **⬅️ Anterior** - Produto anterior
- **➡️ Próximo** - Próximo produto
- **📋 Voltar** - Volta para a loja

### 🛒 Processo de Compra

#### 1. Seleção do Produto
- Usuário navega pela loja
- Clica em "Comprar" no produto desejado
- Sistema valida disponibilidade

#### 2. Validação
- Verifica se o produto está disponível
- Confirma se o usuário tem moedas suficientes
- Valida estoque atual

#### 3. Confirmação
- Exibe resumo da compra
- Solicita confirmação do usuário
- Processa o pagamento

#### 4. Finalização
- Debita moedas da conta
- Adiciona produto ao inventário
- Atualiza estoque
- Registra transação
- Envia confirmação

## 📊 Sistema de Transações

### 💳 Tipos de Transação

#### Compra Normal
- **Status:** `completed`
- **Processo:** Instantâneo
- **Validação:** Automática

#### Transação Pendente
- **Status:** `pending`
- **Processo:** Aguardando confirmação
- **Validação:** Manual

#### Transação Cancelada
- **Status:** `cancelled`
- **Processo:** Cancelada pelo usuário
- **Validação:** Automática

#### Transação Reembolsada
- **Status:** `refunded`
- **Processo:** Reembolso processado
- **Validação:** Manual

### 📈 Relatórios de Vendas

#### Estatísticas Disponíveis
- **Total de Vendas** por período
- **Produtos Mais Vendidos**
- **Receita Total** em moedas
- **Usuários Mais Ativos**
- **Categorias Populares**

#### Logs de Transação
```
🛒 Nova Compra
👤 Comprador: João#1234
🛍️ Produto: VIP Pass
💰 Valor: 1,000 moedas
📦 Quantidade: 1
🕒 Data: 27/10/2025 14:30
🆔 ID: txn_abc123
```

## 🏷️ Sistema de Categorias

### 📂 Categorias Padrão
- **🎮 Games** - Itens relacionados a jogos
- **🎨 Cosmetics** - Itens cosméticos
- **💎 Premium** - Produtos premium
- **🎁 Special** - Itens especiais
- **🔧 Utility** - Utilitários
- **📚 Education** - Conteúdo educacional

### ➕ Criando Categorias
As categorias são criadas automaticamente quando você adiciona produtos com categorias novas:

```bash
/shopadd nome:"Item Especial" categoria:"Nova Categoria" preco:500 estoque:10 descricao:"Item da nova categoria"
```

## 🔍 Sistema de Busca

### 🔎 Busca por Nome
- Busca produtos pelo nome
- Suporte a busca parcial
- Case-insensitive
- Resultados relevantes

### 🏷️ Filtro por Categoria
- Filtra produtos por categoria
- Navegação rápida
- Interface intuitiva
- Contadores de produtos

## 📱 Experiência Mobile

### 📱 Otimização Mobile
- **Embeds Responsivos** - Adaptados para mobile
- **Botões Grandes** - Fáceis de tocar
- **Navegação Simples** - Interface limpa
- **Carregamento Rápido** - Otimizado para mobile

### 🎮 Interações Touch
- **Toque nos Botões** - Navegação intuitiva
- **Scroll Suave** - Navegação por páginas
- **Feedback Visual** - Confirmações claras

## 🔒 Segurança e Validação

### 🛡️ Validações de Segurança
- **Verificação de Saldo** - Antes de cada compra
- **Validação de Estoque** - Controle de disponibilidade
- **Rate Limiting** - Prevenção de spam
- **Logs de Auditoria** - Rastreamento completo

### 🔐 Permissões
- **Compras** - Todos os usuários
- **Administração** - Apenas administradores
- **Logs** - Apenas administradores
- **Configuração** - Apenas administradores

## 📊 Analytics e Métricas

### 📈 Métricas Disponíveis
- **Produtos Mais Vendidos**
- **Receita Total**
- **Usuários Mais Ativos**
- **Categorias Populares**
- **Tendências de Vendas**

### 📊 Relatórios
- **Relatórios Diários** - Vendas do dia
- **Relatórios Semanais** - Vendas da semana
- **Relatórios Mensais** - Vendas do mês
- **Relatórios Personalizados** - Período customizado

## 🚀 Próximos Passos

Após configurar a loja:

1. **[Sistema de Economia](04-sistema-economia.md)** - Entender moedas e níveis
2. **[Comandos Admin](05-comandos-admin.md)** - Administração completa
3. **[Sistema de Logs](07-sistema-logs.md)** - Monitoramento

---

**Sua loja virtual está pronta para vender!** 🛒✨
