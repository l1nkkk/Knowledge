- 翻译：https://mrcroxx.github.io/posts/paper-reading/gfs-sosp2003/#1-%E5%BC%95%E8%A8%80

# 1. 简介

- GFS：Google File System
- 功能：可扩展的分布式文件系统，适用于大型**分布式数据密集型应用**（数据是应用的瓶颈的一系列应用）
  - **OLAP**
- 支持
  - 可扩展
  - 容错
  - 多用户同时访问
  - 抽象接口，使用起来就像是本机文件系统

## 1.2 考虑点

### 1.2.1 重新审视 fault

- 关键：**组件故障不是例外，是常态**

- 期望：更好的容错、故障检查和恢复能力

### 1.2.2 重新审视IO操作的块大小

- 关键：**文件通常比较大**，GB级别的文件是很常见的，管理小文件是支持的，但是不做过多优化

- 期望：能够存储几百万个 100MB左右或更大的文件，也能支持GB级文件；**必须支持小文件，但是不对其进行优化**

### 1.2.3 重新审视文件的读写方式

  - 关键：

    - **随机读/写在实际中很罕见**，大多数文件是通过附加新数据而不是覆盖现有数据来改变的，一旦写入，文件就只能被读取，而且通常只能按顺序读取。
    - 鉴于这种对大文件的访问模式，***追加* 成为性能优化和原子性保证的重点**，而在客户端**缓存Data Block就失去了吸引力**

  - 期望：大规模的**流式读取和小规模的随机读**取为系统的主要负载。系统负载还来自很多对文件的**大规模追加写入**。必须支持随机写，但是不需要优化。
    - 顺序读规模：几百KB到1MB或更多。 
    - 随机读规模：几KB
    - 写入规模：写入的规模与读取的规模相似，写入后几乎不被再次修改
    - 注：（对于性能敏感应用的随机读，**攒批，排序，形成随机读**）性能敏感的应用程序通常会将排序并批量进行小规模的随机读取，这样可以顺序遍历文件而不是来回遍历

### 1.2.4 应用程序与GFS的API共同设计

- 关键：提供更符合更合理的应用服务

  - 为了简化文件系统，**放宽一致性强度**。

  - 引入了**原子追加操作**，以便多个客户端可以同时追加到一个文件，而无需在它们之间进行额外的同步


- 期望：（**多用户追加原子性**）系统必须良好地定义并实现多个客户端并发向同一个文件追加数据的语义，**最小化原子性需要的同步开销是非常重要的**。持续的**高吞吐比低延迟更重要**
  - 文件通常在生产者-消费者队列中或多路归并中使用（即多端写入）
  - 大多数应用程序更重视高速处理大量数据，而很少有应用程序对单个读写操作有严格的响应时间的需求


## 1.3 接口

- 没有实现像POSIX那样的标准API，但还是提供了大家较为熟悉的文件接口
- **文件被路径名唯一标识**，并在目录中被分层组织
- 支持如创建（create）、删除（delete）、打开（open）、关闭（close）、读（read）、写（write）文件等常用操作
- 支持快照（snapshot）和追加记录（record append）操作
  - 快照操作会以最小代价创建一个文件或一个目录树的拷贝



# 2. 架构

<img src="gfs.assets/image-20220417171603251.png" alt="image-20220417171603251" style="zoom:80%;" />

- 组成：**master、chunkserver、client**
  - master：存元数据、监听chunkserver...
    - Single Master
      - 好处：简化系统设计
    - 注意：必须最小化master节点在读写中的参与
    - master可以通过全局的信息做复杂的chunk分配（chunk placement）和副本相关的决策
  - chunkserver：存储chunk
  - client：数据应用，可部署再chunkserver同节点上（如mapreduce的map or reduce tasks）
- file、chunk、chunk handle
  - file name(包含路径) -- 标识--> file
  - chunk handle(8B, derive from master) -- 标识--> chunk
  - file 被划分为若干大小的 chunk
  - 通过 chunk handle, byte range（字节范围）来确定需要被读写的chunk和chunk中的数据

- 分区(partition)与复制(replicate)
  - 分区本质：file 切分为 chunk
  - 复制本质：每个chunk被冗余存储再多个chunkserver（默认3个，不同的namespace可以有不同指定）
- 元数据：
  - 由master维护
  - 包括
    - 命名空间（namespace）
    - 访问控制（access control）信息
    - file到chunk的映射和chunk当前的位置
    - master还控制系统级活动如chunk租约（chunk lease）管理、孤儿chunk垃圾回收（garbage collection of orphaned chunks）和chunkserver间的chunk迁移（migration，用于扩展）
- HeartBeat ：master周期性地通过心跳（HeartBeat）消息与每个chunkserver通信，向其下达指令并采集其状态信息
- client 与 master 和 chunkserver 的数据交互：
  - 方式：**被链接到应用程序中的GFS client的代码实现了文件系统API并与master和chunkserver通信，代表应用程序来读写数据**
  - master<-->client: 进行元数据操作
  - chunk<-->client: chunk data 相关操作
  - 注：
    - 因为GFS不提供POXIS API，因此不会陷入到Linux vnode层
    - **无缓存**。无论client还是chunkserver都不需要缓存 chunk data，不使用缓存就**消除了缓存一致性问题**，简化了client和整个系统
      - 例外：client需要缓存元数据，减少 Master 的压力

