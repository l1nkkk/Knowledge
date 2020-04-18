- [文章](#%E6%96%87%E7%AB%A0)
- [镜像基本使用](#%E9%95%9C%E5%83%8F%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8)
  - [获取镜像](#%E8%8E%B7%E5%8F%96%E9%95%9C%E5%83%8F)
    - [运行](#%E8%BF%90%E8%A1%8C)
  - [查看镜像信息](#%E6%9F%A5%E7%9C%8B%E9%95%9C%E5%83%8F%E4%BF%A1%E6%81%AF)
    - [列出镜像](#%E5%88%97%E5%87%BA%E9%95%9C%E5%83%8F)
    - [镜像的体积](#%E9%95%9C%E5%83%8F%E7%9A%84%E4%BD%93%E7%A7%AF)
    - [虚悬镜像](#%E8%99%9A%E6%82%AC%E9%95%9C%E5%83%8F)
    - [中间层镜像](#%E4%B8%AD%E9%97%B4%E5%B1%82%E9%95%9C%E5%83%8F)
    - [列出部分镜像](#%E5%88%97%E5%87%BA%E9%83%A8%E5%88%86%E9%95%9C%E5%83%8F)
    - [以特定格式显示](#%E4%BB%A5%E7%89%B9%E5%AE%9A%E6%A0%BC%E5%BC%8F%E6%98%BE%E7%A4%BA)
  - [删除镜像](#%E5%88%A0%E9%99%A4%E9%95%9C%E5%83%8F)
    - [Untagged 和 Deleted](#Untagged-%E5%92%8C-Deleted)
    - [用 docker image ls 命令来配合](#%E7%94%A8-docker-image-ls-%E5%91%BD%E4%BB%A4%E6%9D%A5%E9%85%8D%E5%90%88)
# 文章
- docker简明教程  
  快速让你学会安装docker，拖取镜像，运行容器，存储镜像，Dockerfile的使用，DaoCloud使用
  > https://blog.saymagic.cn/2015/06/01/learning-docker.html#post__title


# 镜像基本使用
## 获取镜像
```sh
docker pull [选项] [Docker Registry 地址[:端口号]/]仓库名[:标签]
# 具体选项查看
docker pull --help

# eg
docker pull ubuntu:18.04

```
- Docker 镜像仓库地址：地址的格式一般是 <域名/IP>[:端口号]。默认地址是 Docker Hub。
- 仓库名：如之前所说，这里的仓库名是两段式名称，即 <用户名>/<软件名>。对于 Docker Hub，如果不给出用户名，则默认为 library，也就是官方镜像。

### 运行
`docker run -it --rm ubuntu:18.04  bash`  
- **-it**：这是两个参数，一个是 -i：交互式操作，一个是 -t 终端。我们这里打算进入 bash 执行一些命令并查看返回结果，因此我们需要交互式终端。
- **--rm**：这个参数是说容器退出后随之将其删除。默认情况下，为了排障需求，退出的容器并不会立即删除，除非手动 docker rm。我们这里只是随便执行个命令，看看结果，不需要排障和保留结果，因此使用 --rm 可以避免浪费空间。
- 查看系统版本`cat /etc/os-release`
- 退出`exit`

## 查看镜像信息
### 列出镜像
`docker image ls`  
```
$ docker image ls
REPOSITORY           TAG                 IMAGE ID            CREATED             SIZE
redis                latest              5f515359c7f8        5 days ago          183 MB
nginx                latest              05a60462f8ba        5 days ago          181 MB
mongo                3.2                 fe9198c04d62        5 days ago          342 MB
<none>               <none>              00285df0df87        5 days ago          342 MB
ubuntu               18.04               f753707788c5        4 weeks ago         127 MB
ubuntu               latest              f753707788c5        4 weeks ago         127 MB
```

- **镜像** ID 则是镜像的唯一标识，一个镜像可以对应多个 **标签**

### 镜像的体积

- 查看镜像、容器、数据卷所占用的空间。
```sh
$ docker system df

TYPE                TOTAL               ACTIVE              SIZE                RECLAIMABLE
Images              24                  0                   1.992GB             1.992GB (100%)
Containers          1                   0                   62.82MB             62.82MB (100%)
Local Volumes       9                   0                   652.2MB             652.2MB (100%)
Build Cache                                                 0B                  0B

```
- ubuntu:18.04 镜像大小，在这里是 127 MB，但是在 Docker Hub 显示的却是 50 MB。这是因为 Docker Hub 中显示的体积是压缩后的体积
- docker image ls 列表中的镜像体积总和并非是所有镜像实际硬盘消耗。由于 Docker 镜像是多层存储结构，并且可以继承、复用，因此不同镜像可能会因为使用相同的基础镜像，从而拥有共同的层。

### 虚悬镜像

```sh
<none>               <none>              00285df0df87        5 days ago          342 MB
```
- 由于新旧镜像同名，旧镜像名称被取消，从而出现仓库名、标签均为 \<none> 的镜像。这类无标签镜像也被称为 **虚悬镜像(dangling image)** ，可以用下面的命令专门显示这类镜像：
```sh
$ docker image ls -f dangling=true
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
<none>              <none>              00285df0df87        5 days ago          342 MB

```


### 中间层镜像
为了加速镜像构建、重复利用资源，Docker 会利用 **中间层镜像**。
- 查看
```sh
$ docker image ls -a
```
- 这样会看到很多无标签的镜像，与之前的虚悬镜像不同，这些无标签的镜像很多都是中间层镜像，是其它镜像所依赖的镜像
- 只要删除那些依赖它们的镜像后，这些依赖的中间层镜像也会被连带删除。

### 列出部分镜像
- 根据仓库名列出镜像
```sh
$ docker image ls ubuntu
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
ubuntu              18.04               f753707788c5        4 weeks ago         127 MB
ubuntu              latest              f753707788c5        4 weeks ago         127 MB
```
- 列出特定的某个镜像，也就是说指定仓库名和标签
```sh
$ docker image ls ubuntu:18.04
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
ubuntu              18.04               f753707788c5        4 weeks ago         127 MB
```
- 使用过滤器--filter，简写-f。在 mongo:3.2 之后建立的镜像。想查看某个位置之前的镜像也可以，只需要把 since 换成 before 即可。
```
$ docker image ls -f since=mongo:3.2
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
redis               latest              5f515359c7f8        5 days ago          183 MB
nginx               latest              05a60462f8ba        5 days ago          181 MB
```
- 如果镜像构建时，定义了 LABEL，还可以通过 LABEL 来过滤。
```
 docker image ls -f label=com.example.version=0.1
```
- 镜像摘要
```
$ docker image ls --digests
REPOSITORY                  TAG                 DIGEST                                                                    IMAGE ID            CREATED             SIZE
node                        slim                sha256:b4f0e0bdeb578043c1ea6862f0d40cc4afe32a4a582f3be235a3b164422be228   6e0c4c8e3913        3 weeks ago         214 MB
```

### 以特定格式显示
- 默认情况下，docker image ls 会输出一个完整的表格，但是我们并非所有时候都会需要这些内容。比如，刚才删除虚悬镜像的时候，我们需要利用 docker image ls 把所有的虚悬镜像的 ID 列出来，然后才可以交给 docker image rm 命令作为参数来删除指定的这些镜像，这个时候就用到了 -q 参数。

```
$ docker image ls -q
5f515359c7f8
05a60462f8ba
fe9198c04d62
00285df0df87
f753707788c5
f753707788c5
1e0c3dd64ccd
```
- --filter 配合 -q 产生出指定范围的 ID 列表，然后送给另一个 docker 命令作为参数，从而针对这组实体成批的进行某种操作的做法在 Docker 命令行使用过程中非常常见，不仅仅是镜像，将来我们会在各个命令中看到这类搭配以完成很强大的功能。因此每次在文档看到过滤器后，可以多注意一下它们的用法。
- 另外一些时候，我们可能只是对表格的结构不满意，希望自己组织列；或者不希望有标题，这样方便其它程序解析结果等，这就用到了 Go 的模板语法。比如，下面的命令会直接列出镜像结果，并且只包含镜像ID和仓库名：
```sh
$ docker image ls --format "{{.ID}}: {{.Repository}}"
5f515359c7f8: redis
05a60462f8ba: nginx
fe9198c04d62: mongo
00285df0df87: <none>
f753707788c5: ubuntu
f753707788c5: ubuntu
1e0c3dd64ccd: ubuntu
```
- 或者打算以表格等距显示，并且有标题行，和默认一样，不过自己定义列：
```
$ docker image ls --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"
IMAGE ID            REPOSITORY          TAG
5f515359c7f8        redis               latest
05a60462f8ba        nginx               latest
fe9198c04d62        mongo               3.2
00285df0df87        <none>              <none>
f753707788c5        ubuntu              18.04
f753707788c5        ubuntu              latest
```
## 删除镜像
```sh
$ docker image rm [选项] <镜像1> [<镜像2> ...]
```
- <镜像> 可以是 镜像短 ID、镜像长 ID、镜像名 或者 镜像摘要
- 镜像摘要
```sh
$ docker image rm node@sha256:b4f0e0bdeb578043c1ea6862f0d40cc4afe32a4a582f3be235a3b164422be228
Untagged: node@sha256:b4f0e0bdeb578043c1ea6862f0d40cc4afe32a4a582f3be235a3b164422be228
```

### Untagged 和 Deleted
- **Untaggeds** 是删标签，所有标签都没了，就触发delete。
- 除了镜像依赖以外，还需要注意的是容器对镜像的依赖。如果有用这个镜像启动的容器存在（即使容器没有运行），那么同样不可以删除这个镜像。之前讲过，**容器是以镜像为基础，再加一层容器存储层，组成这样的多层存储结构去运行的。**因此该镜像如果被这个容器所依赖的，那么删除必然会导致故障。如果这些容器是不需要的，应该先将它们删除，然后再来删除镜像。

### 用 docker image ls 命令来配合
- 删除所有仓库名为 redis 的镜像：
```sh
$ docker image rm $(docker image ls -q redis)
```
- 删除所有在 mongo:3.2 之前的镜像
```sh
$ docker image rm $(docker image ls -q -f before=mongo:3.2)
```