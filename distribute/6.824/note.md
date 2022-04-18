- 实验
  - MapReduce
  - Raft for fault tolerate
  - K/V server(分布式)
  - Sharded K/V server (多分区 Multi group raft)
- piazza论坛
  - 可以找问题
- 课程：https://pdos.csail.mit.edu/6.824/index.html
- 课程安排和资料：https://pdos.csail.mit.edu/6.824/schedule.html

# 1. 概述

- Infrastructure
  - Storage 
    - raft
  - Communication
    - 在本节课更多是作为工具
  - Computation
    - Mapreduce
- 本质：分布式只是顶不住后的妥协。**能单机就单机**，简单。主要目的和待解决问题都是：
  - 容错
  - 性能
- **Abstraction**：对于分布式存储和计算，**应该设计接口，从而隐藏分布式特性**，不被用户感知（Abstraction）
  - Implhttps://pdos.csail.mit.edu/6.824/index.html
    - RPC：隐藏不可靠的网络通信实时
    - threads：可以轻松驾驭多个核心

## 1.1 讨论的问题
- 性能（Performance）
  - **如何使用和组织**多个机子，使得性能提升？
- 容错(Fault Tolerance)
  - 单机的时候，可能发生的概率很小。但是当涉及分布式时，发生的概率就会变大（比如1000台机子，有一台出故障的可能性恒大），那么如何去解决某个机子故障的问题？
    - **各种可能极少见的问题，会变得常见**
  - 可用性（Availability）：在某些情况下，系统还是可以给你提供完整的服务
  - 可恢复性（Recoverability）： 出现了问题，可以恢复到可用状态。（redo log，借助非易失性存储non-volatile storage ）
    - **重要的解决方法就是借助 non-volatile storage**（HDD、flash、SSD...）
    - 但是非易失性存储的代价太高（太慢），所以更好的方式是避免写入非易失性存储
    - **另一个重要的容错工具：复制(replication)，比如Raft**（通过管理复制实现容错，而不是落盘）
      - 引出另一个问题：一致性
- **一致性（consistency）**
  - **Strong consistency**：实现昂贵
  - **Weak consistency**：最终一致性，到底什么时候一致，无法保证
  - 注：
    - 多副本之间一般存放不同地理位置，而不是在同个机房或城市（为了更高的可用性），因此在此之间实现 Strong consistency 非常耗时


# 2. MapReduce
- 背景：要再TB级数据上进行大量计算，分布式专家写了MapReduce方式的专用程序来处理特定的场景。
  - Idea：**如何可以让每个工程师都可以通过某个框架来使得使用巨型分布式计算变得很简单**？
  - 体现 **Abstraction**

- 内容详细见：MapReduce论文阅读笔记



# 3. RPC 和 Thread

- 后面的lab都是用的go
- 使用goroutine理由
  - IO Concurrency： 用来同时处理多个IO，概念实际是在单线程场景下所提出
    - 另一种实现IO Concurrency的方式：事件驱动，如epool，但是多线程实现起来要简单点
  - Parallelism：CPU密集型任务
  - Convenience：比如处理周期性执行的任务（避免给主线程带来复杂性）

- Thread challenage
  - race
  - 死锁
    - 形成环而导致死锁的解决方法通常将锁从函数里面提取到外面
  - coordination：如何协作
    - condiction variable：sync.Cond
    - channel
    - waitGroup
- Go 教程：一个爬虫代码案例，三个版本
  - 没有并发的版本
  - 使用共享数据和mutex
  - 使用channel（Go 并发的本意，不使用共享内存）
- `go run -race`可以检查race
  - **不是一个静态的分析**，而是动态的分析，所以没有运行到race发生的地方2是无法检查出来的

- RPC：提问过多，没讲



# 4. GFS







































