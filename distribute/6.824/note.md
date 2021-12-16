- [概述](#概述)
  - [mapreduce](#mapreduce)
- [RPC & Thread](#rpc--thread)


# 概述
- 本质：分布式只是顶不住后的妥协。能单机就单机，简单。
- 关键：系统的接口应该隐藏分布式特性，不被用户感知（Abstraction）
> 两大方面的分布式
- 存储
- 计算

> 讨论的问题
- 并行 (parallelism)
  - 如何在多个机器中并行管理大量CPU和大量内存
  - 分布式系统目标：性能
    - 可扩展性(Scalability)：比如两个计算机就有两倍的算力
- 容错（fault tolerate）
  - Why：单机罕见的错误，在分布式中被放大。把一个几乎不用考虑的小问题，变成一个持续不断的问题。
  - What：
    - 可用性（Availability）：在**某些情况**下，系统还是可以给你提供**完整的服务**。（冗余）
    - 可恢复性（Recoverability）： 出现了问题，可以恢复到可用状态。（redo log，借助非易失性存储non-volatile storage ）
- 物理距离（physical）
  - 两个服务器之间数据通信和同步
  - 一致性（Consistency）：两个系统内容之间的一致，性能和容错两方面的考虑。
    - 强一致性：保证 get 最新数据。代价高，容错好。
    - 弱一致性：不保证。
- 安全(security)
- 孤岛(isolated)

> 难度体现（与单机相比）
- 多机子的并行（并行编程上的难度）（concurrency）
- 很多实例且网络的复杂（问题难以定位）(partial failure)


> 关注的基础设施（infrastructure）
- 存储（storage）
  - 可复制、容错、高性能的分布式存储
- 通信（communication）
  - 使用已有的通信方式，如RPC。（不过多关注如何可靠传输，应用已有的工具）
- 计算（computation）
  - 计算系统，如MapReduce

## mapreduce
- MapReduce意义：框架。使分布式计算变简单，专注业务，而不需要关注分布式中的infra。
  - job：整个计算
  - task：每个Mapreduce调用
- 通常一个MapReduce job的输出为另一个 MapReduce job 的 输入是很常见的。
- 多机子之间数据的网络传输是MapReduce的一个很大瓶颈，优化：
  - map中的读取数据局部性：找到要处理文件所在的服务器，将map分配给该服务器，这样就算本地读取，避免使用网络。
- shuffle（洗牌）：该操作在MapReduce有很大性能消耗。（map output 的是不同key的一行，而 reduce 需要是相同key的一列）

# RPC & Thread
