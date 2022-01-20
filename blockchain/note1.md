- [概述](#概述)
- [BTC 密码学基础](#btc-密码学基础)
  - [hash](#hash)
  - [签名](#签名)
- [BTC数据结构](#btc数据结构)
  - [hash pointer](#hash-pointer)
  - [Merkle tree](#merkle-tree)
    - [Merkle tree 作用：提供 Merkle proof](#merkle-tree-作用提供-merkle-proof)
- [BTC 协议](#btc-协议)
# 概述
- 下一代的价值互联网
- 世界上最慢的数据库
- 不要被bitcoin 限制了blockchain的想象力

> 比特币的价格走势（20220120）
<div style="zoom:80%" align="center"><img src="./pic/1-1.png"></div>


> 加密货币市场份额占比（20220120）
- https://coinmarketcap.com/charts/
<div style="zoom:80%" align="center"><img src="./pic/1-5.png"></div>

> 课程参考和大纲
<div style="zoom:40%" align="center"><img src="./pic/1-2.png"></div>
<div style="zoom:40%" align="center"><img src="./pic/1-3.png"></div>
<div style="zoom:40%" align="center"><img src="./pic/1-4.png"></div>


- 以太坊变化很快，文档有时候都和其目前实现不对应，最好的了解方式是看源码
# BTC 密码学基础
- ctypto-currency：加密货币其实内容并不加密，相反却是公开的。涉及到的密码学知识主要有两个：
  - hash
  - 前面

## hash
- 利用到了 hash 的三个特性：
  1. collision resistance：抗碰撞，很难构造一对碰撞的hash
     - 其实该性质不能够被证明，只能通过实践经验
  2. hiding：单向，不泄露输入的任何信息。
     - 条件：输入空间够大，且分布均匀。（不然很容易穷举，生成字典）。
     - H(msg || nonce) 可以保证输入空间够大。
  3. puzzle friendly：计算满足某条件的hash，只能穷举。
     - 0000xxxxx
     - 挖矿: `H(block_header || nonce) ≤ target`，算出满足条件的 nonce。difficult to solve, but easy to verify

- bitcoin 使用 sha256


## 签名
- bitcoin 的开户方式（去中心化），自己创建一对公私钥对就行。
- 性质：产生同一公私钥对的概率很小，可以忽略
  - 前提：a good source of randonness
- 注意：生成公钥和签名期间要有好的随机源，否则容易泄露私钥。


# BTC数据结构
- hash pointer 和 Merkle tree
## hash pointer
- hash pointer: 除了存对象的地址，还有存一个hash值，用来防篡改
  - 任何无环结构都可以使用hash pointer 代替 pointer。有环会出现相互依赖。
- 区块链：比特币中最基本的数据结构。由一个个区块组成的链表，用 hash pointer 代替普通指针。

<div style="zoom:40%; background-color: #ffffff;" align="center "><img src="./pic/1-6.png"></div>

- 用户可以进保存一部分，用到了再从其他节点找
- 恶意节点无法修改某个块，牵一发动全身。可以用最后一个块的hash，检验整个区块链

> 问题：
- 验证很早之前的block，那岂不是整个验证的链很长。
- 用户可以只存储一部分链，那么如何保证这整个部分链不是伪造的。
- 有没有可能某个人伪造了所有的block。
## Merkle tree
- Merkle tree 与 Binary tree 最主要的区别：使用了 hash pointer 代替普通的 pointer
- BTC中，每个区块组织成区块链，每个区块中的交易组织成 Merkle tree。
  - Merkle tree 中的每个 data block 为一个 交易。
- 每个区块分为两部分：
  - Block Header：包含 root hash，但没有区块中具体的交易信息。
  - Block body

- light node(轻节点) & full node(全节点)
  - light node：只保存 block header。比如手机上的BTC钱包
  - full node：整个merkle树都保存。

### Merkle tree 作用：提供 Merkle proof
> proof of membership/inclusion
- 目的：向 轻节点 证明**存在**某个交易（比如证明对方已经转账）
- 过程
  - 全节点 向 轻节点 提供红色部分的hash值
  - 轻节点 自己计算绿色部分的hash值
  - 自底向上计算，最后和 root hash 比对，即可证明
- 时间复杂度：o(log(n))
<div style="zoom:40%; background-color: #ffffff;" align="center "><img src="./pic/1-7.png"></div>

- light node 只能验证交易所在的分支，其他的hash值无法验证（包括 full node 所提供的），表面上似乎给篡改数据提供自由度
- 如果全节点是恶意的，其无法修改黄色的tx同时构造其相邻tx的hash，使得最终计算得到的结果和root hash 比对可以通过。
  - 原因：collision resistance

> proof of non-membership
- 目的：向 轻节点 证明**不存在**某个交易（比如证明对方已经转账）
- 最简单的方法，full node 发送整个 mercle tree 给 light node，然后分别去验证整个树的正确性
  - 复杂的：o(n)

- 高效方法：对mercle tree叶子节点进行hash值**从小到大排序**。
  - light node 先对要查询的 tx 生成一个hash，发送给 full node
  - full node 发送如下黄色部分内容，light 只需对其进行验证，即可证明如下两个交易是相邻的。如果这两个交易都不是所检索的，则证明该交易不存在。


<div style="zoom:40%; " align="center "><img src="./pic/1-8.png"></div>

# BTC 协议