- 参考：https://labuladong.gitbook.io/algo/mu-lu-ye-3/mu-lu-ye/hui-su-suan-fa-xiang-jie-xiu-ding-ban
# 概述
- **回溯算法**其实就是我们常说的**DFS 算法**，本质上就是一种**暴力穷举**算法。
- 解决一个回溯问题，实际上就是一个决策树的遍历过程。需要思考 3 个问题：
  - **路径**：也就是已经做出的选择。
  - **选择列表**：也就是你当前可以做的选择。
  - **结束条件**：也就是到达决策树底层，无法再做选择的条件。
- 框架
  - 其核心就是 for 循环里面的递归，**在递归调用之前「做选择」，在递归调用之后「撤销选择」**，特别简单
  - 不一定按这样的方式传参，这是在思考的过程要考虑路径和选择列表
```py
result = []
def backtrack(路径, 选择列表):
    if 满足结束条件:
        result.add(路径)
        return

    for 选择 in 选择列表:
        做选择
        backtrack(路径, 选择列表)
        撤销选择
```

# demo
## 全排列
> 高中做法
- 排列【1，2，3】

```
先固定第一位为 1，然后第二位可以是 2，那么第三位只能是 3；然后可以把第二位变成 3，第三位就只能是 2 了；然后就只能变化第一位，变成 2，然后再穷举后两位……
```

> 决策树

<div align="center" style="zoom:80%"><img src="./pic/1.png"></div>

- 为啥说这是决策树呢，因为你在**每个节点上其实都在做决策**
  - 比如说你站在下图的红色节点上：你现在就在做决策，可以选择 1 那条树枝，也可以选择 3 那条树枝。为啥只能在 1 和 3 之中选择呢？因为 2 这个树枝在你身后，这个选择你之前做过了，而全排列是不允许重复使用数字的。
- 路径、选择列表、结束条件
  - [2] 就是 **「路径」**，记录你已经做过的选择；
  - [1,3] 就是 **「选择列表」**，表示你当前可以做出的选择；
  - **「结束条件」** 就是遍历到树的底层，在这里就是选择列表为空的时候。


- **节点的属性**：可以把「路径」和「选择」列表作为决策树上每个节点的属性
<div align="center" style="zoom:80%"><img src="./pic/2.png"></div>

- **其实就是遍历树的问题**。我们定义的 backtrack 函数其实就像一个指针，在这棵树上游走，同时要正确维护每个节点的属性，每当走到树的底层，其「路径」就是一个全排列。
  - 遍历多叉树的框架如下。**前序遍历的代码在进入某一个节点之前的那个时间点执行，后序遍历代码在离开某个节点之后的那个时间点执行**。


```cpp
void traverse(TreeNode root) {
    for (TreeNode child : root.childern)
        // 前序遍历需要的操作
        traverse(child);
        // 后序遍历需要的操作
}
```

<div align="center" style="zoom:80%"><img src="./pic/3.png"></div>
<div align="center" style="zoom:80%"><img src="./pic/4.png"></div>

- 我们**只要在递归之前做出选择，在递归之后撤销刚才的选择**，就能正确得到每个节点的选择列表和路径。

- **不管怎么优化，都符合回溯框架，而且时间复杂度都不可能低于 O(N!)**，因为穷举整棵决策树是无法避免的。这也是回溯算法的一个特点，不像动态规划存在重叠子问题可以优化，**回溯算法就是纯暴力穷举，复杂度一般都很高**。

> 代码
- O(N!)
```cpp
class Solution {
public:
    set<int> hasPick;
    list<int> nowChoose;
    vector<vector<int>> res;
    vector<vector<int>> permute(vector<int>& nums) {
        dfs(nums);
        return res;
    }
    void dfs(vector<int>& nums){
        // 退出条件
        if(nowChoose.size() == nums.size()){
            res.push_back(vector<int>(nowChoose.begin(),nowChoose.end()));
            return;
        }
        for(auto n : nums){
            if(hasPick.find(n) != hasPick.end()){
                continue;
            }
            hasPick.insert(n);
            nowChoose.push_back(n);
            dfs(nums);
            hasPick.erase(n);
            nowChoose.pop_back();
        }
    }
};
```