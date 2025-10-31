## 📊 Visão Geral

O sistema de logs é uma funcionalidade essencial que permite monitorar todas as atividades do bot, desde transações da loja até comandos administrativos. Ele oferece transparência total, auditoria completa e ferramentas de diagnóstico para manter o servidor funcionando perfeitamente.

## 🎯 Funcionalidades Principais

### 📝 Tipos de Logs
- **🛒 Logs da Loja** - Compras, produtos, estoque
- **💰 Logs de Economia** - Moedas, daily, transferências
- **⚙️ Logs Administrativos** - Comandos admin, configurações
- **🔍 Logs de Sistema** - Erros, warnings, debug

### 🎨 Características dos Logs
- **Embeds Visuais** - Informações organizadas e coloridas
- **Timestamps** - Data e hora de cada ação
- **Detalhes Completos** - Informações contextuais
- **Rastreabilidade** - IDs únicos para cada ação
- **Categorização** - Logs organizados por tipo

## ⚙️ Configuração do Sistema de Logs

### 🚀 Setup Inicial

#### Setup Automático
```bash
/setup tipo:auto
```
**Cria automaticamente:**
- 📊 Categoria "Logs do Bot"
- 🛒 Canal "🛒-logs-loja"
- 💰 Canal "💰-logs-economia"
- ⚙️ Canal "⚙️-logs-admin"

#### Setup Manual
```bash
/setlogchannel tipo:shop canal:#logs-loja
/setlogchannel tipo:economy canal:#logs-economia
/setlogchannel tipo:admin canal:#logs-admin
```

### 🔧 Comando de Configuração

#### `/setlogchannel <tipo> <canal>`
**Descrição:** Configura canais de log específicos
**Permissão:** `Administrator`
**Uso:** `/setlogchannel tipo:shop canal:#logs-loja`

#### Tipos de Logs Disponíveis
- `shop` - Logs da loja (compras, produtos, estoque)
- `economy` - Logs de economia (moedas, daily, transferências)
- `admin` - Logs administrativos (comandos admin, configurações)

#### Validações
- **Permissões do Canal** - Bot precisa de permissões para enviar mensagens
- **Canal Válido** - Canal deve existir e ser acessível
- **Configuração Salva** - Configuração é persistente

## 🛒 Logs da Loja

### 📋 Eventos Registrados

#### 🛍️ Produto Adicionado
```
🛍️ Novo Produto Adicionado
👮 Administrador: João#1234
🏷️ Nome: VIP Pass
💰 Preço: 1,000 moedas
📦 Estoque: 50 unidades
📂 Categoria: Premium
📝 Descrição: Acesso VIP ao servidor
🆔 ID: abc123def456
🕒 Data: 27/10/2025 14:30
```

#### ✏️ Produto Editado
```
✏️ Produto Editado
👮 Administrador: Maria#5678
🏷️ Nome: VIP Pass
📝 Campo Editado: Preço
⬅️ Valor Anterior: 1,000 moedas
➡️ Novo Valor: 1,500 moedas
🆔 ID: abc123def456
🕒 Data: 27/10/2025 15:45
```

#### 🗑️ Produto Removido
```
🗑️ Produto Removido
👮 Administrador: Pedro#9012
🏷️ Nome: VIP Pass
💰 Preço: 1,500 moedas
📂 Categoria: Premium
🆔 ID: abc123def456
🕒 Data: 27/10/2025 16:20
```

#### 📦 Estoque Alterado
```
📦 Estoque Adicionado
👮 Administrador: Ana#3456
🏷️ Nome: VIP Pass
⬅️ Estoque Anterior: 50 unidades
➡️ Novo Estoque: 100 unidades
📊 Alteração: +50 unidades
🆔 ID: abc123def456
🕒 Data: 27/10/2025 17:10
```

#### 🛒 Compra Realizada
```
🛒 Nova Compra
👤 Comprador: João#1234
🛍️ Produto: VIP Pass
💰 Valor: 1,500 moedas
📦 Quantidade: 1
✅ Status: Concluída
🆔 ID: txn_abc123
🕒 Data: 27/10/2025 18:30
```

