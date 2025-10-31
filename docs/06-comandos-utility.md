## 🛠️ Visão Geral

Os comandos de utilidade são ferramentas essenciais que todos os usuários podem usar para interagir com o bot, obter informações, navegar pela loja e gerenciar suas contas. Estes comandos formam a base da experiência do usuário e são fundamentais para o funcionamento do sistema.

## 🎮 Comandos Disponíveis

### 📖 `/ajuda [comando]`
**Descrição:** Menu de ajuda interativo com todos os comandos
**Uso:** `/ajuda` ou `/ajuda comando:loja`
**Permissão:** Todos os usuários

#### Funcionalidades
- **Menu Interativo** - Seleção por categoria
- **Navegação por Páginas** - Botões anterior/próximo
- **Busca por Comando** - Informações específicas
- **Categorias Organizadas** - Comandos agrupados por função

#### Categorias Disponíveis
- **🛒 Loja** - Comandos da loja virtual
- **💰 Economia** - Comandos de moedas e níveis
- **⚙️ Admin** - Comandos administrativos
- **🛠️ Utilidade** - Comandos gerais
- **🪧 Informações** - Comandos informativos

#### Exemplo de Uso
```bash
/ajuda                   # Menu principal
/ajuda comando:loja      # Ajuda específica do comando loja
/ajuda comando:saldo     # Ajuda específica do comando saldo
```

### 🏓 `/ping`
**Descrição:** Mostra a latência atual do bot para os servidores Discord
**Uso:** `/ping`
**Permissão:** Todos os usuários

#### Funcionalidades
- **Latência em Tempo Real** - Ping atual do bot
- **Resposta Rápida** - Comando leve e eficiente
- **Diagnóstico** - Útil para verificar conectividade

#### Exemplo de Resposta
```
🏓 Pong : 45ms
```



### 🌅 `/daily`
**Descrição:** Coleta recompensa diária de moedas
**Uso:** `/daily`
**Permissão:** Todos os usuários
**Cooldown:** 24 horas

#### Sistema de Conquistas
- **🎯 Consistente** - 3 dias seguidos
- **⭐ Semanal** - 7 dias seguidos
- **💪 Determinado** - 14 dias seguidos
- **🔥 Mensal** - 30 dias seguidos
- **🎖️ Veterano** - 50 dias seguidos
- **💎 Centenário** - 100 dias seguidos
- **🏆 Aniversário de 1 Ano** - 365 dias seguidos

#### Sistema de Recompensas
- **Recompensa Base:** 100 moedas
- **Multiplicador por Nível:** +10 moedas por nível
- **Multiplicador por Streak:** +5% por dia de streak
- **Sistema de Streak:** Consecutivo aumenta recompensa

#### Cálculo da Recompensa
```
Recompensa = (100 + (nível × 10)) × (1 + (streak × 0.05))
```

#### Exemplos de Recompensa
| Nível | Streak | Recompensa |
|-------|--------|------------|
| 1 | 1 dia | 110 moedas |
| 5 | 3 dias | 172 moedas |
| 10 | 7 dias | 210 moedas |
| 20 | 30 dias | 450 moedas |

#### Exemplo de Resposta
```
🌅 Recompensa Diária Coletada!
💰 Recompensa: 172 moedas
🔥 Streak: 3 dias consecutivos
⭐ Próximo nível: 1,300 XP restantes
⏰ Próximo daily: em 23h 45min
```

### 🏆 `/rank [tipo] [página]`
**Descrição:** Visualiza rankings do servidor
**Uso:** `/rank` ou `/rank tipo:coins página:2`
**Permissão:** Todos os usuários

#### Tipos de Ranking
- `coins` - Ranking por moedas (padrão)
- `level` - Ranking por nível
- `messages` - Ranking por mensagens

#### Sistema de Medalhas
- **🥇 1º Lugar** - Ouro
- **🥈 2º Lugar** - Prata
- **🥉 3º Lugar** - Bronze
- **🔸 Demais** - Círculo padrão

#### Exemplo de Resposta
```
🏆 Ranking de Moedas - Página 1
🥇 1º - João#1234 - 15,250 moedas
🥈 2º - Maria#5678 - 12,100 moedas
🥉 3º - Pedro#9012 - 8,750 moedas
🔸 4º - Ana#3456 - 7,200 moedas
🔸 5º - Carlos#7890 - 5,800 moedas
```

### 🛒 `/loja [categoria]`
**Descrição:** Abre a loja do servidor com layout em colunas
**Uso:** `/loja` ou `/loja categoria:Games`
**Permissão:** Todos os usuários

#### Funcionalidades
- **Layout em Colunas** - Produtos organizados em 3 colunas
- **Navegação por Páginas** - Botões ⬅️ ➡️ com informação no customId
- **Filtro por Categoria** - Dropdown de seleção
- **Select de Compra** - Menu único para selecionar produtos
- **Informações Detalhadas** - Preço, estoque, descrição compacta

