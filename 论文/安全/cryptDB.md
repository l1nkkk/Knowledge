
- 只要用户不登录，在所有服务器被攻破的时候，数据也不会泄露，这样的功能是怎么实现的呢？
  - 猜测：不可能密钥直接放在代理端，而是通过某种机制，每次登陆后，密钥会变

- 疑问：AES与AES-CBC与AES-CTR

# 查询
- 针对的 威胁模型1：DBMS服务器是不可信的，应用程序和代理是可信的。
- 密态操作对应用程序透明
- 加密查和原始查相同，除了组成查询的操作符是在密文上进行的。

- 代理端：存储主密钥 MK、数据库schema（the database schema）、所有列的当前加密层
- DBMS服务端：匿名的schema（表名和列名被替换）、cryptDB特定的用户定义函数（UDF，可以为某些操作使用密文进行计算）

- 查询4个步骤
  - 应用程序发出请求后，proxy 拦截，匿名化表名和列名、使用 MK 选择最适合所需操作的加密方案 加密每个常量。
  - proxy 检查DBMS 是否需要被赋予keys 来调整加密层，如果需要，则在 DBMS 上发出一个 UPDATE 查询，调用UDF来调整适当列的加密层。
  - proxy 将加密查询转发到DBMS服务器，DBMS使用标准SQL执行查询。（可能需要调用到 UDF的聚合和关键字检索）。
  - DBMS 返回结果，代理将其解密返回给应用程序。

## 加密相关
### Random（RND） 
- 介绍：RND在CryptDB中提供了最大的安全性：在自适应选择明文攻击(IND-CPA)下的不可区分性。
  - 两个相等的值以压倒性的概率映射到不同的密文
  - RND不允许在密文上有效地执行任何计算
- 使用的算法：**AES-CBC**,64bit。
  - 64bit原因：AES的128位块大小会导致密文明显变长
  - 在这个威胁模型中，CryptDB假设服务器不会改变结果，所以CryptDB不需要更强的 IND-CCA2 构造(在选择密文攻击下是安全的)。但是如果需要，RND可以使用UFE模式的块密码。
- 疑问：有点奇怪，下面为啥不能CBC，而上面的RND下，却可以CBC。

### Derterministic（DET）
- 介绍：仍然提供强大安全性，只泄漏相同数据值对应的密文。
- 功能：这个加密层允许服务器执行：相等谓词、相等连接、GROUP BY、COUNT、DISTINCT等操作
- 在密码学中，DET 对应的是 PRP，比如AES，Blowfish。
- 使用的算法：不能使用 AES-CBC 模式，因为其会泄露 前缀相等性，为了避免这个问题，使用**CMC模式**（IV=0，可以近似想象成先进行一次CBC，再块反向进行一次CBC）


### Order-preserving encryption (OPE)
- 介绍：OPE允许根据数据项的加密值建立数据项之间的顺序关系，而不会显示数据本身。一种比DET更弱的加密方案。OPE具有可证明的安全保证：加密相当于保持顺序的随机映射
  - 对于任意密钥k，如果x < y，则OPEK(x) < OPEK(y)。因此，如果一个列是用OPEK加密的，那么服务器可以对范围[c1, c2]对应的加密常量OPEK(c1)和OPEK(c2)进行范围查询。
- 功能：可以执行ORDER BY、MIN、MAX、SORT等操作。

- 使用的算法：
  - A. Boldyreva, N. Chenette, Y. Lee, and A. O’Neill. Orderpreserving symmetric encryption. In Proceedings of the 28th Annual International Conference on the Theory and Applications of Cryptographic Techniques (EUROCRYPT), Cologne, Germany, April 2009
  - 利用**AVL二叉搜索树**对算法进行了改进，实现了批量加密

### Homomorphic encryption（HOM）
- 介绍：HOM是一种安全的概率加密方案(IND-CPA secure)，允许服务器对加密的数据进行计算，最终结果在代理上解密
  - 全同态加密很慢，但是特定操作的同态加密是高效的。
- 使用的算法：**Paillier**
  - 将两个值的加密值相乘会得到值和的加密，即HOMK(x)·HOMK(y) = HOMK(x + y)，其中乘法是对某个公钥值取模执行的
- 功能：（通过UDF进行HOM计算）
  - sum聚合
  - 平均数（通过返回 总和以及计数）
  - 递增的值
- 注：
  - 对于所使用的HOM方案，密文是 2048 bit的，这回导致很大的膨胀
  - 可以通过一种优化（ scheme of Ge and Zdonik），让膨胀优化到2x，但是cryptDB没有优化，因为会导致复杂性

### Join (JOIN and OPE-JOIN)
- 介绍：用来支持允许两列之间的等值连接。
  - 因为cryptdb 使用不同DET密钥，来防止跨列相关性
- JOIN 支持 DET的所有操作，允许确定两列之间的重复值
- 功能：
  - OPE-JOIN支持按顺序关系进行连接

### Word search (SEARCH)
- SEARCH用于对加密文本执行搜索，以支持诸如MySQL的LIKE操作符之类的操作
