## ⚙️ Visão Geral

Os comandos administrativos são ferramentas poderosas que permitem aos administradores do servidor gerenciar completamente o bot, configurar funcionalidades, administrar usuários e monitorar atividades. Estes comandos requerem permissões especiais e são essenciais para o funcionamento adequado do bot.

## 🔐 Sistema de Permissões

### 👑 Níveis de Permissão

#### 🛠️ Administradores
- **Permissão:** `ManageGuild` ou `Administrator`
- **Acesso:** Maioria dos comandos administrativos
- **Responsabilidade:** Gerenciar servidor e usuários

#### 🤴 Donos do Bot
- **Permissão:** IDs específicos no config
- **Acesso:** Comandos de owner e debug
- **Responsabilidade:** Manutenção e desenvolvimento

### 🔒 Validação de Permissões
- **Verificação Automática** - Bot valida permissões antes de executar
- **Mensagens de Erro** - Feedback claro para usuários sem permissão
- **Logs de Tentativa** - Registro de tentativas de acesso não autorizado

## 🛠️ Comandos de Configuração

### `/setup [tipo]`
**Descrição:** Configura o bot no servidor
**Permissão:** `Administrator`
**Uso:** `/setup tipo:auto` ou `/setup tipo:manual`

#### Setup Automático
```bash
/setup tipo:auto
```
**Funcionalidades:**
- ✅ Cria categoria "📊 Logs do Bot"
- ✅ Cria canal "🛒-logs-loja"
- ✅ Cria canal "💰-logs-economia"
- ✅ Cria canal "⚙️-logs-admin"
- ✅ Configura permissões automaticamente
- ✅ Ativa sistema de logs

#### Setup Manual
```bash
/setup tipo:manual
```
**Funcionalidades:**
- 📋 Mostra instruções para configuração manual
- 🔧 Comandos para configurar cada canal
- ⚙️ Configuração passo a passo

**⚠️ Nota:** Setup automático pode falhar em servidores com 2FA obrigatório.

### `/setlogchannel <tipo> <canal>`
**Descrição:** Configura canais de log específicos
**Permissão:** `Administrator`
**Uso:** `/setlogchannel tipo:shop canal:#logs-loja`

#### Tipos de Logs
- `shop` - Logs da loja (compras, produtos)
- `economy` - Logs de economia (moedas, daily)
- `admin` - Logs administrativos (comandos admin)

**Exemplos:**
```bash
/setlogchannel tipo:shop canal:#logs-loja
/setlogchannel tipo:economy canal:#logs-economia
/setlogchannel tipo:admin canal:#logs-admin
```

### `/setprefix <novo-prefixo>`
**Descrição:** Define um novo prefixo para comandos de texto
**Permissão:** `ManageGuild`
**Uso:** `/setprefix novo-prefixo:$`

**Limitações:**
- Máximo 2 caracteres
- Não pode conter espaços
- Aplicado imediatamente

**Exemplos:**
```bash
/setprefix novo-prefixo:$
/setprefix novo-prefixo:?
/setprefix novo-prefixo:bot.
```

## 🛒 Comandos da Loja

### `/shopadd`
**Descrição:** Adiciona um novo produto à loja
**Permissão:** `ManageGuild`
**Uso:** `/shopadd nome:"VIP Pass" preco:1000 estoque:50 descricao:"Acesso VIP" categoria:"Premium"`

#### Parâmetros Obrigatórios
- `nome` - Nome do produto
- `preco` - Preço em moedas
- `estoque` - Quantidade disponível
- `descricao` - Descrição do produto

#### Parâmetros Opcionais
- `categoria` - Categoria do produto
- `imagem` - URL da imagem
- `anexo` - Imagem como anexo

**Exemplo Completo:**
```bash
/shopadd nome:"VIP Pass" preco:1000 estoque:50 descricao:"Acesso VIP ao servidor com benefícios exclusivos" categoria:"Premium" imagem:"https://exemplo.com/vip.png"
```

### `/shopedit <product_id> <campo> <novo_valor>`
**Descrição:** Edita um produto existente
**Permissão:** `ManageGuild`
**Uso:** `/shopedit product_id:"abc123" campo:preco novo_valor:1500`