#### Categorias Disponíveis
- **🎮 Games** - Itens relacionados a jogos
- **🎨 Cosmetics** - Itens cosméticos
- **💎 Premium** - Produtos premium
- **🎁 Special** - Itens especiais
- **🔧 Utility** - Utilitários
- **📚 Education** - Conteúdo educacional

#### Exemplo de Uso
```bash
/loja                    # Loja completa
/loja categoria:Games    # Apenas produtos de jogos
/loja categoria:Premium  # Apenas produtos premium
```

### 🛒 `/comprar <produto> [quantidade]`
**Descrição:** Compra produtos da loja com confirmação
**Uso:** `/comprar produto:VIP_Pass quantidade:2`
**Permissão:** Todos os usuários

#### Funcionalidades
- **Autocomplete Inteligente** - Sugestões de produtos ao digitar
- **Seleção de Quantidade** - Escolha quantos itens comprar (1-50)
- **Validação Completa** - Estoque, saldo, produto ativo
- **Embed de Confirmação** - Detalhes completos antes da compra
- **Cálculo de Saldo Futuro** - Mostra saldo após compra
- **Imagem do Produto** - Thumbnail se disponível
- **Sistema de Confirmação** - Botões Confirmar/Cancelar

#### Exemplo de Confirmação
```
🛒 Confirmação de Compra
Você está prestes a comprar VIP Pass

🛍️ Produto: VIP Pass
📦 Quantidade: 2x
💰 Preço Unitário: 500 moedas
💵 Valor Total: 1,000 moedas
🏦 Saldo Atual: 5,000 moedas
💳 Saldo Futuro: 4,000 moedas

📝 Descrição: Acesso VIP com benefícios exclusivos

[✅ Confirmar Compra] [❌ Cancelar]
```

### 🔍 `/produto <nome>`
**Descrição:** Visualiza detalhes de um produto específico
**Uso:** `/produto nome:VIP Pass`
**Permissão:** Todos os usuários

#### Funcionalidades
- **Informações Completas** - Detalhes do produto
- **Preço e Estoque** - Informações atuais
- **Descrição Detalhada** - Descrição completa
- **Opção de Compra** - Botão para comprar
- **Navegação** - Botões anterior/próximo

#### Exemplo de Resposta
```
🛍️ VIP Pass
💰 Preço: 1,000 moedas
📦 Estoque: 50 unidades
📂 Categoria: Premium
📝 Descrição: Acesso VIP ao servidor com benefícios exclusivos
🆔 ID: abc123def456
```

### 📦 `/inventario [usuário]`
**Descrição:** Visualiza inventário de produtos comprados
**Uso:** `/inventario` ou `/inventario usuário:@João`
**Permissão:** Todos os usuários

#### Funcionalidades
- **Lista de Produtos** - Todos os itens comprados
- **Navegação por Páginas** - Botões anterior/próximo
- **Informações de Cada Item** - Detalhes do produto
- **Data de Compra** - Quando foi comprado
- **Visualização de Outros** - Inventário de outros usuários

#### Exemplo de Resposta
```
📦 Inventário de João
🛍️ VIP Pass
📅 Comprado em: 27/10/2025
💰 Valor pago: 1,000 moedas
🆔 ID: abc123def456

🛍️ Item Especial
📅 Comprado em: 26/10/2025
💰 Valor pago: 500 moedas
🆔 ID: def456ghi789
```

### 💰 `/money [usuario] | pay <usuario> <quantidade> [motivo]`
**Descrição:** Comando unificado para gerenciar moedas - ver saldo ou transferir
**Uso:** `/money`, `/money balance usuario:@João`, `/money pay usuario:@João quantidade:1000`
**Permissão:** Todos os usuários

#### Subcomandos
- **`/money balance [usuario]`** - Ver saldo próprio ou de outro usuário
- **`/money pay <usuario> <quantidade> [motivo]`** - Transferir moedas para outro usuário

#### Funcionalidades da Transferência
- **Validação Completa** - Saldo, bots, próprio usuário
- **Embed de Confirmação** - Mostra saldos antes/depois
- **Sistema de Confirmação** - Botões confirmar/cancelar
- **Logs Automáticos** - Registro de todas as transferências
- **Status de Transferência** - MEGA, GRANDE, NORMAL, PEQUENA
- **Limite Inteligente** - 1 a 1.000.000 moedas

