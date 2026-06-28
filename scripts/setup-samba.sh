#!/bin/bash
# Roda como root na VPS: sudo bash setup-samba.sh
# Compartilha /var/entratta/pedidos via SMB para acesso em rede

set -e

PEDIDOS_DIR="/var/entratta/pedidos"
SAMBA_USER="entratta"
SAMBA_SHARE="Pedidos"

echo "==> Instalando Samba..."
apt-get update -qq
apt-get install -y samba

echo "==> Criando pasta de pedidos..."
mkdir -p "$PEDIDOS_DIR"
chown -R www-data:www-data "$PEDIDOS_DIR"
chmod -R 775 "$PEDIDOS_DIR"

# Adiciona www-data ao grupo samba para que o Next.js possa gravar
groupadd -f sambashare
usermod -aG sambashare www-data

echo "==> Criando usuário Samba '$SAMBA_USER'..."
# Cria usuário de sistema se não existir (sem home, sem login)
id "$SAMBA_USER" &>/dev/null || useradd -M -s /sbin/nologin "$SAMBA_USER"
usermod -aG sambashare "$SAMBA_USER"

# Define a senha Samba (você será solicitado a digitar)
echo ""
echo ">>> DEFINA A SENHA para o usuário '$SAMBA_USER' acessar a pasta em rede:"
smbpasswd -a "$SAMBA_USER"

echo "==> Configurando /etc/samba/smb.conf..."

# Faz backup do smb.conf original
cp /etc/samba/smb.conf /etc/samba/smb.conf.bak 2>/dev/null || true

cat > /etc/samba/smb.conf <<EOF
[global]
   workgroup = WORKGROUP
   server string = Entratta Server
   server role = standalone server
   log file = /var/log/samba/log.%m
   max log size = 1000
   logging = file
   panic action = /usr/share/samba/panic-action %d

   # Segurança
   security = user
   map to guest = never
   encrypt passwords = yes

   # Performance / compatibilidade Windows e macOS
   socket options = TCP_NODELAY IPTOS_LOWDELAY SO_RCVBUF=131072 SO_SNDBUF=131072
   read raw = yes
   write raw = yes
   oplocks = yes
   max xmit = 65535
   dead time = 15
   getwd cache = yes

   # macOS (Finder)
   vfs objects = fruit streams_xattr
   fruit:metadata = stream
   fruit:model = MacSamba
   fruit:posix_rename = yes
   fruit:veto_appledouble = no
   fruit:wipe_intentionally_left_blank_rfork = yes
   fruit:delete_empty_adfiles = yes

[$SAMBA_SHARE]
   comment = Pedidos Entratta — Producao
   path = $PEDIDOS_DIR
   browseable = yes
   read only = no
   writable = yes
   create mask = 0664
   directory mask = 0775
   valid users = $SAMBA_USER
   force group = sambashare
EOF

echo "==> Ajustando permissões da pasta..."
chown -R :"sambashare" "$PEDIDOS_DIR"
chmod -R 2775 "$PEDIDOS_DIR"   # setgid para novos arquivos herdarem o grupo

echo "==> Abrindo porta 445 (SMB) no firewall..."
ufw allow 445/tcp 2>/dev/null || true
ufw allow 137/udp 2>/dev/null || true
ufw allow 138/udp 2>/dev/null || true
ufw allow 139/tcp 2>/dev/null || true

echo "==> Reiniciando Samba..."
systemctl enable smbd nmbd
systemctl restart smbd nmbd

echo ""
echo "======================================"
echo "  Samba configurado com sucesso!"
echo "======================================"
echo ""
echo "  Pasta compartilhada: $PEDIDOS_DIR"
echo "  Nome do compartilhamento: \\\\<IP-DO-VPS>\\$SAMBA_SHARE"
echo "  Usuário: $SAMBA_USER"
echo ""
echo "  Para conectar no Windows:"
echo "    Win + R → \\\\<IP-DO-VPS>\\Pedidos"
echo "    Ou mapear como unidade de rede (Z:, P:, etc.)"
echo ""
echo "  Para conectar no Mac:"
echo "    Finder → Ir → Conectar ao servidor → smb://<IP-DO-VPS>/Pedidos"
echo ""
echo "  IP do servidor:"
ip -4 addr show | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | grep -v 127.0.0.1
echo ""
