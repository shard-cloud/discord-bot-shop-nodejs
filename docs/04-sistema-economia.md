# Sistema de Economia Virtual

## 💰 Visão Geral

O sistema de economia virtual é o motor que impulsiona o engajamento no servidor. Ele oferece um sistema completo de moedas virtuais, níveis de experiência, recompensas diárias e rankings competitivos que mantêm os usuários ativos e engajados.

## 🎯 Funcionalidades Principais

### 💎 Sistema de Moedas
- **Moedas Virtuais** como moeda principal
- **Ganho Automático** por atividade
- **Transferências** entre usuários
- **Recompensas Diárias** com streak system
- **Sistema de Níveis** baseado em XP
- **Rankings Competitivos**

### 🏆 Sistema de Gamificação
- **Níveis de Experiência** (XP)
- **Sistema de Streak** para daily
- **Conquistas Especiais**
- **Rankings Múltiplos**
- **Progressão Visual**

## 🎮 Comandos de Economia

### 👥 Comandos para Usuários

#### `/balance [usuário]`
**Descrição:** Visualiza o saldo de moedas e informações do perfil
**Uso:** `/balance` ou `/balance usuário:@João`
**Informações Exibidas:**
- 💰 Saldo atual de moedas
- ⭐ Nível atual
- 🎯 XP atual e necessário para próximo nível
- 📈 Barra de progresso
- 🎮 Estatísticas gerais (mensagens, voz, comandos)

**Exemplo de Resposta:**
```
💰 Carteira de João
💎 Saldo: 1,250 moedas
📊 Nível: 5 ⭐
🎯 XP: 1,200 / 2,500
📈 Progresso: ████████░░ 80%
🎮 Estatísticas:
💬 Mensagens: 150
🎤 Tempo de Voz: 45min
⚡ Comandos: 25
```

#### `/daily`
**Descrição:** Coleta recompensa diária de moedas
**Uso:** `/daily`
**Funcionalidades:**
- **Recompensa Base:** 100 moedas
- **Multiplicador por Nível:** +10 moedas por nível
- **Multiplicador por Streak:** +5 moedas por dia de streak
- **Cooldown:** 24 horas
- **Sistema de Streak:** Consecutivo aumenta recompensa

**Cálculo da Recompensa:**
```
Recompensa = (100 + (nível × 10)) × (1 + (streak × 0.05))
```

**Exemplo:**
- Nível 5, Streak 3 dias
- Recompensa = (100 + (5 × 10)) × (1 + (3 × 0.05))
- Recompensa = 150 × 1.15 = 172 moedas

#### `/leaderboard [tipo] [página]`
**Descrição:** Visualiza rankings do servidor
**Uso:** `/leaderboard` ou `/leaderboard tipo:coins página:2`
**Tipos de Ranking:**
- `coins` - Ranking por moedas (padrão)
- `level` - Ranking por nível
- `messages` - Ranking por mensagens

**Exemplo de Resposta:**
```
🏆 Ranking de Moedas - Página 1
🥇 1º - João#1234 - 15,250 moedas
🥈 2º - Maria#5678 - 12,100 moedas
🥉 3º - Pedro#9012 - 8,750 moedas
🔸 4º - Ana#3456 - 7,200 moedas
🔸 5º - Carlos#7890 - 5,800 moedas
```

### ⚙️ Comandos Administrativos

#### `/give <usuário> <quantidade> [motivo]`
**Descrição:** Dá moedas para um usuário
**Uso:** `/give usuário:@João quantidade:500 motivo:"Recompensa por evento"`
**Funcionalidades:**
- Adiciona moedas diretamente à conta
- Registra ação nos logs
- Suporte a motivos personalizados
- Validação de valores

**Exemplo:**
```
/give usuário:@João quantidade:1000 motivo:"Recompensa por evento especial"
```

#### `/addcoins <usuário> <quantidade>`
**Descrição:** Adiciona moedas diretamente (comando admin)
**Uso:** `/addcoins usuário:@João quantidade:500`
**Funcionalidades:**
- Adiciona moedas sem motivo
- Logs administrativos
- Validação de valores
- Confirmação de operação

