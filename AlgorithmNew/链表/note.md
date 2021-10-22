# 链表反转
- 参考：https://labuladong.gitbook.io/algo/mu-lu-ye-1/mu-lu-ye/di-gui-fan-zhuan-lian-biao-de-yi-bu-fen
- 难度逐渐加大，其实在上一层做修改即可
  - 反转整个链表
  - 反转链表的前n个节点
  - 反转链表的一部分

## 关于递归的一些诀窍
- 对于递归算法，最重要的就是**明确递归函数的定义**
  - 不要跳进递归（你的脑袋能压几个栈呀？）

- **4要素：输入，返回，做什么，basecase**

## 反转整个链表
- 递归函数的定义：**输入**一个节点 head，将「以 head 为起点」的链表反转，并**返回**反转之后的头结点。
- base case：`if (head.next == null) return head;`
```cpp
ListNode reverse(ListNode head) {
    if (head.next == null) return head;
    ListNode last = reverse(head.next);
    head.next.next = head;
    head.next = null;
    return last;
}
```

## 反转链表前 N 个节点
- 递归函数定义：**输入**一个节点head和整数n，反转以 head 为起点的 n 个节点，**返回**新的头结点
- base case：`n == 1`
```cpp
ListNode successor = null; // 后驱节点

// 反转以 head 为起点的 n 个节点，返回新的头结点
ListNode reverseN(ListNode head, int n) {
    if (n == 1) { 
        // 记录第 n + 1 个节点
        successor = head.next;
        return head;
    }
    // 以 head.next 为起点，需要反转前 n - 1 个节点
    ListNode last = reverseN(head.next, n - 1);

    head.next.next = head;
    // 让反转之后的 head 节点和后面的节点连起来
    head.next = successor;
    return last;
}
```


## 反转链表的一部分
- 思路：转变为**反转链表前 N 个节点**

- 递归函数定义：**输入**一个节点head和整数m、n，反转以 head 为起点的第m个到第 n 个节点，**返回**新的头结点
```cpp
ListNode reverseBetween(ListNode head, int m, int n) {
    // base case
    if (m == 1) {
        return reverseN(head, n);
    }
    // 前进到反转的起点触发 base case
    head.next = reverseBetween(head.next, m - 1, n - 1);
    return head;
}
```

> 转化为反转前n个的思想
```
如果 m != 1 怎么办？如果我们把 head 的索引视为 1，那么我们是想从第 m 个元素开始反转对吧；如果把 head.next 的索引视为 1 呢？那么相对于 head.next，反转的区间应该是从第 m - 1 个元素开始的；那么对于 head.next.next 呢……
```

### 25.K个一组翻转链表
- 重点：
  - 别让特殊情况出现，增加自己的负担
```cpp
class Solution {
public:
    ListNode* reverseKGroup(ListNode* head, int k) {
        auto size = getSize(head);
        int i = 0;
        while(size >= k){// 重点：不让特殊情况出现
            head = reverseBetween(head, i*k, (i+1)*k);
            ++i;
            size -= k;
        }

        return head;
    }

    ListNode* reverseBetween(ListNode*head, int lo, int hi){
        if(lo == 0){
            return reverserPre(head, hi);
        }
        head->next = reverseBetween(head->next, lo-1, hi-1);
        return head;
    }
    ListNode* successor = nullptr;
    ListNode* reverserPre(ListNode* head, int n){
        // base case
        if( n == 1 ){
            successor = head->next;
            return head;
        }
        ListNode* last = reverserPre(head->next, n-1);
        head->next->next = head;
        head->next = successor;
        return last;
    }

    int getSize(ListNode* head){
        int rtn = 0;
        while(head != nullptr){
            ++rtn;
            head = head->next;
        }
        return rtn;
    }

};
```

# 回文链表
- 参考：https://labuladong.gitbook.io/algo/mu-lu-ye-1/mu-lu-ye/pan-duan-hui-wen-lian-biao
## 字符串判断回文
- **双指针技巧**
  - 不需要考虑奇偶问题

```cpp
bool isPalindrome(string s) {
    int left = 0, right = s.length - 1;
    while (left < right) {
        if (s[left] != s[right])
            return false;
        left++; right--;
    }
    return true;
}
```

## 解法
- **链表其实也可以有前序遍历和后序遍历**
  - 意义：如果我想正序打印链表中的val值，可以在前序遍历位置写代码；反之，如果想倒序遍历链表，就可以在后序遍历位置操作
```cpp
void traverse(ListNode head) {
    // 前序遍历代码
    traverse(head.next);
    // 后序遍历代码
}
```

### 模仿双指针
- **实际上就是把链表节点放入一个栈**，然后再拿出来，这时候元素顺序就是反的，只不过我们利用的是递归函数的堆栈而已
```cpp
// 左侧指针
ListNode left;

boolean isPalindrome(ListNode head) {
    left = head;
    return traverse(head);
}

boolean traverse(ListNode right) {
    if (right == null) return true;
    boolean res = traverse(right.next);
    // 后序遍历代码
    res = res && (right.val == left.val);
    left = left.next;
    return res;
}
```