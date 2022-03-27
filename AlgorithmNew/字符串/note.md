# 手算乘法
- https://labuladong.gitbook.io/algo/mu-lu-ye-4/zi-fu-chuan-cheng-fa

- 思路：将小学乘法流程机械化

<div align="center" style="zoom:60%"><img src="./pic/3.png"></div>

- 上面的手算方式还是太高级了，处理起来很复杂。比如要考虑的有：乘法进位、加法进位、错位相加等等。可以实现但是太复杂。现在要将其简单化

<div align="center" style="zoom:30%"><img src="./pic/4.gif"></div>

- 过程：有两个指针 i，j 在 num1 和 num2 上游走，计算乘积，同时将乘积叠加到 res 的正确位置
- **num1[i] 和 num2[j] 的乘积对应的就是 res[i+j] 和 res[i+j+1] 这两个位置**。

```cpp
class Solution {
public:
    string multiply(string num1, string num2) {
        if(num1 =="0" || num2 == "0") return "0";
        vector<int> res(num1.size()+num2.size(), 0);
        for(int i = num1.size()-1; i >= 0; --i){
            for(int j = num2.size()-1; j >= 0; --j){
                int mul = (num1[i]-'0') * (num2[j]-'0');
                int p1 = i + j;
                int p2 = p1 + 1;
                int sum = res[p2] + mul;
                res[p2] = sum%10;
                res[p1] += sum/10;  // 处理进位
                // 注：这里不用计算p1的进位，最后面的操作中会自动被处理。这个算法的特点、
                // 因为最后一个乘出来相加res[p1]肯定不用进位
            }
        }
        int pos = 0;
        // 找到第一个不为0的
        while(res[pos] == 0){
            ++pos;
        }

        // vector<int> 转字符串
        string rtn;
        while(pos < res.size()){
            rtn += res[pos++]+'0';
        }
        return rtn;
    }
};
```

# 回文字符串
- 中心扩散法
  - 由中心扩向四周

- **寻找回文串是从中间向两端扩展，判断回文串是从两端向中间收缩**

<div align="center" style="zoom:80%">
<img src="pic/2.png">
</div>

1. 如果传入重合的索引编码，进行中心扩散，此时得到的回文子串的长度是奇数；

2. 如果传入相邻的索引编码，进行中心扩散，此时得到的回文子串的长度是偶数。

```
执行用时：
228 ms, 在所有 C++ 提交中击败了53.22%的用户
内存消耗：
241.5 MB, 在所有 C++ 提交中击败了5.19%的用户
```



```cpp
class Solution {
public:
    string check(string s,int left, int right){
        while(left >= 0 && right < s.length()){
            if(s[left] != s[right]){
                break;
            }
            else{
                --left;
                ++right;
            }
        }

        return left + 1 == right?"":s.substr(left+1,right-left-1);
    }

    string longestPalindrome(string s) {
        if(s.length() < 2)return s;
        string res;
        string tmp;
        // 最后一个字符可以不遍历
        for(int i = 0;i < s.length()-1;i++){
            tmp = check(s,i,i);
            if(tmp.length() > res.length()) res = tmp;
            tmp = check(s,i,i+1);
            if(tmp.length() > res.length()) res = tmp;
        }
        return res;
    }
};
```

# 括号问题
- 一个「合法」括号组合的左括号数量一定等于右括号数量
- 对于一个「合法」的括号字符串组合 p，必然对于任何 `0 <= i < len(p)` 都有：子串 `p[0..i]` 中左括号的数量都大于或等于右括号的数量
- 都是通过上面两个性质变来变去。


## 生成有效的括号组合:leetcode22
- 题目如下
```
数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。

示例 1：
输入：n = 3
输出：["((()))","(()())","(())()","()(())","()()()"]

示例 2：
输入：n = 1
输出：["()"]


```

- 有关括号问题，你只要记住以下性质，思路就很容易想出来：
  - **一个「合法」括号组合的左括号数量一定等于右括号数量，这个很好理解**。
  - 对于一个「合法」的括号字符串组合 p，必然对于任何 `0 <= i < len(p)` 都有：子串 `p[0..i]` 中左括号的数量都大于或等于右括号的数量


- 算法输入一个整数 n，让你计算 n 对儿括号能组成几种合法的括号组合，可以改写成如下问题：
  - **现在有 2n 个位置，每个位置可以放置字符 `(` 或者 `)`，组成的所有括号组合中，有多少个是合法的？**


```cpp
class Solution {
public:
    void generator(string ins,int lnum, int rnum){
        if(rnum == 0 && lnum == rnum ){
            res.push_back(ins);
            return;
        }
        if(lnum > 0)
            generator(ins+'(', lnum-1, rnum);
        if(rnum > lnum)
            generator(ins+')', lnum, rnum-1);
    }
    vector<string> generateParenthesis(int n) {
        generator("", n, n);
        return res;
    }
private:
    vector<string> res;

};
```


## 判断合法括号串（leetcode20）
- 该题目不能通过`(`数量和`)`数量来判断，因为有多种括号。而且`"([)]"`是不合法的
  - 思路1：通过一个左括号栈解决(需要较多额外的空间)
  - 思路2：用三个变量表示当前未被抵消的左括号。如果该变量<0，立即返回false