## 2.1 client 读取数据交互过程

- 前提：固定的 chunk size
- client 将 （filename, byte offset）转化为文件的块索引，然后想 master 发送 （filename, chunk index）
- master 恢复响应的 **chunk handle 和 副本的位置**，客户端使用 （filename, chunk index） 为key，来缓存数据
- client 向其中的一个副本发送请求，请求指定 chunk handle 和 byte range（该chunk 要读取的数据范围）
  - 对同一个 chunk的进一步读取，不需要再与master交互
  - 注：client通常一个请求会请求多个块；master发送的响应可以包含紧跟在请求之后的块的信息，一次避免未来 client-master 的交互



## 2.2 chunk 大小

- **64MB，采用 Lazy space allocation 的方式， 避免内部碎片(internal fragmentation)**
  -  Lazy space allocation：在写数据的时候，写攒批一段时间，再写入
  - 大多数块都是满的，只有文件的最后一个块，需要填充
- chunk size 设置得比较大的好处：
  - 减少 client 和 master 的交互
  - client更有可能在给定的 chunk 执行更多操作
  - 减少 master 中保存的元数据大小
- 缺点：
  - 管理仅有几个 chunk 的小文件时，这些chunk可能称为热点。
    - 一个可执行文件被以单个chunk文件的形式写入了GFS，然后在数百台机器上启动。存储这个可执行程序的几台chunkserver因几百个并发的请求超载
    - 解决：
      - 通过增加副本数
      - 让应用错开启动
      - client之间互相读取数据（p2p?）

## 2.3 元数据



- master 存储三种主要类型的metadata：

  - the file and chunk namespaces
  - the mapping from files to chunks
  - the locations of each chunk’s replicas.

- 存储

  - **存储在 master 的内存**，前两种(namespaces and file-to-chunk mapping) 还需要**以日志形式持久化到磁盘**，并且备份到远程主机。（**有点类似 levelDB的op log 的思想，可以被replay 恢复**）
  - **master 永远不会存储 chunk 的location，其会在 启动时 或者 有chunkserver 加入集群式，向 chunkserver 询问其上面的 chunk**

- 存储内存的优势和潜在问题：

  - 操作快。可以定期在后台扫描整个状态，从而实现：（**原理和数据库很像，分区复制机制，少节点的时候重新复制，多节点的时候再平衡**）
    -  chunk 垃圾回收
    - chunkserver故障时重新复制
    - 以及添加节点时chunk的迁移（再平衡）

  - 空间不足怎么办（潜在问题），解决/分析：
    - 因为每个 chunk 都压的足够实，所以元数据自然比较少
    - 对文件名进行前缀压缩（回想levelDB中的 sstable ）
    - 向主服务器添加额外内存的成本是一个很小的代价

- **chunk 的位置信息：为什么master不持久化chunk的位置信息**
  - master启动时轮询，可以使得数据是最新状态
  - 不持久化到master，而是通过启动时询问以及启动后周期性请求，其实现会更加简单。
    - 消除了当chunkserver加入或离开集群、更改名称、故障、重启等问题时，保持master和chunkserver同步的问题。在有着数百台服务器的集群中，这些事件都会经常发生。
  - **chunkserver对其磁盘上有或没有哪些chunk有着最终决定权**

### 2.3.1 op log

- GFS的核心

- 职能：
  - metadata 唯一被持久化的记录
  - **作为并发操作的逻辑时间线**
    - 文件和chunk，以及它们的版本（参见第 4.5 节），都由它们创建的逻辑时间唯一且永恒地标识
- **在落盘到op log之前，metadata 不能被用户所见**（类似levelDB 中 wal 和 memtable）

- **强一致性（必须被可靠存储）**：
  - 将op log 复制到多台远程机器上，并且只有在本地和远程将相应的日志记录刷新到磁盘后才能响应客户端操作
- **攒批写入&复制**：master 在 flush 之前将多个 op log  攒批，然后一起写，减少 flush 和 replication 对系统吞吐的影响
- **checkpoint**:
  - 职能：加快 replay
  - 机制：
    - 当日志超过一定大小时，master会对其状态创建一个检查点（checkpoint），这样master就可以从磁盘加载最后一个检查点并重放该检查点后的日志来恢复状态
    - 可以在不推迟新到来的 update 下，创建 checkpoint。创建检查点时，master会切换到一个新的日志文件并在一个独立的线程中创建检查点。**这个新的检查点包含了在切换前的所有变更**
  - 结构：B树，Key为namespace（猜的）
    - 可以在内存直接被映射，查找命名空间时不需要进行额外的解析，进一步提高了恢复速度，并增强了系统的可用性
  - recover：需要最后一个完整的检查点和后续的日志文件







- 问题：
  - 目的：
  - 基本单位是啥，如何分块
  - 如何复制的
  - 如何原子改名
  - 如何容错
  - 如何保证一致性
  - 如何扩展
  - 如何支持多用户









