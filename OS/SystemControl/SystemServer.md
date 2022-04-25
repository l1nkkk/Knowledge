# daemon
## 什么是daemon
- 实际上不用过多的区分server和daemon，server的提供需要daemon，daemon就是提供某些服务的进程。
- daemon程序的命名通常后面加d。

## 开机启动和服务管理
### 早期的System V的init机制
> 注：System V是很纯净的UNIX版本；早期系统内核第一个调用的就是init。通过init去运行所有系统所需要的服务。
- 服务的启动，关闭，重启，状态查看  
  分别可以对应`/etc/init.d/daemon start|stop|restart|status`来解决
- 服务启动的分类  
  1. 独立启动模式(stand alone):独立启动，一直在内存中，反应很快，
  2. 超级守护进程(super daemon):由特殊的xinetd或inetd两个总管进程 **提供socket对应的端口对应的管理** ；有用户要求时才启动，启动完就结束。缺点就是有点延迟。
- 运行级别的分类
  - linux上有7个运行级别，1,3,5分别表示单人模式，純命令模式，图形界面。每个运行级别的启动脚本 `/etc/rc.d/rc[0-6]/SXXdaemon` 连接到`/etc/init.d/daemon`;其中`S`表示启动该服务；`XX`为数字，表示启动顺序，以此解决依赖
  - 启动时是一个个启动的，不能并发
  - 建立默认要启动的服务时，可通过以下命令
    - 默认要启动：`chkconfig daemon on` 
    - 默认不启动：`chkconfig daemon off`
    - 查看默认为启动与否：`chkconfig --list daemon`
  - 运行级别的切换  
  如果要从3切换到5，并不需要把3的全关了，只要`init 5`即可以切换，系统会去检查`/etc/rc.d/rc[35]/SXXdaemon`，然后切换
- 服务的依赖性问题  
  在运行一个依赖不存在的服务是，该服务是没法运行。没有办法自动解决服务之间的依赖，必须手动执行其依赖服务。

### systemd 使用的unit分类
> 注：系统第一个运行的将是systemd不再是init。现在改用了systemd这个启动服务管理机制
- 并行处理所有服务，加速开机流程。  
- 一经要求就响应的on-demand启动方式；systemd常驻于内存，因此任何要求都可以立即处理 **后续的daemon启动任务**，比如现在要打印，如果打印的daemon就会立刻处理任务
- 服务依赖性的自我检查
- 依daemon功能分类。
  - systemd定义所有的服务为一个`服务单位(unit)`,将unit归类到不同的`服务类型(type)`。
  - unit区分为service、socket、target、path、snapshot、timer等多种不同的type。
- 将多个daemons集合成为一个群组
  - systemd也将许多功能集合成为一个所谓的target项目
  - 也就是**执行了某个target就是执行好多个daemon**的意思。
- 向下兼容就有的init服务脚本
  - 不同见（p566）
  - `需要注意的是如果某个服务不是通过systemctl启动的话，那么systemctl就无处检测到服务，无法进行进一步管理`
## systemd的配置文件放置目录
见p567。  
操作系统会不会执行某些服务其实是看`/etc/systemd/system`下面的设置，所以该目录是一丢连接文件，如果要修改某个服务启动设置，应该去`/usr/lib/systemd/system/`下面
## systemd的unit类型分类说明
- 见p567 
- 查看` ll /lib/systemd/system | grep -E 'go|mysql|cron'`(ubuntu18.04下)

## systemctl的使用
### 常用操作
- 见p568
- 开启|关闭|重启|重新加载配置|开机启动|开机不启动|状态|是否在运行|是否开机启动
- 有的时候会发现把服务关了之后，一会他又被唤醒了，这是因为彼此的依赖性。正规做法是把所有依赖的都关stop了。不正规的做法就是把服务**注销**，通过`mask`可以将脚本配置文件链接到/dev/null，相反就是`unmask`
### status如何查看
- 见p568-569
- `systemctl status mysqld`查看
  - `enabled` 开机启动
  - `active（running）` ,正在执行;其他见p569
  - `PID`，列出一系列进程 
### 查看系统上所有服务
- `systemctl` 相当于 `systemctl list-units`，列出启动的unit，加上 `--all` 才会显示全部，`--type`可以指定类型
- ` systemctl list-unit-files`依据`/lib/systemd/system`列出。会列出其他的服务程序，不像`systemctl list-units`仅以unit分类作大致说明。这个命令会打印type没涉及到的类型后缀如slice。
### 管理不同的操作环境
- `graphiocal.target`：命令加上图形界面，包含了`multi-user.target`。
- `multi-user.target`：純命令行模式。
- `systemctl `
  - `get-default`：取得目前target，也就是默认操作模式，图形界面一般是`graphiocal.target`
  - `set-default`：设置目前target
  - `isolate MODE`：切换到后接的MODE。（注：在service部分用start、stop、restart，在target部分用isolate）
- 一般模式切换用`isolate`即可，但是systemd提供几个简单命令给我们切换操作模式
  - `systemctl poweroff` ：系统关机
  - `systemctl reboot`：系统重启
  - `systemctl suspend`：系统挂起；存于内存
  - `systemctl hibernate`：系统休眠；存于硬盘
  - `systemctl rescue` ：强制进入恢复模式
  - `systemctl emergency`：强制进入紧急恢复模式
### 分析各服务依赖
- `systemctl list-dependencies [unit] [--reverse]`
  - `--reverse`：用来反向查找
  - `default.target`：代表当前的默认target

### 其他
- `systemctl list-sockets`：查看正在监听本地服务需求的socket文件所在位置
- `cat /etc/services`：系统设置的服务与端口对应关系，一般不建议修改
- `netstat -tlunp`：t=tcp,l=listening,u=udp,n=dont't resolve names,p=显示pid和进程名

## systemctl 配置文件
p578-585
- 17.3.3讲了如何搞出一个2版本，与原版本使用不同的配置文件
- 17.3.4讲了如何重复设置；如避免给产生tty1-6各设置一个service，而通过@来解决，转而只使用一个。
## systemctl针对timer的配置
功能和cron差不多，具体查看p585-588