> 题目
```
给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

有效字符串需满足：

左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。

示例 1：
输入：s = "()"
输出：true

示例 2：
输入：s = "()[]{}"
输出：true

示例 3：
输入：s = "(]"
输出：false

示例 4：
输入：s = "([)]"
输出：false
```

## 平衡括号(leetcode921)
- 性质：左边的括号数量大于等于右边
- 思路：从左到右遍历
  - 如果遍历中遇到没有被匹配到的`)`，则一定补一个`(`。
  - 到了最后再进行结算有多少`(`没被匹配。
- 通过维护对右括号的需求数 need，来计算最小的插入次数
<div align="center" style="zoom:60%"><img src="./pic/5.png"></div>

- 注意`)))(((`的情况
```cpp
class Solution {
public:
int minAddToMakeValid(string s) {
    int need=0; // 需要的右括号数
    int res = 0;
    for(int i = 0; i <s.size();++i){
        if(s[i] == '('){
            ++need;
        }else if(s[i] == ')'){
            --need;
            if(need == -1){
                ++res;
                need = 0;   // 补了一个左括号
            }
        }
    }
    if(need > 0)
        res += need;
    return res;
}
};
```


## 平衡括号2（leetcode1541）
- 通过一个 need 变量记录对右括号的需求数，根据 need 的变化来判断是否需要插入
- 当 need == -1 时，意味着我们遇到一个多余的右括号，显然需要插入一个左括号。
- 当遇到左括号时，若对右括号的需求量为奇数，需要插入 1 个右括号。
- 注意题目需要连续的右括号匹配一个左括号

<div align="center" style="zoom:60%"><img src="./pic/6.png"></div>

> 代码

```cpp
class Solution {
public:
    int minInsertions(string s) {
        int need = 0;
        int res = 0;
        for(int i = 0; i < s.size(); ++i){
            if(s[i] == '('){
                if(need % 2 == 1){
                    ++res;
                    --need;
                }
                need+=2;
            }
            else if(s[i] == ')'){
                --need;
                if(need == -1){
                    ++res;
                    need = 1;
                }
            }
        }
        res += need;
        return res;
    }
};
```

## 32. 最长有效括号
> 题目
<div align="center" style="zoom:80%"><img src="./pic/32-1.png"></div>

> 思路：
  - 最长，想到
    - 动态规划
    - 滑动窗口
  - 括号，想到
    - 括号的性质
  

> 代码

```cpp
class Solution {
public:
    int longestValidParentheses(string s) {
        int slow, fast;
        slow = 0;
        fast = 0;

        int valid = 0;
        int res = 0;
        while(fast < s.size()){
            if(s[fast++] == '(')
                valid++;
            else
                valid--;
            if(valid < 0){
                slow = fast;
                valid = 0;
            } else if(valid == 0){
                res = max(res,fast-slow);
            }
        }

        // 处理类似这种情况，valid>0,但是fast已经到最后了。情况：(()。反过来再算一遍，就好。
        slow = s.size()-1;
        fast = s.size()-1;
        valid = 0;
        while(fast >= 0){
            if(s[fast--] == ')')
                valid++;
            else
                valid--;
            if(valid < 0){
                slow = fast;
                valid = 0;
            } else if(valid == 0){
                res = max(res,slow-fast);
            }
        }

        return res;
    }
};
```

## 179.最大数
<div align="center" style="zoom:80%"><img src="./pic/179-1.png"></div>

- 特殊情况注意：
  - `[0,0]`
  - `[369,369368]`
- 思路
  - 不能单纯的比较字符串。应该比较等长度的，如果相等，再用长度长的剩余的部分去比较
```cpp
struct cmp{
    bool operator()(const string& s1, const string &s2){
        if (s1.size() == s2.size()){
            return s1 < s2;
        }else if(s1.size() < s2.size()){
            auto ts2 = s2.substr(0,s1.size());
            if(s1 == ts2){
                // 拿剩下的和s1继续和s2比
                return operator()(s1 , s2.substr(s1.size(), s2.size()-s1.size()+1)) ;
            }else{
                return s1 < s2;
            }
        }else{
            auto ts1 = s1.substr(0, s2.size());
            if(ts1 == s2){
                // 拿剩下的和s2继续和s1比
                return  operator()(s1.substr(s2.size(),s1.size()-s2.size()+1) , s2 );
            }else{
                return s1 < s2;
            }
        }
    }
};

class Solution {
public:
    string largestNumber(vector<int>& nums) {
        vector<string> numstr;
        string res;
        for_each(nums.begin(), nums.end(), [&numstr](const int n){ numstr.push_back(to_string(n));});
        sort(numstr.rbegin(), numstr.rend(), cmp());

        for_each(numstr.begin(), numstr.end(), [&res](const string &s){ res += s;});

        // 补丁：[0,0]情况
        int pos = 0;
        while(pos < res.size()-1 && res[pos] == '0'){
            ++pos;
        }
        return res.substr(pos);

    }
};
```
