- [双指针技巧总结](#双指针技巧总结)
  - [快慢指针](#快慢指针)
    - [环型链表：只判断不记录](#环型链表只判断不记录)
    - [环型链表：记录起点](#环型链表记录起点)
    - [原地修改数组](#原地修改数组)
      - [删除有序数组中重复的](#删除有序数组中重复的)
  - [左右指针](#左右指针)
    - [二分查找](#二分查找)
    - [两数之和](#两数之和)
  - [滑动窗口](#滑动窗口)
- [哈希表](#哈希表)
  - [twosum问题](#twosum问题)
- [单调栈](#单调栈)
  - [Leetcode96：「下一个更大元素 I」](#leetcode96下一个更大元素-i)
- [常数时间下 删除/等概论查找/添加](#常数时间下-删除等概论查找添加)
- [单调队列](#单调队列)
# 双指针技巧总结
- https://labuladong.gitbook.io/algo/mu-lu-ye-1/mu-lu-ye-3/shuang-zhi-zhen-ji-qiao
## 快慢指针
- 主要解决链表中的问题，比如典型的判定链表中是否包含环。或者判断回文链表
  - leetcode141
  - leetcode234
- 除此之外还用在**原地修改数组**上
  - leetcode26.删除有序数组中的重复项
  - 参考：https://labuladong.gitbook.io/algo/mu-lu-ye-1/mu-lu-ye-3/yuan-di-xiu-gai-shu-zu

- 快慢指针一般都初始化指向链表的头结点 head，前进时快指针 fast 在前，慢指针 slow 在后，巧妙解决一些链表中的问题。
- 一般：快指针的速度为慢指针两倍
  - 列外:删除链表的倒数第n个节点

> 模板
```cpp
Type hasCycle(ListNode head) {
    ListNode fast, slow;
    fast = slow = head;
    while (fast != null && fast.next != null) {
        fast = fast.next.next;
        slow = slow.next;
        // ...
    }
    return ...;
}
```


### 环型链表：只判断不记录
```cpp
class Solution {
public:
    bool hasCycle(ListNode *head) {
        ListNode* fast, *slow;
        fast = head;
        slow = head;
        while(fast != nullptr && fast->next != nullptr){
            fast = fast->next->next;
            slow = slow->next;
            if(fast == slow)
                return true;
        }
        return false;
    }
};
```
### 环型链表：记录起点
- **fast 一定比 slow 多走了 k 步，这多走的 k 步其实就是 fast 指针在环里转圈圈，所以 k 的值就是环长度的「整数倍」**
- 设相遇点距环的起点的距离为 m，那么环的起点距头结点 head 的距离为 k - m，也就是说如果从 head 前进 k - m 步就能到达环起点。
- 巧的是，如果从相遇点继续前进 k - m 步，也恰好到达环起点。你甭管 fast 在环里到底转了几圈，反正走 k 步可以到相遇点，那走 k - m 步一定就是走到环起点了：

<div align="center" style="zoom:60%"><img src="./pic/1.png"></div>

- 只要我们把快慢指针中的任一个重新指向 head，然后两个指针同速前进，k - m 步后就会相遇，相遇之处就是环的起点了

```cpp
class Solution {
public:
    ListNode *detectCycle(ListNode *head) {
        if(head == nullptr) return nullptr;
        ListNode* fast, *slow;
        fast = head;
        slow = head;
        while(fast->next != nullptr && fast->next->next != nullptr){
            fast = fast->next->next;
            slow = slow->next;
            if(fast == slow)
                break;
        }

        slow = head;
        while(fast->next != nullptr && fast->next->next != nullptr){
            if(slow == fast) return slow;
            else{
                slow = slow->next;
                fast = fast->next;
            }
        }
        return nullptr;
    }
};
```

### 原地修改数组
#### 删除有序数组中重复的
> 题目
```
给你一个有序数组 nums ，请你 原地 删除重复出现的元素，使每个元素 只出现一次 ，返回删除后数组的新长度。

不要使用额外的数组空间，你必须在 原地 修改输入数组 并在使用 O(1) 额外空间的条件下完成。

```
> 思路
- 慢指针 slow 走在后面，快指针 fast 走在前面探路，找到一个不重复的元素就告诉 slow 并让 slow 前进一步。这样当 fast 指针遍历完整个数组 nums 后，nums[0..slow] 就是不重复元素
```cpp
int removeDuplicates(int[] nums) {
    if (nums.length == 0) {
        return 0;
    }
    int slow = 0, fast = 0;
    while (fast < nums.length) {
        if (nums[fast] != nums[slow]) {
            slow++;
            // 维护 nums[0..slow] 无重复
            nums[slow] = nums[fast];
        }
        fast++;
    }
    // 数组长度为索引 + 1
    return slow + 1;
}
```



## 左右指针
- 左右指针在数组中实际是指两个索引值，一般初始化为 `left = 0, right = nums.length - 1 `。
- 只要数组有序，就应该想到双指针技巧。

> 框架
```cpp
void reverseString(vector<char>& s) {
    int left,right;
    left = 0;
    right = s.size()-1;
    while(left < right){
        // ...
    }
}
```
### 二分查找
```cpp
int binarySearch(int[] nums, int target) {
    int left = 0; 
    int right = nums.length - 1;
    while(left <= right) {
        int mid = (right + left) / 2;
        if(nums[mid] == target)
            return mid; 
        else if (nums[mid] < target)
            left = mid + 1; 
        else if (nums[mid] > target)
            right = mid - 1;
    }
    return -1;
}
```

### 两数之和
- https://leetcode-cn.com/problems/two-sum-ii-input-array-is-sorted/solution/yi-zhang-tu-gao-su-ni-on-de-shuang-zhi-zhen-jie-fa/
  - 这个题解很好解释，为什么可以用左右指针

```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        int left, right;
        left = 0;
        right = numbers.size()-1;
        while(left < right){
            if(numbers[left] + numbers[right] == target){
                return {left+1,right+1};
            } else if(numbers[left] + numbers[right] < target) {
                ++left;
            } else if (numbers[left] + numbers[right] > target){
                --right;
            }
        }
        return {left+1,right+1};
    }
};
```

## 滑动窗口
- 参考：https://labuladong.gitbook.io/algo/mu-lu-ye-1/mu-lu-ye-3/hua-dong-chuang-kou-ji-qiao-jin-jie

> 套模板时，应该考虑的问题
1. 当移动 right 扩大窗口，即加入字符时，应该更新哪些数据？
2. 什么条件下，窗口应该暂停扩大，开始移动 left 缩小窗口？
3. 当移动 left 缩小窗口，即移出字符时，应该更新哪些数据？
4. 我们要的结果应该在扩大窗口时还是缩小窗口时进行更新？

> 模板
- [left, right)
```cpp
void slidingWindow(string s, string t){
    unordered_map<char, int> need, window;
    // 初始化
    for(char c : t) need[c]++;

    int left = 0, right = 0;
    int valid = 0;
    while(right < s.size()){
        // 将移入窗口的字符
        char c = s[right];
        // 右移窗口
        right++;
        // 进行窗口内数据的一系列更新
        ...

        /* debug位置*/
        printf("window:[%d,%d]", left, right);

        while(windows needs shrink){
            // 将移出窗口的字符
            char d = s[left];
            // 左移窗口
            left++;
            // 进行窗口内数据的一系列更新
            ...
        }
    }
}
```

# 哈希表
## twosum问题
- hash表的应用，减少时间复杂度

> 题目
```
给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

```
> 代码

```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        map<int,int> emap;
        for(int i = 0; i < nums.size(); ++i){
            if(emap.find(target - nums[i]) != emap.end())
                return {emap[target-nums[i]], i};
            emap[nums[i]] = i;
        }
        return {};
    }
};
```

# 单调栈
- 参考：https://mp.weixin.qq.com/s/KYfjBejo84AmajnPZNs5nA

- 单调栈实际上就是栈，只是利用了一些巧妙的逻辑，**使得每次新元素入栈后，栈内的元素都保持有序（单调递增或单调递减）**。

> 模板
- 也是下面题目的解法
```cpp
vector<int> nextGreaterElement(vector<int>& nums) {
    vector<int> res(nums.size()); // 存放答案的数组
    stack<int> s;
    // 因为判断每个元素要知道它后面的情况，所以从后索引
    for (int i = nums.size() - 1; i >= 0; i--) {
        // 保持单调：把比当前矮的到遇到第一个比当前大的之间的元素弹出
        while (!s.empty() && s.top() <= nums[i]) {
            // 矮个起开，反正也被挡着了。。。
            s.pop();
        }
        // nums[i] 身后的 next great number
        res[i] = s.empty() ? -1 : s.top();
        // 
        s.push(nums[i]);
    }
    return res;
}
```

> 单调栈处理环形数组
- 最简单的实现方式当然可以把这个双倍长度的数组构造出来，然后套用算法模板。但是，我们可以不用构造新数组，而是利用循环数组的技巧来模拟数组长度翻倍的效果
```cpp
class Solution {
public:
vector<int> nextGreaterElements(vector<int>& nums) {
    int n = nums.size();
    vector<int> res(n);
    stack<int> s;
    // 假装这个数组长度翻倍了
    for (int i = 2 * n - 1; i >= 0; i--) {
        // 索引要求模，其他的和模板一样
        while (!s.empty() && s.top() <= nums[i % n])
            s.pop();
        res[i % n] = s.empty() ? -1 : s.top();
        s.push(nums[i % n]);
    }
    return res;
}
};
```
## Leetcode96：「下一个更大元素 I」
```
给你一个数组，返回一个等长的数组，对应索引存储着下一个更大元素，如果没有更大的元素，就存 -1。
```
- 函数签名：`vector<int> nextGreaterElement(vector<int>& nums);`
- eg：`输入一个数组nums = [2,1,2,4,3]，你返回数组[4,2,4,-1,-1]`

> 解法1：暴力
  - O(n^2)
> 解法2：单调栈
- O(n)
- 这个问题可以这样抽象思考：把数组的元素想象成并列站立的人，元素大小想象成人的身高。这些人面对你站成一列，如何求元素「2」的 Next Greater Number 呢？很简单，如果能够看到元素「2」，那么他后面可见的第一个人就是「2」的 Next Greater Number，因为比「2」小的元素身高不够，都被「2」挡住了，第一个露出来的就是答案。 
<div align="center" style="zoom:60%"><img src="./pic/2.png"></div>

# 常数时间下 删除/等概论查找/添加
- 解决：数组+hash表

- 如果想高效地，**等概率**地随机获取元素，就要**使用数组作为底层容器**。
- 如何做到删除速度为O(1):**如果要保持数组元素的紧凑性，可以把待删除元素换到最后**，然后 pop 掉末尾的元素，这样时间复杂度就是 O(1) 了。当然，我们需要额外的哈希表记录值到索引的映射。

# 单调队列
- https://labuladong.gitbook.io/algo/mu-lu-ye-1/mu-lu-ye-2/dan-tiao-dui-lie
- leetcode239.滑动窗口最大值
  - 处理起来复杂度O(n)，每次取最大的复杂度为O(1)
- 「单调栈」主要解决 Next Great Number 一类算法问题，而「单调队列」这个数据结构可以解决滑动窗口相关的问题

- `push`：`void push(int n)`。「单调队列」的核心思路和「单调栈」类似，push 方法依然在队尾添加元素，但是要把前面比自己小的元素都删掉：
  - 你可以想象，加入数字的大小代表人的体重，把前面体重不足的都压扁了，直到遇到更大的量级才停住。
<div align="center" style="zoom:60%"><img src="./pic/3.png"></div>

- `pop`：`void pop(int n)`。要判断 data.front() == n，因为我们想删除的队头元素 n 可能已经被「压扁」了，可能已经不存在了，所以这时候就不用删除了。