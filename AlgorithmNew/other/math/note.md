- [常用的位操作](#常用的位操作)
  - [字母转小写](#字母转小写)
  - [字母转大写](#字母转大写)
  - [字母大小写互换](#字母大小写互换)
  - [判断两个数是否异号](#判断两个数是否异号)
  - [交换两个数](#交换两个数)
  - [*消除数字 n 的二进制表示中的最后一个 1](#消除数字-n-的二进制表示中的最后一个-1)
    - [判断一个数是不是 2 的指数](#判断一个数是不是-2-的指数)
    - [判断二进制有多少个1](#判断二进制有多少个1)
    - [查找只出现一次的元素](#查找只出现一次的元素)
  - [异或运算满足交换律和结合律](#异或运算满足交换律和结合律)
- [阶乘性质](#阶乘性质)
  - [升级版](#升级版)
- [素数](#素数)
  - [判断一个数是不是素数](#判断一个数是不是素数)
  - [计算一个范围内的素数 数量](#计算一个范围内的素数-数量)
- [模幂](#模幂)
  - [快速幂](#快速幂)
- [无限序列中随机抽取元素(水塘抽样算法)](#无限序列中随机抽取元素水塘抽样算法)
# 常用的位操作
- https://labuladong.gitbook.io/algo/mu-lu-ye-3/mu-lu-ye-2/chang-yong-de-wei-cao-zuo

## 字母转小写
```cpp
('a' | ' ') = 'a'
('A' | ' ') = 'a'
```
## 字母转大写
```cpp
('b' & '_') = 'B'
('B' & '_') = 'B'
```
## 字母大小写互换
```cpp
('d' ^ ' ') = 'D'
('D' ^ ' ') = 'd'
```

## 判断两个数是否异号
```cpp
int x = -1, y = 2;
bool f = ((x ^ y) < 0); // true

int x = 3, y = 2;
bool f = ((x ^ y) < 0); // false
```

## 交换两个数
```
int a = 1, b = 2;
a ^= b;
b ^= a;
a ^= b;
```

## *消除数字 n 的二进制表示中的最后一个 1
- `n&(n-1)`

<div align="center" style="zoom:80%"><img src="./pic/1.png"></div>

### 判断一个数是不是 2 的指数
```cpp
bool isPowerOfTwo(int n) {
    if (n <= 0) return false;
    return (n & (n - 1)) == 0;
}
```

### 判断二进制有多少个1

```cpp
int hammingWeight(uint32_t n) {
    int res = 0;
    while (n != 0) {
        n = n & (n - 1);
        res++;
    }
    return res;
}
```

### 查找只出现一次的元素
- 前提：其他都出现两次
  - 全部进行异或
```cpp
int singleNumber(vector<int>& nums) {
    int res = 0;
    for (int n : nums) {
        res ^= n;
    }
    return res;
}
```
## 异或运算满足交换律和结合律
- 如：`2 ^ 3 ^ 2 = 3 ^ (2 ^ 2) = 3 ^ 0 = 3`
# 阶乘性质
- 问题转换1：问**题转化为：n! 最多可以分解出多少个因子 2 和 5？**
  - 因为：两个数相乘结果末尾有 0，一定是因为两个数中有因子 2 和 5，因为 10 = 2 x 5。
- 问题转换2：**n! 最多可以分解出多少个因子 5？**
  - 因为：每个偶数都能分解出因子 2，因子 2 肯定比因子 5 多得多
- 分析：只要是5的倍数可以分解出一个，25 ... 两个，125... 三个.......
- 问题等价于：有多少能被5、25、125整除的，累加起来就是答案。代码如下

```cpp
class Solution {
public:
    int trailingZeroes(int n) {
        int base = 5;
        int res = 0;
        while(n / base){
            res += n / base;
            base *= 5;
        }
        return res;
    }
};
```

## 升级版
- https://labuladong.gitbook.io/algo/mu-lu-ye-3/mu-lu-ye-2/jie-cheng-ti-mu
- 出现0性质+二分法
  - 因为递增，所以可以用二分法解

```cpp
class Solution {
public:
    const long long MAXN = 2ll* INT32_MAX;
    int preimageSizeFZF(int k) {
        return rightFind(k) - leftFind(k) + 1;
    }
    int leftFind(int k){
        long long lo = 0;
        long long hi = MAXN;
        long long mid;
        while (lo < hi){
            mid = (hi + lo)/2;
            auto midK = trailingZeroes(mid);
            if(midK < k){
                lo = mid+1;
            } else if(midK > k){
                hi = mid;
            } else if( midK == k){
                hi = mid;
            }
        }
        return lo;
    }

    int rightFind(int k){
        long long lo = 0;
        long long hi = MAXN;
        long long mid;
        while (lo < hi){
            mid = (hi + lo)/2;
            auto midK = trailingZeroes(mid);
            if(midK < k){
                lo = mid+1;
            } else if(midK > k){
                hi = mid;
            } else if( midK == k){
                lo = mid + 1;
            }
        }
        return lo-1;
    }

    long long trailingZeroes(long long  n) {
        long long base = 5;
        long long res = 0;
        while(n / base){
            res += n / base;
            base *= 5;
        }
        return res;
    }
};
```

# 素数
## 判断一个数是不是素数
- O(sqrt(N))
```cpp
boo isPrime(int n) {
    // 注意这里的i*i
    for (int i = 2; i*i < n; i++)
        if (n % i == 0)
            // 有其他整除因子
            return false;
    return true;
}
```

## 计算一个范围内的素数 数量
- 利用质因子性质
```
首先从 2 开始，我们知道 2 是一个素数，那么 2 × 2 = 4, 3 × 2 = 6, 4 × 2 = 8... 都不可能是素数了。
然后我们发现 3 也是素数，那么 3 × 2 = 6, 3 × 3 = 9, 3 × 4 = 12... 也都不可能是素数了。
```

```cpp

class Solution {
public:
    int countPrimes(int n) {
        vector<bool> isPrime(n+1,true);
        // 最大数n的分解，最多也只需要看到sqrt(n)，所以遍历到sqrt(n)，就全部被填充排除了
        for(int i  = 2; i*i < n; ++i){
            if(isPrime[i])
                // 如果是素数，则扩散排除
                for(int j = i*2; j < n; j+=i){
                    isPrime[j] = false;
                }
        }

        
        int res = 0;
        for(int i = 2; i < n; ++i){
            if(isPrime[i])
                ++res;
        }
        return res;
    }

};
```

# 模幂
- `(a * b) % k = (a % k)(b % k) % k`
  - 对乘法的结果求模，等价于先对每个因子都求模，然后对因子相乘的结果再求模。

## 快速幂
```cpp
int fastPower(int a, int b, int mod =1337){
    int base = a%mod;
    int res = 1;
    while(b > 0){
        if(b & 1){
            res = (res * base)%mod;
        }
        base = (base * base)%mod;
        b >>= 1;
    }
    return res;
}
```

```
执行用时：8 ms, 在所有 C++ 提交中击败了93.01%的用户
内存消耗：11.3 MB, 在所有 C++ 提交中击败了92.11%的用户
```
# 无限序列中随机抽取元素(水塘抽样算法)
- 只抽取一个元素的问题
  - 结论：当你遇到第 i 个元素时，应该有 1/i 的概率选择该元素，1 - 1/i 的概率保持原有的选择。
- 抽取k个元素的问题
  - - 结论：当你遇到第 i 个元素时，应该有 k/i 的概率选择该元素，1 - k/i 的概率保持原有的选择。


<div align="center" style="zoom:80%"><img src="./pic/2.png"></div>


<div align="center" style="zoom:80%"><img src="./pic/3.png"></div>

> 只取一个

```cpp

class Solution {
public:
    ListNode *head;
    Solution(ListNode* head) {
        this->head = head;
    }

    int getRandom() {
        ListNode *t = head;
        int res;
        int i = 1;
        while (t!= nullptr){
            // 注：表示1/i的概率，1/i的概率会选中当前的值
            if(rand()%i == 0){
                res = t->val;
            }
            t = t->next;
            ++i;
        }
        return res;
    }
};
```

> 取K个

```cpp
/* 返回链表中 k 个随机节点的值 */
int[] getRandom(ListNode head, int k) {
    Random r = new Random();
    int[] res = new int[k];
    ListNode p = head;

    // 前 k 个元素先默认选上
    for (int j = 0; j < k && p != null; j++) {
        res[j] = p.val;
        p = p.next;
    }

    int i = k;
    // while 循环遍历链表
    while (p != null) {
        // 生成一个 [0, i) 之间的整数
        int j = r.nextInt(++i);
        // 这个整数小于 k 的概率就是 k/i
        if (j < k) {
            res[j] = p.val;
        }
        p = p.next;
    }
    return res;
}
```