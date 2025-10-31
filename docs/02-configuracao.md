## 🚀 Configuração Inicial

### Pré-requisitos

Antes de começar, certifique-se de ter:

- **Node.js** 16.11.0 ou superior
- **MongoDB** 4.4 ou superior (local ou cloud)
- **Bot Discord** criado no Discord Developer Portal
- **Servidor Discord** com permissões administrativas

### 1. Criação do Bot Discord

#### Passo 1: Acesse o Discord Developer Portal
1. Vá para [discord.com/developers/applications](https://discord.com/developers/applications)
2. Clique em **"New Application"**
3. Digite um nome para seu bot
4. Clique em **"Create"**

#### Passo 2: Configurar o Bot
1. Vá para a aba **"Bot"**
2. Clique em **"Add Bot"**
3. Copie o **Token** (você precisará dele)
4. Em **"Privileged Gateway Intents"**, ative:
   - ✅ **Server Members Intent**
   - ✅ **Message Content Intent**
   - ✅ **Presence Intent**

#### Passo 3: Configurar Permissões
1. Vá para a aba **"OAuth2" > "URL Generator"**
2. Selecione **"bot"** em **Scopes**
3. Selecione as seguintes permissões:
   - ✅ **Send Messages**
   - ✅ **Embed Links**
   - ✅ **Manage Channels**
   - ✅ **Manage Messages**
   - ✅ **Read Message History**
   - ✅ **Use Slash Commands**
   - ✅ **Add Reactions**
   - ✅ **Attach Files**

#### Passo 4: Convidar o Bot
1. Copie a URL gerada
2. Cole no navegador
3. Selecione seu servidor
4. Clique em **"Authorize"**

### 2. Instalação do Projeto

#### Clone o Repositório
```bash
git clone <repository-url>
cd discord-bot-shop-nodejs
```

#### Instale as Dependências
```bash
npm install
```

### 3. Configuração do Banco de Dados

#### MongoDB Local
```bash
# Instalar MongoDB (Ubuntu/Debian)
sudo apt-get install mongodb

# Iniciar MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### MongoDB Cloud (MongoDB Atlas)
1. Acesse [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Crie uma conta gratuita
3. Crie um novo cluster
4. Configure acesso de rede (0.0.0.0/0)
5. Crie um usuário de banco
6. Copie a string de conexão

### 4. Configuração das Variáveis de Ambiente

#### Criar Arquivo .env
```bash
cp .env.example .env
```

#### Configurar Variáveis
```env
# Bot Discord (OBRIGATÓRIO)
BOT_TOKEN=seu_token_do_bot_aqui
CLIENT_ID=seu_client_id_aqui

# Banco de Dados (OBRIGATÓRIO)
DATABASE=mongodb://localhost:27017/discord-shop-bot
# Ou para MongoDB Atlas:
# DATABASE=mongodb+srv://usuario:senha@cluster.mongodb.net/discord-shop-bot

# Configurações Opcionais
MAIN_SERVER=id_do_servidor_principal
SUPPORT_SERVER=id_do_servidor_de_suporte
```

### 5. Configuração do Servidor Discord

#### Permissões Necessárias
O bot precisa das seguintes permissões no servidor:

**Permissões Básicas:**
- ✅ **View Channels**
- ✅ **Send Messages**
- ✅ **Embed Links**
- ✅ **Read Message History**
- ✅ **Use Slash Commands**

**Permissões Administrativas:**
- ✅ **Manage Channels** (para setup automático)
- ✅ **Manage Messages** (para logs)
- ✅ **Add Reactions** (para interações)

#### Configurar Cargos
1. Crie um cargo **"Bot Admin"** para administradores
2. Dê permissões de **"Manage Server"** para este cargo
3. Adicione usuários que podem usar comandos admin

### 6. Primeira Execução

#### Iniciar o Bot
```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm start
```

#### Verificar Conexão
1. O bot deve aparecer online no Discord
2. Teste o comando `/ping`
3. Se funcionar, a configuração está correta

### 7. Setup Inicial do Servidor

#### Comando de Setup
Use o comando `/setup` para configurar automaticamente:

```bash
/setup tipo:auto
```

Este comando irá:
- ✅ Criar categoria de logs
- ✅ Criar canais de log específicos
- ✅ Configurar sistema de logs
- ✅ Ativar funcionalidades básicas

#### Setup Manual (Alternativa)
Se o setup automático falhar:

```bash
# Configurar canal de logs da loja
/setlogchannel tipo:shop #canal-logs-loja

# Configurar canal de logs de economia
/setlogchannel tipo:economy #canal-logs-economia

# Configurar canal de logs administrativos
/setlogchannel tipo:admin #canal-logs-admin
```

## ⚙️ Configurações Avançadas

### Configuração do Sistema de Economia

#### Arquivo: `src/config/economy.js`
```javascript
module.exports = {
  COINS: {
    DAILY_BASE: 100,           // Moedas base do daily
    DAILY_LEVEL_MULTIPLIER: 10, // Multiplicador por nível
    DAILY_STREAK_MULTIPLIER: 5, // Multiplicador por streak
    MAX_GIVE_AMOUNT: 1000000,   // Máximo de moedas por give
    STARTING_AMOUNT: 1,         // Moedas iniciais
  },
  
  LEVELS: {
    XP_PER_LEVEL: (level) => level * level * 100,
    XP_GAIN: {
      MESSAGE: { min: 1, max: 20 },
      VOICE: { min: 1, max: 10 },
      COMMAND: { min: 1, max: 5 },
    },
  },
};
```

### Configuração de Logs

#### Tipos de Logs Disponíveis
- **🛒 Shop Logs** - Transações da loja
- **💰 Economy Logs** - Movimentações de moedas
- **⚙️ Admin Logs** - Comandos administrativos

#### Configurar Logs
```bash
# Ativar logs da loja
/setlogchannel tipo:shop #canal-logs-loja

# Ativar logs de economia
/setlogchannel tipo:economy #canal-logs-economia

# Ativar logs administrativos
/setlogchannel tipo:admin #canal-logs-admin
```

### Configuração de Prefixo

#### Alterar Prefixo Padrão
```bash
/setprefix novo-prefixo
```

**Exemplos:**
- `!` (padrão)
- `?`
- `$`
- `bot.`

## 🔧 Troubleshooting

### Problemas Comuns

#### Bot não aparece online
**Solução:**
1. Verifique se o token está correto
2. Confirme se o bot foi convidado para o servidor
3. Verifique se as intents estão configuradas

#### Comandos slash não aparecem
**Solução:**
1. Aguarde alguns minutos para sincronização
2. Reinicie o bot
3. Verifique se o bot tem permissão "Use Slash Commands"

#### Erro de conexão com banco
**Solução:**
1. Verifique se o MongoDB está rodando
2. Confirme a string de conexão
3. Teste a conectividade

#### Setup automático falha
**Solução:**
1. Verifique se o bot tem permissão "Manage Channels"
2. Use o setup manual
3. Confirme se o servidor tem 2FA desabilitado

### Logs de Debug

#### Verificar Logs
```bash
# Ver logs em tempo real
tail -f logs/combined.log

# Ver apenas erros
tail -f logs/error.log
```

#### Logs do Console
O bot exibe logs detalhados no console:
- ✅ Conexão estabelecida
- ✅ Comandos registrados
- ✅ Eventos processados
- ❌ Erros e warnings

## 📊 Verificação da Configuração

### Checklist de Configuração

- [ ] Bot Discord criado e configurado
- [ ] Token e Client ID configurados
- [ ] MongoDB instalado e rodando
- [ ] String de conexão configurada
- [ ] Bot convidado para o servidor
- [ ] Permissões configuradas
- [ ] Bot aparece online
- [ ] Comando `/ping` funciona
- [ ] Setup executado com sucesso
- [ ] Canais de log criados
- [ ] Sistema funcionando

### Testes Básicos

#### Teste 1: Conexão
```bash
/ping
# Deve retornar a latência do bot
```

#### Teste 2: Sistema de Economia
```bash
/balance
# Deve mostrar seu saldo (inicial: 1 moeda)
```

#### Teste 3: Sistema de Loja
```bash
/shop
# Deve abrir a loja (vazia inicialmente)
```

#### Teste 4: Comandos Admin
```bash
/setup
# Deve mostrar opções de configuração
```

## ☁️ Deploy em Produção

Após testar localmente, você pode fazer deploy em produção:

### 🚀 Opção 1: ShardCloud (Recomendado)
- **Deploy Automático** - Upload e configuração em minutos
- **Gerenciamento Simplificado** - Interface web intuitiva
- **Monitoramento Integrado** - Logs e métricas em tempo real
- **Backup Automático** - Proteção de dados garantida

📖 **[Guia de Deploy na ShardCloud](08-deploy.md#deploy-na-shardcloud-recomendado)** - Instruções detalhadas

### 🖥️ Opção 2: Servidor Próprio
- **Controle Total** - Infraestrutura própria
- **Customização** - Configurações avançadas
- **Custo Fixo** - Sem dependência de terceiros

📖 **[Guia de Deploy em Servidor Próprio](08-deploy.md#deploy-em-servidor-próprio-avançado)** - Instruções detalhadas

## 🚀 Próximos Passos

Após a configuração inicial:

1. **[Configurar a Loja](03-sistema-loja.md)** - Adicionar produtos
2. **[Entender a Economia](04-sistema-economia.md)** - Sistema de moedas
3. **[Usar Comandos Admin](05-comandos-admin.md)** - Administração
4. **[Configurar Logs](07-sistema-logs.md)** - Monitoramento
5. **[Deploy em Produção](08-deploy.md)** - Colocar online

---

**Configuração concluída! Seu bot está pronto para uso.** 🎉
