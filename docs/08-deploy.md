## 🚀 Visão Geral

Este guia abrange o processo completo de deploy do Discord Shop Bot em produção, incluindo deploy na ShardCloud, configuração de servidor próprio, otimizações de performance, monitoramento e manutenção contínua.

## ☁️ Deploy na ShardCloud (Recomendado)

A ShardCloud é uma plataforma especializada em hospedagem de bots Discord que oferece deploy simplificado e gerenciamento automático.

### 🎯 Vantagens da ShardCloud
- **Deploy Automático** - Upload e configuração em minutos
- **Gerenciamento Simplificado** - Interface web intuitiva
- **Escalabilidade Automática** - Recursos ajustados conforme necessário
- **Monitoramento Integrado** - Logs e métricas em tempo real
- **Backup Automático** - Proteção de dados garantida
- **SSL/TLS Incluído** - Segurança automática
- **Suporte Especializado** - Suporte técnico para bots Discord

### 📋 Pré-requisitos para ShardCloud
- **Conta na ShardCloud** - Crie uma conta em [shardcloud.app](https://shardcloud.app)
- **Bot Discord** - Bot criado no Discord Developer Portal
- **MongoDB Atlas** - Banco de dados em nuvem (recomendado)
- **Código Preparado** - Projeto pronto para deploy

### 🚀 Deploy Passo a Passo na ShardCloud

#### 1. Preparação do Projeto
```bash
# Certifique-se de que o projeto está funcionando localmente
npm install
npm run dev

# Teste todos os comandos principais
# Verifique se não há erros no console
```

#### 2. Configuração do Arquivo .shardcloud
Crie o arquivo `.shardcloud` na raiz do projeto:

```plaintext
DISPLAY_NAME=Discord Shop Bot
MAIN=bot.js
MEMORY=512
VERSION=recommended
DESCRIPTION=Bot Discord completo com sistema de loja virtual, economia de moedas e administração avançada
```

**Explicação dos parâmetros:**
- **DISPLAY_NAME**: Nome que aparecerá no painel da ShardCloud
- **MAIN**: Arquivo principal de entrada (bot.js)
- **MEMORY**: Quantidade de RAM alocada (512MB é suficiente para a maioria dos casos)
- **VERSION**: Versão do Node.js (recommended usa a versão estável mais recente)
- **DESCRIPTION**: Descrição do projeto para identificação

#### 3. Configuração das Variáveis de Ambiente
Configure as seguintes variáveis no painel da ShardCloud:

```env
# Bot Discord (OBRIGATÓRIO)
BOT_TOKEN=seu_token_do_bot_discord
CLIENT_ID=seu_client_id_do_bot

# Banco de Dados (OBRIGATÓRIO)
DATABASE=mongodb+srv://usuario:senha@cluster.mongodb.net/discord-shop-bot

# Configurações Opcionais
MAIN_SERVER=id_do_servidor_principal
SUPPORT_SERVER=id_do_servidor_de_suporte
NODE_ENV=production
```

#### 4. Upload e Deploy
1. **Acesse o Painel**: Vá para [shardcloud.app/dash](https://shardcloud.app/dash)
2. **Crie Nova Aplicação**: Clique em "New App"
3. **Faça Upload**: Compacte todo o projeto em ZIP e faça upload
4. **Configure Variáveis**: Adicione as variáveis de ambiente
5. **Deploy**: Clique em "Deploy" e aguarde a conclusão

#### 5. Verificação do Deploy
Após o deploy:
1. **Verifique Logs**: Acesse a aba "Logs" no painel
2. **Teste o Bot**: Verifique se o bot aparece online no Discord
3. **Teste Comandos**: Execute `/ping` para verificar funcionamento
4. **Configure Servidor**: Use `/setup` para configurar o servidor

### 🔧 Configuração Avançada na ShardCloud

#### Configuração de Recursos
```plaintext
# Para servidores grandes (1000+ membros)
MEMORY=1024
VERSION=18

# Para servidores pequenos (100- membros)
MEMORY=256
VERSION=16
```

#### Configuração de Domínio Personalizado
1. **Adicione Domínio**: No painel, vá para "Domains"
2. **Configure DNS**: Aponte seu domínio para a ShardCloud
3. **SSL Automático**: Certificado SSL será gerado automaticamente

#### Configuração de Backup
- **Backup Automático**: ShardCloud faz backup automático dos dados
- **Backup Manual**: Use o botão "Backup" no painel quando necessário
- **Restauração**: Use "Restore" para restaurar backups anteriores

### 📊 Monitoramento na ShardCloud

#### Métricas Disponíveis
- **CPU Usage** - Uso de processamento
- **Memory Usage** - Uso de memória RAM
- **Network I/O** - Tráfego de rede
- **Uptime** - Tempo de funcionamento
- **Response Time** - Tempo de resposta

#### Logs em Tempo Real
- **Application Logs** - Logs da aplicação
- **Error Logs** - Logs de erro
- **System Logs** - Logs do sistema
- **Performance Logs** - Logs de performance

#### Alertas Configuráveis
- **Bot Offline** - Quando o bot para de funcionar
- **High Resource Usage** - Quando recursos estão altos
- **Error Rate** - Quando há muitos erros
- **Custom Alerts** - Alertas personalizados

### 🔄 Atualizações na ShardCloud

#### Deploy de Atualizações
1. **Faça Alterações**: Modifique o código localmente
2. **Teste Localmente**: Certifique-se de que funciona
3. **Compacte Projeto**: Crie novo ZIP com as alterações
4. **Upload**: Faça upload do novo ZIP
5. **Deploy**: Clique em "Deploy" para atualizar

#### Rollback Automático
- **Rollback Disponível**: ShardCloud mantém versões anteriores
- **Rollback Rápido**: Um clique para voltar à versão anterior
- **Zero Downtime**: Deploy sem interrupção do serviço

### 💰 Custos e Planos

#### Plano Gratuito
- **512MB RAM** - Suficiente para bots pequenos
- **1 Aplicação** - Uma aplicação por conta
- **Logs Básicos** - Logs por 7 dias
- **Suporte Comunitário** - Suporte via Discord

#### Planos Pagos
- **Mais RAM** - Até 4GB de RAM
- **Múltiplas Aplicações** - Várias aplicações
- **Logs Estendidos** - Logs por 30+ dias
- **Suporte Prioritário** - Suporte técnico direto
- **Domínios Personalizados** - Domínios próprios

### 🆘 Suporte na ShardCloud

#### Recursos de Suporte
- **Documentação Completa** - [docs.shardcloud.app](https://docs.shardcloud.app)
- **Discord de Suporte** - Comunidade ativa
- **Tickets de Suporte** - Suporte técnico direto
- **Status Page** - Status dos serviços

#### Troubleshooting Comum
- **Bot não inicia**: Verifique logs e variáveis de ambiente
- **Erro de conexão**: Verifique BOT_TOKEN e CLIENT_ID
- **Problemas de banco**: Verifique string de conexão do MongoDB
- **Alto uso de recursos**: Considere upgrade de plano

## 🖥️ Deploy em Servidor Próprio (Avançado)

Para usuários que preferem ter controle total sobre a infraestrutura, é possível fazer deploy em servidor próprio.

### 🎯 Pré-requisitos

### 💻 Servidor de Produção
- **Sistema Operacional:** Ubuntu 20.04+ ou CentOS 8+
- **RAM:** Mínimo 2GB (Recomendado: 4GB+)
- **CPU:** 2 cores (Recomendado: 4 cores+)
- **Armazenamento:** 20GB+ SSD
- **Conexão:** Internet estável com boa latência

### 🔧 Ferramentas Necessárias
- **Node.js** 16.11.0+
- **MongoDB** 4.4+
- **PM2** (Process Manager)
- **Nginx** (Proxy Reverso)
- **Certbot** (SSL/TLS)
- **UFW** (Firewall)

## 🛠️ Configuração do Servidor

### 1. Atualização do Sistema
```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

### 2. Instalação do Node.js
```bash
# Instalar Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

### 3. Instalação do MongoDB
```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Iniciar e habilitar MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 4. Instalação do PM2
```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Configurar PM2 para iniciar com o sistema
pm2 startup
sudo env PATH=$PATH:/usr/bin $(which pm2) startup systemd -u $USER --hp $HOME
```

### 5. Configuração do Firewall
```bash
# Instalar UFW
sudo apt install ufw -y

# Configurar regras básicas
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# Habilitar firewall
sudo ufw enable
```

## 📦 Deploy da Aplicação

### 1. Preparação do Código
```bash
# Clonar repositório
git clone <repository-url> /opt/discord-bot-shop
cd /opt/discord-bot-shop

# Instalar dependências
npm install --production

# Configurar variáveis de ambiente
cp .env.example .env
nano .env
```

### 2. Configuração das Variáveis de Ambiente
```env
# Bot Discord
BOT_TOKEN=seu_token_de_producao
CLIENT_ID=seu_client_id_de_producao

# Banco de Dados
DATABASE=mongodb://localhost:27017/discord-shop-prod

# Configurações de Produção
NODE_ENV=production
PORT=3000

# Configurações Opcionais
MAIN_SERVER=id_do_servidor_principal
SUPPORT_SERVER=id_do_servidor_de_suporte
```

### 3. Configuração do PM2
```bash
# Criar arquivo de configuração do PM2
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'discord-bot-shop',
    script: 'bot.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF
```

### 4. Iniciar a Aplicação
```bash
# Iniciar com PM2
pm2 start ecosystem.config.js

# Salvar configuração do PM2
pm2 save

# Verificar status
pm2 status
pm2 logs discord-bot-shop
```

## 🔒 Configuração de Segurança

### 1. Configuração do Nginx
```bash
# Instalar Nginx
sudo apt install nginx -y

# Configurar site
sudo nano /etc/nginx/sites-available/discord-bot-shop
```

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Habilitar site
sudo ln -s /etc/nginx/sites-available/discord-bot-shop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2. Configuração de SSL/TLS
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com

# Configurar renovação automática
sudo crontab -e
# Adicionar linha:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. Configuração de Backup
```bash
# Criar script de backup
cat > /opt/backup-bot.sh << EOF
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
BOT_DIR="/opt/discord-bot-shop"

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Backup do banco de dados
mongodump --out $BACKUP_DIR/mongodb_$DATE

# Backup dos logs
tar -czf $BACKUP_DIR/logs_$DATE.tar.gz $BOT_DIR/logs/

# Backup da configuração
cp $BOT_DIR/.env $BACKUP_DIR/env_$DATE

# Manter apenas backups dos últimos 7 dias
find $BACKUP_DIR -type f -mtime +7 -delete
EOF

# Tornar executável
chmod +x /opt/backup-bot.sh

# Configurar cron para backup diário
sudo crontab -e
# Adicionar linha:
# 0 2 * * * /opt/backup-bot.sh
```

## 📊 Monitoramento e Logs

### 1. Configuração de Logs
```bash
# Criar diretório de logs
mkdir -p /opt/discord-bot-shop/logs

# Configurar rotação de logs
sudo nano /etc/logrotate.d/discord-bot-shop
```

```
/opt/discord-bot-shop/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reload discord-bot-shop
    endscript
}
```

### 2. Monitoramento com PM2
```bash
# Instalar PM2 Plus (opcional)
pm2 install pm2-server-monit

# Configurar monitoramento
pm2 monit
```

### 3. Configuração de Alertas
```bash
# Criar script de monitoramento
cat > /opt/monitor-bot.sh << EOF
#!/bin/bash
# Verificar se o bot está rodando
if ! pm2 list | grep -q "discord-bot-shop.*online"; then
    echo "Bot está offline! Reiniciando..."
    pm2 restart discord-bot-shop
    # Enviar alerta por email (opcional)
    echo "Bot reiniciado em $(date)" | mail -s "Bot Discord Offline" admin@seu-dominio.com
fi
EOF

# Tornar executável
chmod +x /opt/monitor-bot.sh

# Configurar cron para verificação a cada 5 minutos
sudo crontab -e
# Adicionar linha:
# */5 * * * * /opt/monitor-bot.sh
```

## 🔧 Otimizações de Performance

### 1. Otimização do Node.js
```bash
# Configurar variáveis de ambiente para performance
cat >> /opt/discord-bot-shop/.env << EOF
NODE_OPTIONS=--max-old-space-size=2048
UV_THREADPOOL_SIZE=16
EOF
```

### 2. Otimização do MongoDB
```bash
# Configurar MongoDB para produção
sudo nano /etc/mongod.conf
```

```yaml
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true
  wiredTiger:
    engineConfig:
      cacheSizeGB: 1

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

net:
  port: 27017
  bindIp: 127.0.0.1

processManagement:
  timeZoneInfo: /usr/share/zoneinfo
```

### 3. Otimização do Nginx
```bash
# Configurar Nginx para performance
sudo nano /etc/nginx/nginx.conf
```

```nginx
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

## 🚀 Deploy Automatizado

### 1. Configuração do CI/CD
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /opt/discord-bot-shop
          git pull origin main
          npm install --production
          pm2 restart discord-bot-shop
```

### 2. Script de Deploy
```bash
# Criar script de deploy
cat > /opt/deploy-bot.sh << EOF
#!/bin/bash
set -e

BOT_DIR="/opt/discord-bot-shop"
BACKUP_DIR="/opt/backups"

echo "Iniciando deploy..."

# Backup antes do deploy
echo "Fazendo backup..."
/opt/backup-bot.sh

# Parar o bot
echo "Parando bot..."
pm2 stop discord-bot-shop

# Atualizar código
echo "Atualizando código..."
cd $BOT_DIR
git pull origin main

# Instalar dependências
echo "Instalando dependências..."
npm install --production

# Iniciar bot
echo "Iniciando bot..."
pm2 start discord-bot-shop

# Verificar status
echo "Verificando status..."
pm2 status discord-bot-shop

echo "Deploy concluído!"
EOF

# Tornar executável
chmod +x /opt/deploy-bot.sh
```

## 📊 Monitoramento de Produção

### 1. Métricas Importantes
- **Uptime** - Tempo de funcionamento
- **CPU Usage** - Uso de CPU
- **Memory Usage** - Uso de memória
- **Disk Usage** - Uso de disco
- **Network I/O** - Tráfego de rede
- **Response Time** - Tempo de resposta

### 2. Alertas Configurados
- **Bot Offline** - Bot parou de funcionar
- **High CPU** - CPU acima de 80%
- **High Memory** - Memória acima de 90%
- **Disk Full** - Disco acima de 85%
- **Database Error** - Erro no banco de dados

### 3. Dashboard de Monitoramento
```bash
# Instalar ferramentas de monitoramento
sudo apt install htop iotop nethogs -y

# Configurar monitoramento contínuo
pm2 install pm2-server-monit
```

## 🔧 Manutenção Contínua

### 1. Atualizações Regulares
```bash
# Script de atualização
cat > /opt/update-bot.sh << EOF
#!/bin/bash
set -e

echo "Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

echo "Atualizando Node.js..."
sudo npm install -g npm@latest

echo "Atualizando PM2..."
sudo npm install -g pm2@latest

echo "Atualizando bot..."
cd /opt/discord-bot-shop
git pull origin main
npm install --production
pm2 restart discord-bot-shop

echo "Atualização concluída!"
EOF

# Tornar executável
chmod +x /opt/update-bot.sh
```

### 2. Limpeza de Logs
```bash
# Script de limpeza
cat > /opt/cleanup-bot.sh << EOF
#!/bin/bash
echo "Limpando logs antigos..."
find /opt/discord-bot-shop/logs -name "*.log" -mtime +30 -delete

echo "Limpando backups antigos..."
find /opt/backups -name "*" -mtime +7 -delete

echo "Limpando cache do PM2..."
pm2 flush

echo "Limpeza concluída!"
EOF

# Tornar executável
chmod +x /opt/cleanup-bot.sh

# Configurar cron para limpeza semanal
sudo crontab -e
# Adicionar linha:
# 0 3 * * 0 /opt/cleanup-bot.sh
```

## 🚨 Troubleshooting

### 1. Problemas Comuns

#### Bot não inicia
```bash
# Verificar logs
pm2 logs discord-bot-shop

# Verificar configuração
pm2 show discord-bot-shop

# Reiniciar
pm2 restart discord-bot-shop
```

#### Erro de memória
```bash
# Verificar uso de memória
pm2 monit

# Aumentar limite de memória
pm2 restart discord-bot-shop --max-memory-restart 2G
```

#### Problemas de banco
```bash
# Verificar status do MongoDB
sudo systemctl status mongod

# Verificar logs do MongoDB
sudo tail -f /var/log/mongodb/mongod.log

# Reiniciar MongoDB
sudo systemctl restart mongod
```

### 2. Comandos de Diagnóstico
```bash
# Status geral
pm2 status
pm2 monit

# Logs em tempo real
pm2 logs discord-bot-shop --lines 100

# Informações detalhadas
pm2 show discord-bot-shop

# Reiniciar bot
pm2 restart discord-bot-shop

# Parar bot
pm2 stop discord-bot-shop

# Iniciar bot
pm2 start discord-bot-shop
```

## 📋 Checklist de Deploy

### ✅ Pré-Deploy
- [ ] Servidor configurado e atualizado
- [ ] Node.js e MongoDB instalados
- [ ] PM2 configurado
- [ ] Firewall configurado
- [ ] Domínio configurado (se aplicável)

### ✅ Deploy
- [ ] Código clonado e configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Dependências instaladas
- [ ] Bot iniciado com PM2
- [ ] Status verificado

### ✅ Pós-Deploy
- [ ] SSL/TLS configurado
- [ ] Backup configurado
- [ ] Monitoramento configurado
- [ ] Alertas configurados
- [ ] Documentação atualizada

## 🚀 Próximos Passos

Após o deploy em produção:

1. **[Manutenção](09-manutencao.md)** - Cuidados contínuos
2. **[Otimização](10-otimizacao.md)** - Melhorar performance
3. **[Escalabilidade](11-escalabilidade.md)** - Crescer com o servidor

---

**Seu bot está rodando em produção com sucesso!** 🚀🎉
