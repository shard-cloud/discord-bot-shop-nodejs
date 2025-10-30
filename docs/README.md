# 📚 Documentação do Discord Shop Bot

Bem-vindo à documentação completa do **Discord Shop Bot**! Este é um bot Discord robusto desenvolvido em Node.js que oferece um sistema completo de loja virtual, economia de moedas, sistema de níveis e administração avançada.

## 🎯 O que você encontrará aqui

Esta documentação cobre todos os aspectos do bot, desde a configuração inicial até o deploy em produção. Cada seção foi cuidadosamente elaborada para fornecer informações detalhadas e exemplos práticos.

## 📖 Índice da Documentação

### 🚀 [01. Introdução](01-introducao.md)
**Visão geral do bot e suas funcionalidades principais**
- O que é este Bot
- Principais Características
- Arquitetura do Sistema
- Como Funciona
- Casos de Uso Ideais
- Vantagens do Sistema

### ⚙️ [02. Configuração](02-configuracao.md)
**Guia completo de configuração e setup inicial**
- Pré-requisitos
- Criação do Bot Discord
- Instalação do Projeto
- Configuração do Banco de Dados
- Variáveis de Ambiente
- Configuração do Servidor
- Primeira Execução
- Setup Inicial

### 🛒 [03. Sistema de Loja](03-sistema-loja.md)
**Funcionalidades completas da loja virtual**
- Visão Geral
- Funcionalidades Principais
- Comandos da Loja
- Interface da Loja
- Sistema de Transações
- Sistema de Categorias
- Sistema de Busca
- Experiência Mobile

### 💰 [04. Sistema de Economia](04-sistema-economia.md)
**Sistema completo de moedas, níveis e gamificação**
- Visão Geral
- Funcionalidades Principais
- Comandos de Economia
- Sistema de Níveis e XP
- Sistema de Conquistas
- Sistema de Rankings
- Sistema de Daily
- Sistema de Transferências

### ⚙️ [05. Comandos Administrativos](05-comandos-admin.md)
**Comandos administrativos e de configuração**
- Visão Geral
- Sistema de Permissões
- Comandos de Configuração
- Comandos da Loja
- Comandos de Economia
- Comandos de Monitoramento
- Comandos de Owner
- Logs e Auditoria

### 🛠️ [06. Comandos de Utilidade](06-comandos-utility.md)
**Comandos gerais para usuários**
- Visão Geral
- Comandos Disponíveis
- Interface e Experiência
- Segurança e Validação
- Estatísticas e Métricas
- Dicas de Uso
- Troubleshooting

### 📊 [07. Sistema de Logs](07-sistema-logs.md)
**Sistema completo de logs e monitoramento**
- Visão Geral
- Configuração do Sistema
- Logs da Loja
- Logs de Economia
- Logs Administrativos
- Logs de Sistema
- Monitoramento e Analytics
- Segurança e Auditoria

### 🚀 [08. Deploy em Produção](08-deploy.md)
**Guia completo de deploy em produção**
- Visão Geral
- Pré-requisitos
- Configuração do Servidor
- Deploy da Aplicação
- Configuração de Segurança
- Otimizações de Performance
- Deploy Automatizado
- Monitoramento de Produção

## 🎮 Funcionalidades Principais

### 🛒 Sistema de Loja Virtual
- **Produtos Digitais** com preços, descrições e imagens
- **Categorias** para organização dos produtos
- **Controle de Estoque** em tempo real
- **Sistema de Compra** com validação automática
- **Histórico Completo** de transações
- **Interface Interativa** com botões e menus

### 💰 Sistema de Economia
- **Moedas Virtuais** como moeda principal
- **Sistema de Níveis** baseado em experiência (XP)
- **Recompensas Diárias** com sistema de streak
- **Transferências** entre usuários
- **Rankings** competitivos
- **Conquistas** e badges especiais

### ⚙️ Administração Avançada
- **Setup Automático** do servidor
- **Gerenciamento Completo** de produtos
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
| **MongoDB** | 4.4+ | Banco de dados |
| **Mongoose** | 8.19.2 | ODM para MongoDB |
| **Winston** | - | Sistema de logs |
| **PM2** | - | Process Manager |

## 🚀 Início Rápido

### 1. Pré-requisitos
- **Node.js** 16.11.0 ou superior
- **MongoDB** 4.4 ou superior
- **Bot Discord** criado no Discord Developer Portal
- **Servidor Discord** com permissões administrativas

### 2. Instalação
```bash
# Clone o repositório
git clone <repository-url>
cd discord-bot-shop-nodejs

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Inicie o bot
npm run dev
```

### 3. Configuração Inicial
```bash
# Configure o servidor automaticamente
/setup tipo:auto

# Ou configure manualmente
/setlogchannel tipo:shop canal:#logs-loja
/setlogchannel tipo:economy canal:#logs-economia
/setlogchannel tipo:admin canal:#logs-admin
```

## 📋 Comandos Principais

### 🛒 Comandos da Loja
- `/shop` - Abrir a loja do servidor
- `/product <nome>` - Ver detalhes de um produto
- `/inventory` - Ver seu inventário
- `/mytransactions` - Ver suas transações

### 💰 Comandos de Economia
- `/balance [usuário]` - Ver saldo de moedas
- `/daily` - Coletar recompensa diária
- `/leaderboard [tipo]` - Ver rankings

### ⚙️ Comandos Administrativos
- `/setup` - Configurar o bot no servidor
- `/shopadd` - Adicionar produto à loja
- `/shopedit` - Editar produto existente
- `/shopremove` - Remover produto da loja
- `/give <usuário> <quantidade>` - Dar moedas

### 🛠️ Comandos de Utilidade
- `/help` - Menu de ajuda
- `/ping` - Ver latência do bot

## 🎯 Casos de Uso

### 🎮 Servidores de Gaming
- **Loja de itens** virtuais para jogadores
- **Sistema de recompensas** por atividade
- **Rankings** competitivos entre membros
- **Conquistas** especiais

### 👥 Servidores de Comunidade
- **Economia virtual** para engajamento
- **Sistema de conquistas** para membros ativos
- **Recompensas** por participação
- **Gamificação** da experiência

### 🎭 Servidores de Roleplay
- **Loja de itens** para personagens
- **Sistema de moedas** do mundo
- **Economia** imersiva
- **Progressão** de personagens

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

## 🤝 Suporte

- **Documentação** completa na pasta `docs/`
- **Exemplos** de uso em cada seção
- **Troubleshooting** para problemas comuns
- **Suporte** ativo da comunidade

## 📄 Licença

Este projeto está licenciado sob a Licença Apache 2.0 - veja o arquivo [LICENSE](../LICENSE) para detalhes.