#### Exemplo de Transferência
```
💸 Confirmação de Transferência
🎉 MEGA TRANSFERÊNCIA!
Uma quantia impressionante foi transferida!

👤 Remetente: João#1234
👥 Destinatário: Maria#5678
💰 Quantidade: 100,000 moedas

🏦 Seu Saldo: 200,000 → 100,000 moedas
💳 Saldo do Destinatário: 50,000 → 150,000 moedas

📝 Motivo: Parabéns pelo trabalho!

[✅ Confirmar Transferência] [❌ Cancelar]
```

### 📋 `/compras [página]`
**Descrição:** Visualiza histórico de transações pessoais com paginação
**Uso:** `/compras` ou `/compras página:2`
**Permissão:** Todos os usuários

#### Funcionalidades
- **Histórico Completo** - Todas as compras paginadas
- **Paginação Inteligente** - 5 transações por página
- **Detalhes de Transação** - Informações completas preservadas
- **Status Visual** - ✅ Concluída, ⏳ Pendente, ❌ Cancelada
- **Navegação por Botões** - ⬅️ ➡️ entre páginas
- **Nome Preservado** - Histórico mantém nome mesmo se produto for deletado

#### Exemplo de Resposta
```
📋 Transações de João
Página 1 de 3 • Total: 12 transações

1. ✅ VIP Pass
   ┣ 💰 Valor: 1,000 moedas
   ┣ 📦 Quantidade: 1x
   ┣ 📅 Data: 27/10/2025 às 14:30
   ┗ 🆔 ID: txn_123456789

2. ✅ Item Especial
   ┣ 💰 Valor: 500 moedas
   ┣ 📦 Quantidade: 2x
   ┣ 📅 Data: 26/10/2025 às 10:15
   ┗ 🆔 ID: txn_987654321

[⬅️] [➡️]
```

## ✨ Melhorias Implementadas

### 🚀 Sistema de Loja Aprimorado
- **Layout em 3 Colunas** - Melhor aproveitamento do espaço
- **Select Menu Único** - Ao invés de múltiplos botões
- **Paginação Otimizada** - CustomId com informações (action|page-total|category)
- **Navegação Inteligente** - Sem regex, parsing direto do customId
- **Tradução Automática** - "Todos" ↔ "all" convertido automaticamente

### 🛒 Sistema de Compra Avançado
- **Comando `/comprar`** - Interface dedicada para compras
- **Autocomplete Inteligente** - Sugestões em tempo real
- **Parsing Inteligente** - Detecta nome completo do produto (`!comprar Teste 3 1`)
- **Busca MongoDB Otimizada** - Match exato e starts-with
- **Validação Robusta** - Estoque, saldo, produto ativo
- **Confirmação Detalhada** - Embed com todas as informações
- **Cálculo de Saldo Futuro** - Preview do saldo após compra

### 💰 Sistema de Transferência P2P
- **Comando `/money`** - Interface unificada para saldo e transferências
- **Transferência Segura** - Sistema de confirmação com botões
- **Validação Completa** - Impede transferência para bots/próprio usuário
- **Status Inteligente** - MEGA, GRANDE, NORMAL, PEQUENA baseado na quantia
- **Logs Automáticos** - Registro de todas as transferências
- **Cálculo de Saldo Futuro** - Preview para ambos os usuários

### 🏆 Sistema de Conquistas Configurável
- **Achievements Dinâmicos** - Sistema baseado em configuração
- **Fácil Manutenção** - Adicionar/remover conquistas facilmente
- **Múltiplos Níveis** - 7 conquistas diferentes por streak
- **Feedback Visual** - Conquistas mostradas em tempo real

### 📄 Sistema de Paginação Unificado
- **Paginação Universal** - Loja, inventário e transações
- **CustomId Otimizado** - Formato `action|page-total|data`
- **Navegação sem Regex** - Parsing direto do customId
- **Routing Map Pattern** - Handlers organizados e escaláveis
- **Performance Otimizada** - Sem collectors desnecessários
- **Interface Consistente** - Botões ⬅️ ➡️ em todos os comandos

### 🗃️ Sistema de Histórico Melhorado
- **Nome Preservado** - Transações salvam `product_name`
- **Histórico Permanente** - Nomes mantidos mesmo após deleção de produtos
- **Layout Organizado** - Uso de `┣` e `┗` para estrutura visual
- **Status Detalhado** - ✅ Completa, ⏳ Pendente, ❌ Cancelada, 🔄 Reembolsada

## 🎨 Interface e Experiência

### 🖼️ Design dos Embeds
- **Cores Temáticas** - Diferentes cores por comando
- **Emojis Descritivos** - Fácil identificação visual
- **Layout Organizado** - Informações bem estruturadas
- **Barras de Progresso** - Visualização clara do progresso

### 📱 Responsividade
- **Mobile Friendly** - Otimizado para dispositivos móveis
- **Botões Grandes** - Fáceis de tocar em telas pequenas
- **Navegação Simples** - Interface intuitiva
- **Carregamento Rápido** - Performance otimizada

