- 安装

```sh
bash <(curl -L -s https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh)
# 上列命令会自动安装 V2Ray，然后执行下面命令运行
systemctl start v2ray
```

- nginx

```
sudo yum install -y epel-release
sudo yum install -y nginx
```

- 防火墙
  - 开端口
  - 重启： firewall-cmd --reload 
```sh
iki/How-to-debug-acme.sh
[root@vultr ~]# firewall-cmd --zone=public --add-port=80/tcp --permanent 
success
[root@vultr ~]# firewall-cmd --zone=public --add-port=443/tcp --permanent 
success
[root@vultr ~]# firewall-cmd --zone=public --add-port=10000/tcp --permanent 
success

```

- nginx配置

```
    server {
    listen 443 ssl;
    listen [::]:443 ssl;
    
    ssl_certificate       /etc/v2ray/v2ray.crt;
    ssl_certificate_key   /etc/v2ray/v2ray.key;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozSSL:10m;
    ssl_session_tickets off;
    
    ssl_protocols         TLSv1.2 TLSv1.3;
    ssl_ciphers           ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    server_name           mydomain.me;
    location /ray { 
        if ($http_upgrade != "websocket") { # WebSocket协商失败时返回404
            return 404;
        }
        proxy_redirect off;
        proxy_pass http://127.0.0.1:10000; 
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        # Show real IP in v2ray access.log
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    }
```

- 测试ssl：https://www.ssllabs.com/ssltest/index.html
- 配置：https://guide.v2fly.org/advanced/wss_and_web.html