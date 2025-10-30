# Discord Shop Bot - Node.js

🛒 **Bot Discord completo com sistema de loja, economia e administração**

Um bot Discord robusto desenvolvido em Node.js com discord.js v14, oferecendo um sistema completo de loja virtual, economia de moedas, sistema de níveis, administração avançada e muito mais.

## 🎯 Visão Geral

Este bot Discord é uma solução completa para servidores que desejam implementar:

- **🛒 Sistema de Loja Virtual** - Produtos, categorias, estoque e transações
- **💰 Sistema de Economia** - Moedas, níveis, XP e recompensas diárias
- **⚙️ Administração Avançada** - Comandos administrativos completos
- **📊 Sistema de Logs** - Logs detalhados de todas as atividades
- **🎮 Sistema de Gamificação** - Rankings, conquistas e progressão

## 🚀 Funcionalidades Principais

### 🛒 Sistema de Loja
- **Layout em 3 Colunas** - Produtos organizados visualmente
- **Select Menu Inteligente** - Compra por dropdown único
- **Paginação Otimizada** - Navegação com customId eficiente
- **Produtos Virtuais** com preços, descrições e imagens
- **Categorias** para organização dos produtos
- **Controle de Estoque** em tempo real
- **Sistema de Compra** com validação de saldo e confirmação
- **Histórico de Transações** completo
- **Interface Interativa** com botões e menus

### 💰 Sistema de Economia
- **Moedas Virtuais** como moeda principal
- **Sistema de Níveis** baseado em XP
- **Recompensas Diárias** com streak system
- **Conquistas Configuráveis** - 7 níveis de achievements
- **Transferências P2P** - Sistema seguro entre usuários
- **Comando Unificado `/money`** - Saldo + transferências
- **Rankings** de moedas, níveis e mensagens
- **Autocomplete Inteligente** - Busca de produtos em tempo real

### ⚙️ Administração
- **Setup Automático** do servidor
- **Gerenciamento de Produtos** completo
- **Controle de Moedas** dos usuários
- **Sistema de Logs** configurável
- **Configurações** personalizáveis

### 📊 Monitoramento
- **Logs Detalhados** de todas as ações
- **Estatísticas** em tempo real
- **Relatórios** de transações
- **Auditoria** completa do sistema

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Node.js** | 16.11.0+ | Runtime JavaScript |
| **discord.js** | 14.23.2 | API do Discord |
| **MongoDB** | 8.19.2 | Banco de dados |
| **Mongoose** | 8.19.2 | ODM para MongoDB |
| **Winston** | - | Sistema de logs |
| **Axios** | 1.3.4 | Cliente HTTP |

## 📋 Pré-requisitos

- **Node.js** 16.11.0 ou superior
- **MongoDB** 4.4 ou superior
- **Bot Discord** criado no Discord Developer Portal
- **Permissões** adequadas no servidor Discord

## 🎮 Comandos Principais

### 🇧🇷 Para Usuários (Português)
```bash
/loja                    # Abrir loja com layout em 3 colunas
/comprar produto:Item    # Comprar com autocomplete inteligente
/money                   # Ver seu saldo
/money balance @usuario  # Ver saldo de outro usuário  
/money pay @usuario 1000 # Transferir moedas com confirmação
/daily                   # Coletar recompensa diária + conquistas
/inventario             # Ver itens comprados (paginado)
/compras                # Histórico de compras (paginado)
/produto Item           # Buscar produto específico
/rank                   # Ver ranking do servidor
/help                   # Menu de ajuda interativo
/ping                   # Verificar latência do bot
```

### 🇺🇸 Para Admins (Inglês)
```bash
/shopadd                # Adicionar produto
/shopedit               # Editar produto
/shopremove             # Remover produto
/setcoins               # Definir moedas
/give                   # Dar moedas
/setup                  # Configurar bot
```

## 🚀 Instalação Rápida

### 1. Clone o Repositório
```bash
git clone <repository-url>
cd discord-bot-shop-nodejs
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure as Variáveis de Ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
BOT_TOKEN=seu_token_do_bot
CLIENT_ID=seu_client_id
DATABASE=mongodb://localhost:27017/discord-shop-bot
```

### 4. Inicie o Bot
```bash
npm run dev
```

## ☁️ Deploy na ShardCloud (Recomendado)

Para deploy rápido e gerenciamento simplificado, recomendamos usar a **ShardCloud**:

### 🚀 Deploy em 3 Passos
1. **Crie o arquivo `.shardcloud`** (já incluído no projeto)
2. **Configure as variáveis** no painel da ShardCloud
3. **Faça upload e deploy** - Pronto!

### 📋 Configuração na ShardCloud
```env
# Variáveis obrigatórias
BOT_TOKEN=seu_token_do_bot
CLIENT_ID=seu_client_id
DATABASE=mongodb+srv://usuario:senha@cluster.mongodb.net/discord-shop-bot

# Variáveis opcionais
MAIN_SERVER=id_do_servidor_principal
SUPPORT_SERVER=id_do_servidor_de_suporte
```