### 🎮 Interatividade
- **Botões Dinâmicos** - Navegação por páginas
- **Menus de Seleção** - Escolha de categorias
- **Confirmações** - Para ações importantes
- **Feedback Visual** - Confirmações claras

## 🔒 Segurança e Validação

### 🛡️ Validações de Segurança
- **Rate Limiting** - Prevenção de spam
- **Validação de Entrada** - Todos os parâmetros
- **Verificação de Usuário** - Usuário deve existir
- **Logs de Auditoria** - Rastreamento de uso

### 🔐 Sistema de Permissões
- **Comandos Públicos** - Todos os usuários
- **Validação Automática** - Verificação de permissões
- **Mensagens de Erro** - Feedback claro
- **Logs de Tentativa** - Registro de tentativas

## 📊 Estatísticas e Métricas

### 📈 Métricas Disponíveis
- **Uso de Comandos** - Comandos mais usados
- **Atividade de Usuários** - Usuários mais ativos
- **Tendências** - Padrões de uso
- **Performance** - Tempo de resposta

### 📊 Relatórios
- **Relatórios Diários** - Atividade do dia
- **Relatórios Semanais** - Crescimento semanal
- **Relatórios Mensais** - Tendências mensais
- **Relatórios Personalizados** - Período customizado

## 🚀 Dicas de Uso

### 💡 Para Usuários
- **Use `/help`** para descobrir novos comandos
- **Colete `/daily`** todos os dias para manter streak e conquistar achievements
- **Use `/money`** para ver saldo e transferir moedas para amigos
- **Explore `/loja`** com layout em colunas e navegação otimizada
- **Use `/comprar`** com autocomplete inteligente para compras rápidas
- **Monitore `/compras`** com paginação para acompanhar gastos
- **Navegue `/inventario`** com paginação para ver seus itens
- **Compita no `/rank`** para subir no ranking do servidor

### 🎯 Para Administradores
- **Monitore uso** dos comandos
- **Analise estatísticas** de engajamento
- **Ajuste produtos** baseado na demanda
- **Configure logs** para monitoramento
- **Otimize performance** baseado no uso

## 🔧 Troubleshooting

### ❌ Problemas Comuns

#### Comando não responde
**Soluções:**
1. Verificar se o bot está online
2. Confirmar permissões do bot
3. Tentar novamente em alguns segundos
4. Verificar se o comando está correto

#### Erro de permissão
**Soluções:**
1. Verificar se tem permissão para o comando
2. Confirmar se o bot tem permissões necessárias
3. Contatar administrador do servidor
4. Verificar configurações do servidor

#### Comando lento
**Soluções:**
1. Verificar conexão com internet
2. Aguardar alguns segundos
3. Tentar novamente
4. Verificar se o servidor está sobrecarregado

### 🔍 Debug
- **Logs do Bot** - Verificar logs para erros
- **Status do Servidor** - Verificar se está funcionando
- **Permissões** - Confirmar configurações
- **Conectividade** - Testar conexão

## 📋 Resumo dos Comandos

### 🇧🇷 Comandos em Português (Usuários)
| Comando | Arquivo | Descrição |
|---------|---------|-----------|
| `/loja` | `shop.js` | Abrir loja com layout em 3 colunas |
| `/comprar` | `comprar.js` | Comprar produtos com autocomplete |
| `/money` | `money.js` | Ver saldo e transferir moedas (unificado) |
| `/inventario` | `inventory.js` | Ver produtos comprados (paginado) |
| `/compras` | `transactions.js` | Ver histórico de compras (paginado) |
| `/produto` | `product.js` | Pesquisar produtos específicos |
| `/daily` | `daily.js` | Coletar recompensa diária + conquistas |
| `/rank` | `leaderboard.js` | Ver ranking do servidor |
| `/help` | `help.js` | Menu de ajuda interativo |
| `/ping` | `ping.js` | Verificar latência do bot |

### 🇺🇸 Comandos em Inglês (Admin)
| Comando | Descrição |
|---------|-----------|
| `/shopadd` | Adicionar produto à loja |
| `/shopedit` | Editar produto existente |
| `/shopremove` | Remover produto da loja |
| `/shopstock` | Gerenciar estoque |
| `/setcoins` | Definir moedas de usuário |
| `/give` | Dar moedas para usuário |
| `/setup` | Configurar bot no servidor |

## 🚀 Próximos Passos

Após dominar os comandos de utilidade:

1. **[Sistema de Logs](07-sistema-logs.md)** - Monitoramento completo
2. **[Deploy](08-deploy.md)** - Colocar em produção
3. **[Comandos Admin](05-comandos-admin.md)** - Gerenciamento avançado

---

**Agora você domina todos os comandos essenciais com as melhorias mais recentes!** 🛠️✨