#### Campos Editáveis
- `name` - Nome do produto
- `price` - Preço
- `stock` - Estoque
- `description` - Descrição
- `category` - Categoria
- `image_url` - URL da imagem

**Exemplos:**
```bash
/shopedit product_id:"abc123" campo:preco novo_valor:1500
/shopedit product_id:"abc123" campo:estoque novo_valor:100
/shopedit product_id:"abc123" campo:descricao novo_valor:"Nova descrição"
```

### `/shopremove <product_id>`
**Descrição:** Remove um produto da loja
**Permissão:** `ManageGuild`
**Uso:** `/shopremove product_id:"abc123"`

**⚠️ ATENÇÃO:** Esta ação é irreversível!

### `/shopstock <product_id> <quantidade>`
**Descrição:** Gerencia o estoque de produtos
**Permissão:** `ManageGuild`
**Uso:** `/shopstock product_id:"abc123" quantidade:+10`

#### Tipos de Alteração
- `+10` - Adiciona 10 unidades
- `-5` - Remove 5 unidades
- `100` - Define estoque para 100

**Exemplos:**
```bash
/shopstock product_id:"abc123" quantidade:+50
/shopstock product_id:"abc123" quantidade:-10
/shopstock product_id:"abc123" quantidade:0
```

### `/shopproducts [categoria]`
**Descrição:** Lista todos os produtos da loja
**Permissão:** `ManageGuild`
**Uso:** `/shopproducts` ou `/shopproducts categoria:"Premium"`

**Informações Exibidas:**
- 🏷️ Nome do produto
- 💰 Preço atual
- 📦 Estoque disponível
- 📂 Categoria
- 🟢/🔴 Status (ativo/inativo)
- 🆔 ID do produto

### `/shoptransactions [limite]`
**Descrição:** Visualiza todas as transações da loja
**Permissão:** `ManageGuild`
**Uso:** `/shoptransactions` ou `/shoptransactions limite:20`

**Informações Exibidas:**
- 👤 Comprador
- 🛍️ Produto comprado
- 💰 Valor pago
- 📦 Quantidade
- 🕒 Data da compra
- ✅/❌ Status da transação

## 💰 Comandos de Economia

### `/give <usuário> <quantidade> [motivo]`
**Descrição:** Dá moedas para um usuário
**Permissão:** `ManageGuild`
**Uso:** `/give usuário:@João quantidade:500 motivo:"Recompensa por evento"`

**Funcionalidades:**
- Adiciona moedas diretamente à conta
- Registra ação nos logs
- Suporte a motivos personalizados
- Validação de valores

### `/addcoins <usuário> <quantidade>`
**Descrição:** Adiciona moedas diretamente (comando admin)
**Permissão:** `ManageGuild`
**Uso:** `/addcoins usuário:@João quantidade:500`

**Diferença do `/give`:**
- Não requer motivo
- Logs administrativos
- Validação de valores
- Confirmação de operação

### `/setcoins <usuário> <quantidade>`
**Descrição:** Define o saldo de moedas de um usuário
**Permissão:** `ManageGuild`
**Uso:** `/setcoins usuário:@João quantidade:1000`

**Uso Comum:**
- Correções de saldo
- Ajustes administrativos
- Configuração inicial

### `/resetcoins [usuário]`
**Descrição:** Reseta as moedas de um usuário para 0
**Permissão:** `ManageGuild`
**Uso:** `/resetcoins` ou `/resetcoins usuário:@João`

**Funcionalidades:**
- Reseta saldo para 0
- Logs administrativos
- Confirmação de operação
- Se não especificar usuário, reseta o próprio

### `/resetallcoins confirm:confirm`
**Descrição:** Reseta moedas de TODOS os usuários
**Permissão:** `ManageGuild`
**Uso:** `/resetallcoins confirm:confirm`

**⚠️ ATENÇÃO:** 
- Comando perigoso que afeta todos os usuários
- Requer confirmação explícita
- Operação irreversível
- Logs administrativos detalhados

### `/resetdaily [usuário]`
**Descrição:** Reseta o daily de um usuário
**Permissão:** `ManageGuild`
**Uso:** `/resetdaily` ou `/resetdaily usuário:@João`

**Funcionalidades:**
- Reseta streak e último daily
- Permite usar `/daily` novamente
- Logs administrativos
- Útil para correções