#### `/setcoins <usuário> <quantidade>`
**Descrição:** Define o saldo de moedas de um usuário
**Uso:** `/setcoins usuário:@João quantidade:1000`
**Funcionalidades:**
- Define saldo exato
- Útil para correções
- Logs administrativos
- Confirmação de operação

#### `/resetcoins [usuário]`
**Descrição:** Reseta as moedas de um usuário para 0
**Uso:** `/resetcoins` ou `/resetcoins usuário:@João`
**Funcionalidades:**
- Reseta saldo para 0
- Logs administrativos
- Confirmação de operação
- Se não especificar usuário, reseta o próprio

#### `/resetallcoins confirm:confirm`
**Descrição:** Reseta moedas de TODOS os usuários
**Uso:** `/resetallcoins confirm:confirm`
**⚠️ ATENÇÃO:** Comando perigoso que afeta todos os usuários
**Funcionalidades:**
- Reseta saldo de todos os usuários
- Requer confirmação explícita
- Logs administrativos detalhados
- Operação irreversível

#### `/resetdaily [usuário]`
**Descrição:** Reseta o daily de um usuário
**Uso:** `/resetdaily` ou `/resetdaily usuário:@João`
**Funcionalidades:**
- Reseta streak e último daily
- Permite usar `/daily` novamente
- Logs administrativos
- Útil para correções

## 📊 Sistema de Níveis e XP

### ⭐ Como Funciona o Sistema de Níveis

#### Ganho de XP
Os usuários ganham XP através de:
- **💬 Mensagens:** 1-20 XP por mensagem
- **🎤 Tempo de Voz:** 1-10 XP por minuto
- **⚡ Comandos:** 1-5 XP por comando usado

#### Cálculo de Níveis
```
XP necessário para próximo nível = nível² × 100
```

**Exemplos:**
- Nível 1 → 2: 100 XP
- Nível 2 → 3: 400 XP
- Nível 3 → 4: 900 XP
- Nível 5 → 6: 2,500 XP
- Nível 10 → 11: 10,000 XP

#### Benefícios dos Níveis
- **💰 Daily Maior:** +10 moedas por nível
- **🏆 Status:** Maior nível = maior prestígio
- **📊 Ranking:** Posição no leaderboard
- **🎯 Progressão:** Sensação de evolução

### 🎯 Barra de Progresso
```
📈 Progresso: ████████░░ 80%
```
- **█** = XP ganho
- **░** = XP restante
- **Porcentagem** = Progresso atual

## 🏆 Sistema de Conquistas

### 🎖️ Tipos de Conquistas

#### 💰 Conquistas de Riqueza
- **💸 Pobre** - 0+ moedas
- **💵 Estável** - 1,000+ moedas
- **💰 Bem de Vida** - 10,000+ moedas
- **💎 Rico** - 100,000+ moedas
- **🏆 Milionário** - 1,000,000+ moedas

#### 🔥 Conquistas de Streak
- **🌱 Iniciante** - 1+ dias
- **🎯 Consistente** - 3+ dias
- **⭐ Dedicado** - 7+ dias
- **🔥 Veterano** - 30+ dias
- **💎 Mestre** - 100+ dias
- **🏆 Lenda** - 365+ dias

#### 🛍️ Conquistas de Compra
- **🛍️ Cliente** - 5+ compras
- **🛒 Cliente Fiel** - 20+ compras
- **🛍️ Comprador VIP** - 50+ compras

#### 📦 Conquistas de Inventário
- **🥉 Iniciante** - 10+ itens
- **🥈 Colecionador** - 100+ itens
- **🥇 Grande Colecionador** - 500+ itens
- **🏆 Colecionador Mestre** - 1,000+ itens

## 📈 Sistema de Rankings

### 🏆 Tipos de Ranking

#### 💰 Ranking de Moedas
- **Baseado em:** Saldo total de moedas
- **Atualização:** Em tempo real
- **Medalhas:** 🥇🥈🥉 para top 3

#### ⭐ Ranking de Níveis
- **Baseado em:** Nível atual
- **Atualização:** Em tempo real
- **Medalhas:** 🥇🥈🥉 para top 3

#### 💬 Ranking de Mensagens
- **Baseado em:** Total de mensagens enviadas
- **Atualização:** Em tempo real
- **Medalhas:** 🥇🥈🥉 para top 3