### 🎯 Vantagens da ShardCloud
- ✅ **Deploy Automático** - Upload e configuração em minutos
- ✅ **Gerenciamento Simplificado** - Interface web intuitiva
- ✅ **Monitoramento Integrado** - Logs e métricas em tempo real
- ✅ **Backup Automático** - Proteção de dados garantida
- ✅ **SSL/TLS Incluído** - Segurança automática
- ✅ **Suporte Especializado** - Suporte técnico para bots Discord

📖 **[Guia Completo de Deploy](docs/08-deploy.md)** - Instruções detalhadas para ShardCloud e servidor próprio

## 📚 Documentação Completa

- [📖 Introdução](docs/01-introducao.md) - Visão geral e conceitos
- [⚙️ Configuração](docs/02-configuracao.md) - Setup detalhado
- [🛒 Sistema de Loja](docs/03-sistema-loja.md) - Funcionalidades da loja
- [💰 Sistema de Economia](docs/04-sistema-economia.md) - Moedas e níveis
- [⚙️ Comandos Administrativos](docs/05-comandos-admin.md) - Comandos de admin
- [🎮 Comandos de Utilidade](docs/06-comandos-utility.md) - Comandos gerais
- [📊 Sistema de Logs](docs/07-sistema-logs.md) - Logs e monitoramento
- [🚀 Deploy](docs/08-deploy.md) - Deploy em produção

## 🎮 Comandos Disponíveis

### 🛒 Comandos da Loja
- `/shop` - Abrir a loja do servidor
- `/product <nome>` - Ver detalhes de um produto
- `/inventory` - Ver seu inventário
- `/mytransactions` - Ver suas transações

### 💰 Comandos de Economia
- `/balance [usuário]` - Ver saldo de moedas
- `/daily` - Coletar recompensa diária
- `/leaderboard [tipo]` - Ver rankings
- `/give <usuário> <quantidade> [motivo]` - Dar moedas (admin)

### ⚙️ Comandos Administrativos
- `/setup` - Configurar o bot no servidor
- `/shopadd` - Adicionar produto à loja
- `/shopedit` - Editar produto existente
- `/shopremove` - Remover produto da loja
- `/shopstock` - Gerenciar estoque
- `/setlogchannel` - Configurar canais de log

### 🛠️ Comandos de Utilidade
- `/help` - Menu de ajuda
- `/ping` - Ver latência do bot

## 🔧 Configuração Avançada

### Variáveis de Ambiente
```env
# Bot Discord
BOT_TOKEN=seu_token_do_bot
CLIENT_ID=seu_client_id

# Banco de Dados
DATABASE=mongodb://localhost:27017/discord-shop-bot

# Configurações Opcionais
MAIN_SERVER=id_do_servidor_principal
SUPPORT_SERVER=id_do_servidor_de_suporte
```

### Permissões Necessárias
O bot precisa das seguintes permissões:
- **Send Messages** - Enviar mensagens
- **Embed Links** - Enviar embeds
- **Manage Channels** - Gerenciar canais (para setup)
- **Manage Messages** - Gerenciar mensagens
- **Read Message History** - Ler histórico
- **Use Slash Commands** - Usar comandos slash

## 📊 Estrutura do Projeto

```
discord-bot-shop-nodejs/
├── src/
│   ├── commands/           # Comandos do bot
│   │   ├── admin/         # Comandos administrativos
│   │   ├── utility/       # Comandos de utilidade
│   │   ├── information/   # Comandos de informação
│   │   └── owner/         # Comandos do dono
│   ├── database/          # Schemas do banco
│   ├── events/            # Eventos do Discord
│   ├── handlers/          # Handlers personalizados
│   ├── helpers/           # Utilitários e helpers
│   └── structures/        # Estruturas base
├── docs/                  # Documentação completa
├── logs/                  # Arquivos de log
└── config.js             # Configurações do bot
```

## 🎯 Casos de Uso

### Servidores de Gaming
- **Loja de itens** virtuais para jogadores
- **Sistema de recompensas** por atividade
- **Rankings** competitivos

### Servidores de Comunidade
- **Economia virtual** para engajamento
- **Sistema de conquistas** para membros ativos
- **Recompensas** por participação

### Servidores de Roleplay
- **Loja de itens** para personagens
- **Sistema de moedas** do mundo
- **Economia** imersiva

## 🔒 Segurança

- **Validação** de todas as entradas
- **Rate limiting** para comandos
- **Logs** de todas as ações administrativas
- **Permissões** granulares por comando
- **Sanitização** de dados do usuário

## 📈 Performance

- **Cache** inteligente de dados
- **Otimização** de consultas ao banco
- **Rate limiting** para evitar spam
- **Logs** estruturados para monitoramento

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença Apache 2.0 - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- **Documentação**: Consulte a pasta `docs/`
- **Issues**: Abra uma issue no GitHub
- **Discord**: Entre no servidor de suporte