### `/testcoins <usuário> <quantidade>`
**Descrição:** Testa adição de moedas (comando de debug)
**Permissão:** `ManageGuild`
**Uso:** `/testcoins usuário:@João quantidade:100`

**Funcionalidades:**
- Testa sistema de moedas
- Mostra antes e depois
- Validação de operação
- Logs de teste

## 📊 Comandos de Monitoramento

### `/modlog [canal|off]`
**Descrição:** Habilita ou desabilita logs de moderação
**Permissão:** `ManageGuild`
**Uso:** `/modlog canal:#logs-mod` ou `/modlog off`

**Funcionalidades:**
- Configura canal de logs
- Ativa/desativa logs
- Validação de permissões do canal
- Confirmação de configuração

## 🤴 Comandos de Owner

### `/eval <código>`
**Descrição:** Executa código JavaScript (comando de debug)
**Permissão:** Owner apenas
**Uso:** `/eval console.log("Hello World")`

**⚠️ ATENÇÃO:** 
- Comando perigoso para desenvolvimento
- Executa código arbitrário
- Acesso total ao bot
- Usar apenas para debug

### `/listservers [filtro]`
**Descrição:** Lista servidores onde o bot está presente
**Permissão:** Owner apenas
**Uso:** `/listservers` ou `/listservers "Meu Servidor"`

**Funcionalidades:**
- Lista todos os servidores
- Filtro por nome
- Navegação por páginas
- Informações básicas

## 📋 Logs e Auditoria

### 📊 Tipos de Logs Administrativos

#### 🛒 Logs da Loja
- **Produtos Adicionados** - Novo produto criado
- **Produtos Editados** - Alterações em produtos
- **Produtos Removidos** - Produto deletado
- **Estoque Alterado** - Mudanças no estoque
- **Transações** - Compras realizadas

#### 💰 Logs de Economia
- **Moedas Adicionadas** - Give/addcoins
- **Moedas Definidas** - Setcoins
- **Moedas Resetadas** - Resetcoins
- **Daily Resetado** - Resetdaily
- **Transferências** - Movimentações

#### ⚙️ Logs Administrativos
- **Setup Executado** - Configuração inicial
- **Canais Configurados** - Setlogchannel
- **Prefixo Alterado** - Setprefix
- **Comandos Executados** - Todos os comandos admin

### 🔍 Estrutura dos Logs

#### Exemplo de Log de Produto
```
🛍️ Novo Produto Adicionado
👮 Administrador: João#1234
🏷️ Nome: VIP Pass
💰 Preço: 1,000 moedas
📦 Estoque: 50 unidades
📂 Categoria: Premium
🆔 ID: abc123def456
🕒 Data: 27/10/2025 14:30
```

#### Exemplo de Log de Economia
```
💰 Moedas Adicionadas
👮 Administrador: Maria#5678
👤 Usuário: João#1234
💎 Quantidade: +500 moedas
📝 Motivo: Recompensa por evento
💰 Novo Saldo: 1,500 moedas
🕒 Data: 27/10/2025 14:30
```

## 🛡️ Segurança e Validação

### 🔒 Validações de Segurança
- **Verificação de Permissões** - Antes de cada comando
- **Validação de Entrada** - Todos os parâmetros
- **Rate Limiting** - Prevenção de spam
- **Logs de Auditoria** - Rastreamento completo
- **Confirmações** - Para ações perigosas

### 🚨 Comandos Perigosos
- `/resetallcoins` - Afeta todos os usuários
- `/shopremove` - Remove produto permanentemente
- `/eval` - Executa código arbitrário
- `/resetcoins` - Reseta saldo do usuário

### ✅ Boas Práticas
- **Sempre confirmar** ações perigosas
- **Usar motivos** em comandos de economia
- **Monitorar logs** regularmente
- **Backup** de configurações importantes
- **Testar** em servidor de desenvolvimento

## 🚀 Próximos Passos

Após dominar os comandos administrativos:

1. **[Sistema de Logs](07-sistema-logs.md)** - Monitoramento completo
2. **[Deploy](08-deploy.md)** - Colocar em produção
3. **[Manutenção](09-manutencao.md)** - Cuidados contínuos

---

**Você agora tem controle total sobre seu bot!** ⚙️👑