## 💰 Logs de Economia

### 📋 Eventos Registrados

#### 💰 Moedas Adicionadas
```
💰 Moedas Adicionadas
👮 Administrador: Maria#5678
👤 Usuário: João#1234
💎 Quantidade: +500 moedas
📝 Motivo: Recompensa por evento
💰 Novo Saldo: 1,500 moedas
🕒 Data: 27/10/2025 14:30
```

#### 🔄 Saldo Definido
```
🔄 Saldo Definido
👮 Administrador: Pedro#9012
👤 Usuário: Ana#3456
💰 Saldo Anterior: 2,000 moedas
💰 Novo Saldo: 5,000 moedas
🎯 Status: Sucesso
🕒 Data: 27/10/2025 15:15
```

#### 🔄 Saldo Resetado
```
🔄 Saldo Resetado
👮 Administrador: Carlos#7890
👤 Usuário: João#1234
💰 Saldo Anterior: 1,500 moedas
💰 Novo Saldo: 0 moedas
🎯 Status: Sucesso
🕒 Data: 27/10/2025 16:00
```

#### 🌅 Daily Coletado
```
🌅 Daily Coletado
👤 Usuário: Maria#5678
💰 Recompensa: 150 moedas
🔥 Streak: 5 dias consecutivos
⭐ Nível: 3
🕒 Data: 27/10/2025 09:00
```

#### 🔄 Daily Resetado
```
🔄 Daily Resetado
👮 Administrador: Ana#3456
👤 Usuário: João#1234
🔄 Status: Daily resetado - pode usar /daily novamente
🕒 Data: 27/10/2025 17:30
```

## ⚙️ Logs Administrativos

### 📋 Eventos Registrados

#### ⚙️ Setup Executado
```
⚙️ Setup do Servidor Concluído
👮 Administrador: João#1234
📊 Canais Criados:
🛒 Logs da Loja: #🛒-logs-loja
💰 Logs de Economia: #💰-logs-economia
⚙️ Logs de Admin: #⚙️-logs-admin
🕒 Data: 27/10/2025 10:00
```

#### 📝 Canal de Log Configurado
```
⚙️ Canal de Logs Configurado
👮 Administrador: Maria#5678
📊 Tipo de Log: Logs da Loja
📝 Canal: #🛒-logs-loja
🕒 Data: 27/10/2025 11:15
```

#### 🔧 Prefixo Alterado
```
🔧 Prefixo Alterado
👮 Administrador: Pedro#9012
⬅️ Prefixo Anterior: !
➡️ Novo Prefixo: $
🕒 Data: 27/10/2025 12:30
```

## 🔍 Logs de Sistema

### 📋 Tipos de Logs de Sistema

#### ❌ Erros
- **Erros de Comando** - Comandos que falharam
- **Erros de Banco** - Problemas de conexão
- **Erros de Permissão** - Acesso negado
- **Erros de Validação** - Dados inválidos

#### ⚠️ Warnings
- **Rate Limiting** - Usuários fazendo spam
- **Permissões Insuficientes** - Bot sem permissões
- **Configurações Inválidas** - Configurações incorretas
- **Recursos Esgotados** - Limites atingidos

#### ℹ️ Informações
- **Bot Iniciado** - Bot conectado
- **Comandos Registrados** - Comandos carregados
- **Usuários Conectados** - Estatísticas de uso
- **Performance** - Métricas de performance

## 📊 Monitoramento e Analytics

### 📈 Métricas Disponíveis

#### 📊 Estatísticas de Uso
- **Comandos Mais Usados** - Ranking de comandos
- **Usuários Mais Ativos** - Usuários que mais usam o bot
- **Horários de Pico** - Quando o bot é mais usado
- **Crescimento** - Crescimento do uso ao longo do tempo

#### 💰 Estatísticas de Economia
- **Total de Moedas** - Economia total do servidor
- **Transações por Dia** - Volume de transações
- **Usuários Mais Ricos** - Ranking de moedas
- **Crescimento da Economia** - Evolução da economia