### 🎖️ Sistema de Medalhas
- **🥇 1º Lugar** - Ouro
- **🥈 2º Lugar** - Prata
- **🥉 3º Lugar** - Bronze
- **🔸 Demais** - Círculo padrão

## 🎮 Sistema de Daily

### 🌅 Como Funciona o Daily

#### Recompensa Base
- **Valor Inicial:** 100 moedas
- **Multiplicador por Nível:** +10 moedas por nível
- **Multiplicador por Streak:** +5% por dia de streak

#### Cálculo da Recompensa
```javascript
recompensa = (100 + (nível × 10)) × (1 + (streak × 0.05))
```

#### Exemplos de Recompensa
| Nível | Streak | Recompensa |
|-------|--------|------------|
| 1 | 1 dia | 110 moedas |
| 5 | 3 dias | 172 moedas |
| 10 | 7 dias | 210 moedas |
| 20 | 30 dias | 450 moedas |

### 🔥 Sistema de Streak

#### Benefícios do Streak
- **Maior Recompensa:** Multiplicador crescente
- **Status Especial:** Conquistas de streak
- **Prestígio:** Maior streak = maior respeito

#### Perda de Streak
- **Cooldown:** 24 horas para usar novamente
- **Reset:** Streak volta para 0
- **Penalidade:** Recompensa volta ao mínimo

## 💸 Sistema de Transferências

### 🔄 Como Funcionar Transferências

#### Comando `/give` (Admin)
- **Uso:** `/give usuário:@João quantidade:500 motivo:"Recompensa"`
- **Funcionamento:** Adiciona moedas diretamente
- **Logs:** Registra ação administrativa
- **Validação:** Verifica valores e usuário

#### Validações de Transferência
- **Valor Mínimo:** 1 moeda
- **Valor Máximo:** 1,000,000 moedas
- **Usuário Válido:** Deve existir no servidor
- **Permissões:** Apenas administradores

## 📊 Estatísticas e Métricas

### 📈 Métricas Disponíveis

#### Por Usuário
- **💰 Saldo Total** de moedas
- **⭐ Nível Atual** e XP
- **🔥 Streak Atual** de daily
- **💬 Total de Mensagens**
- **🎤 Tempo de Voz**
- **⚡ Comandos Usados**

#### Por Servidor
- **👥 Total de Usuários** ativos
- **💰 Economia Total** em moedas
- **📊 Distribuição** de níveis
- **🏆 Rankings** atualizados
- **📈 Crescimento** da economia

### 📊 Relatórios
- **Relatórios Diários** - Atividade do dia
- **Relatórios Semanais** - Crescimento semanal
- **Relatórios Mensais** - Tendências mensais
- **Relatórios Personalizados** - Período customizado

## 🔒 Segurança e Validação

### 🛡️ Validações de Segurança
- **Rate Limiting** - Prevenção de spam
- **Validação de Valores** - Valores dentro dos limites
- **Verificação de Usuário** - Usuário deve existir
- **Logs de Auditoria** - Rastreamento completo
- **Permissões Granulares** - Controle de acesso

### 🔐 Sistema de Permissões
- **Comandos Públicos** - Todos os usuários
- **Comandos Admin** - Apenas administradores
- **Comandos Owner** - Apenas donos do bot
- **Validação Automática** - Verificação de permissões

## 🎨 Interface e Experiência

### 🖼️ Embeds Visuais
- **Cores Temáticas** - Diferentes cores por status
- **Emojis Descritivos** - Fácil identificação
- **Barras de Progresso** - Visualização clara
- **Informações Organizadas** - Layout limpo

### 📱 Responsividade
- **Mobile Friendly** - Otimizado para mobile
- **Botões Grandes** - Fáceis de tocar
- **Navegação Simples** - Interface intuitiva
- **Carregamento Rápido** - Performance otimizada

## 🚀 Próximos Passos

Após entender o sistema de economia:

1. **[Comandos Admin](05-comandos-admin.md)** - Administração completa
2. **[Sistema de Logs](07-sistema-logs.md)** - Monitoramento
3. **[Deploy](08-deploy.md)** - Colocar em produção

---

**Sua economia virtual está funcionando perfeitamente!** 💰✨