#### 🛒 Estatísticas da Loja
- **Produtos Mais Vendidos** - Ranking de vendas
- **Receita Total** - Total arrecadado
- **Categorias Populares** - Categorias mais vendidas
- **Tendências de Vendas** - Padrões de compra

### 📊 Relatórios Automáticos

#### 📅 Relatórios Diários
- **Resumo do Dia** - Atividades do dia
- **Estatísticas** - Métricas principais
- **Eventos Importantes** - Destaques do dia
- **Problemas** - Erros e warnings

#### 📅 Relatórios Semanais
- **Crescimento Semanal** - Evolução da semana
- **Tendências** - Padrões identificados
- **Comparações** - Comparação com semanas anteriores
- **Recomendações** - Sugestões de melhoria

#### 📅 Relatórios Mensais
- **Resumo Mensal** - Atividades do mês
- **Estatísticas Detalhadas** - Métricas completas
- **Análise de Tendências** - Padrões de longo prazo
- **Planejamento** - Sugestões para o próximo mês

## 🛡️ Segurança e Auditoria

### 🔒 Recursos de Segurança

#### 📝 Auditoria Completa
- **Rastreamento Total** - Todas as ações são registradas
- **IDs Únicos** - Cada ação tem um ID único
- **Timestamps** - Data e hora exatas
- **Usuários Identificados** - Quem fez cada ação

#### 🚨 Detecção de Anomalias
- **Atividade Suspeita** - Padrões anômalos
- **Tentativas de Acesso** - Acesso não autorizado
- **Comportamento Estranho** - Uso anormal do bot
- **Alertas Automáticos** - Notificações de problemas

#### 🔐 Controle de Acesso
- **Permissões Granulares** - Controle fino de acesso
- **Logs de Permissão** - Registro de tentativas de acesso
- **Validação Contínua** - Verificação constante de permissões
- **Bloqueio Automático** - Bloqueio de usuários suspeitos

### 📋 Compliance e Regulamentação

#### 📄 Registros para Compliance
- **Registro de Transações** - Todas as transações
- **Registro de Usuários** - Atividades dos usuários
- **Registro de Administração** - Ações administrativas
- **Registro de Sistema** - Eventos do sistema

#### 🔍 Rastreabilidade
- **Cadeia de Custódia** - Rastreamento completo
- **Evidências** - Prova de todas as ações
- **Integridade** - Dados não podem ser alterados
- **Disponibilidade** - Logs sempre disponíveis

## 🔧 Configuração Avançada

### ⚙️ Personalização de Logs

#### 🎨 Customização Visual
- **Cores Personalizadas** - Cores específicas por tipo
- **Emojis Customizados** - Emojis personalizados
- **Layout Personalizado** - Layout específico
- **Templates** - Templates de log

#### 📊 Filtros e Filtragem
- **Filtros por Tipo** - Mostrar apenas tipos específicos
- **Filtros por Usuário** - Logs de usuários específicos
- **Filtros por Período** - Logs de períodos específicos
- **Filtros por Severidade** - Logs por nível de importância

#### 🔔 Notificações
- **Alertas por Email** - Notificações por email
- **Alertas por Discord** - Notificações no Discord
- **Alertas por Webhook** - Notificações por webhook
- **Alertas Personalizados** - Alertas customizados

### 📈 Integração com Ferramentas Externas

#### 🔗 APIs e Webhooks
- **Webhook de Logs** - Envio de logs para sistemas externos
- **API de Logs** - Acesso programático aos logs
- **Integração com SIEM** - Integração com sistemas de segurança
- **Integração com Analytics** - Integração com ferramentas de análise

#### 📊 Dashboards
- **Dashboard Web** - Interface web para visualização
- **Grafana** - Integração com Grafana
- **Kibana** - Integração com Kibana
- **Dashboards Customizados** - Dashboards personalizados

## 🚀 Próximos Passos

Após configurar o sistema de logs:

1. **[Deploy](08-deploy.md)** - Colocar em produção
2. **[Manutenção](09-manutencao.md)** - Cuidados contínuos
3. **[Otimização](10-otimizacao.md)** - Melhorar performance

---

**Seu sistema de monitoramento está funcionando perfeitamente!** 📊🔍
