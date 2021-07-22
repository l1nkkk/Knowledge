- [参考:](#参考)
- [二叉树](#二叉树)
  - [概述](#概述)
    - [递归的秘诀](#递归的秘诀)
  - [练手题目](#练手题目)
  - [框架](#框架)
    - [前序遍历解法](#前序遍历解法)
    - [后序遍历解法](#后序遍历解法)
    - [层序遍历框架](#层序遍历框架)
  - [通过前序和中序（或后序和中序）遍历结果构造二叉树](#通过前序和中序或后序和中序遍历结果构造二叉树)
  - [二叉树的节点数](#二叉树的节点数)
    - [普通二叉树](#普通二叉树)
    - [满二叉树](#满二叉树)
    - [完全二叉树](#完全二叉树)
- [二叉搜索树](#二叉搜索树)
  - [参考](#参考-1)
  - [概述](#概述-1)
  - [合法性判断](#合法性判断)
  - [遍历](#遍历)
  - [插入](#插入)
  - [删除](#删除)
  - [给定n个节点，求多少种不同的 BST 结构](#给定n个节点求多少种不同的-bst-结构)
# 参考:
- 手把手带你刷二叉树（第一期）：https://labuladong.gitbook.io/algo/mu-lu-ye-1/mu-lu-ye-1/er-cha-shu-xi-lie-1
- 手把手带你刷二叉树（第二期）：https://labuladong.gitbook.io/algo/mu-lu-ye-1/mu-lu-ye-1/er-cha-shu-xi-lie-2
- 手把手带你刷二叉树（第三期）：https://mp.weixin.qq.com/s/LJbpo49qppIeRs-FbgjsSQ
# 二叉树
## 概述

- 递归是基础
### 递归的秘诀
- 写递归算法的关键是要**明确函数的「定义」** 是什么，然后**相信这个定义**，利用这个定义推导最终结果，**绝不要跳入递归的细节**.
- **写树相关的算法，简单说就是，先搞清楚当前 root 节点该做什么，然后根据函数定义递归调用子节点，** 递归调用会让孩子节点做相同的事情。
- **二叉树的问题难点在于，如何把题目的要求细化成每个节点需要做的事情**（leetcode116）

## 练手题目
- 226.翻转二叉树（简单）
- 114.二叉树展开为链表（中等）
- 116.填充每个节点的下一个右侧节点指针（中等）
- 654.最大二叉树（中等）
- 105.从前序与中序遍历序列构造二叉树（中等）
- 106.从中序与后序遍历序列构造二叉树（中等）
- 652.寻找重复的子树（中等）
## 框架
- 以二叉树的**序列化**为引子
- **所谓的序列化不过就是把结构化的数据「打平」，其实就是在考察二叉树的遍历方式**。
### 前序遍历解法
> 框架
```cpp
void traverse(TreeNode* root) {
    // base case
    if (root == null) return;

    // 前序遍历的代码
    traverse(root.left);
    traverse(root.right);
}
```

### 后序遍历解法
> 框架
```cpp
void traverse(TreeNode root) {
    if (root == null) return;
    traverse(root.left);
    traverse(root.right);

    // 后序遍历的代码
}
```
### 层序遍历框架
```cpp
void traverse(TreeNode root) {
    if (root == null) return;
    // 初始化队列，将 root 加入队列
    Queue<TreeNode> q = new LinkedList<>();
    q.pushback(root);

    while (!q.isEmpty()) {
        TreeNode cur = q.popfront();

        /* 层级遍历代码位置 */
        System.out.println(root.val);
        /*****************/

        if (cur.left != null) {
            q.pushback(cur.left);
        }

        if (cur.right != null) {
            q.pushback(cur.right);
        }
    }
}
```


## 通过前序和中序（或后序和中序）遍历结果构造二叉树
- 面试常考
- 二叉树就那几个框架：https://mp.weixin.qq.com/s?__biz=MzAxODQxMDM0Mw==&mid=2247485871&idx=1&sn=bcb24ea8927995b585629a8b9caeed01&chksm=9bd7f7a7aca07eb1b4c330382a4e0b916ef5a82ca48db28908ab16563e28a376b5ca6805bec2&scene=21#wechat_redirect

- 思路：**要想办法确定根节点的值，把根节点做出来，然后递归构造左右子树即可**
- 做二叉树的问题，关键是把题目的要求细化，搞清楚根节点应该做什么，然后剩下的事情抛给前/中/后序的遍历框架就行了

## 二叉树的节点数
- 参考：https://labuladong.gitbook.io/algo/mu-lu-ye-1/mu-lu-ye-1/wan-quan-er-cha-shu-jie-dian-shu
- 一棵完全二叉树的两棵子树，至少有一棵是满二叉树

<div align="center" style="zoom:0%"><img src="./pic/2.png"></div>

### 普通二叉树
- O(N)
```cpp
class Solution {
public:
    int countNodes(TreeNode* root) {
        // base case
        if(root == nullptr) return 0;

        auto lres = countNodes(root->left);
        auto rres = countNodes(root->right);
        /**后序*/
        return 1 + lres + rres;
    }
};
```


### 满二叉树
O(logN)
```cpp
class Solution {
public:
    int countNodes(TreeNode* root) {
        // base case
        if(root == nullptr) return 0;

        // 左边边
        int hl = 0;
        TreeNode* ln = root;
        while(ln != nullptr){
            ln = ln->left;
            ++hl;
        }
        return pow(2, hr)-1;        
    }
};
```
### 完全二叉树
- O(logN*logN)
```cpp
class Solution {
public:
    int countNodes(TreeNode* root) {
        // base case
        if(root == nullptr) return 0;

        // 左边边
        int hl = 0;
        TreeNode* ln = root;
        while(ln != nullptr){
            ln = ln->left;
            ++hl;
        }
        // 右边边
        int hr = 0;
        TreeNode* rn = root;
        while(rn != nullptr){
            rn = rn->right;
            ++hr;
        }
        // man二叉树
        if(hr == hl){
            return pow(2, hr)-1;
        }

        return countNodes(root->left) + countNodes(root->right) + 1;
    }
};
```


# 二叉搜索树
## 参考
- 手把手刷二叉搜索树（第一期）：https://mp.weixin.qq.com/s/ioyqagZLYrvdlZyOMDjrPw
- 手把手刷二叉搜索树（第二期）：https://mp.weixin.qq.com/s/SuGAvV9zOi4viaeyjWhzDw
- 手把手刷二叉搜索树（第三期）：https://labuladong.gitbook.io/algo/mu-lu-ye-1/mu-lu-ye-1/bst3
## 概述
- 定义：对于 BST 的每一个节点 `node`，左子树节点的值都比 `node` 的值要小，右子树节点的值都比 `node` 的值大。
- 如果当前节点要做的事情需要通过左右子树的计算结果推导出来，就要用到**后序遍历**。
  - 参考：https://labuladong.gitbook.io/algo/mu-lu-ye-1/mu-lu-ye-1/hou-xu-bian-li
  - 味道：用前序的时候，可能递归中有递归
  - leetcode1373

- **BST 的中序遍历结果是有序的（升序）**
  - leetcode230 :解题的关键，但不是最高效。利用「BST 中序遍历就是升序排序结果」这个性质，每次寻找第k小的元素都要中序遍历一次，最坏的时间复杂度是`O(N)`，`N`是 BST 的节点个数
    - 要知道 BST 性质是非常牛逼的，像红黑树这种改良的自平衡 BST，增删查改都是`O(logN)`的复杂度，让你算一个第`k`小元素，时间复杂度竟然要`O(N)`，有点低效了。
    - leetcode230也可以有更高效的解法，不过需要在二叉树节点中维护额外信息。**每个节点需要记录，以自己为根的这棵二叉树有多少个节点**。有了`size`字段，外加 BST 节点左小右大的性质，对于每个节点`node`就可以通过`node.left`推导出`node`的排名，从而做到我们刚才说到的对数级算法。
  - leetcode538：也是利用了该性质


----
## 合法性判断
- **判断 BST 的合法性**（看似容易，时机有坑）

> 错误代码
```cpp
boolean isValidBST(TreeNode root) {
    if (root == null) return true;
    if (root.left != null && root.val <= root.left.val)
        return false;
    if (root.right != null && root.val >= root.right.val)
        return false;

    return isValidBST(root.left)
        && isValidBST(root.right);
}
```

<div align="center" style="zoom:60%"><img src="./pic/1.png"></div>

- 出现问题的原因在于，对于每一个节点`root`，代码值检查了它的左右孩子节点是否符合左小右大的原则；但是根据 BST 的定义，`root`的整个左子树都要小于`root.val`，整个右子树都要大于`root.val`。

> 正确代码（前序遍历方式）
- 我们通过使用辅助函数，增加函数参数列表，在参数中携带额外信息，将这种约束传递给子树的所有节点，这也是二叉树算法的一个小技巧吧。
```cpp
boolean isValidBST(TreeNode root) {
    return isValidBST(root, null, null);
}

/* 限定以 root 为根的子树节点必须满足 max.val > root.val > min.val */
boolean isValidBST(TreeNode root, TreeNode min, TreeNode max) {
    // base case
    if (root == null) return true;

    /** 前序遍历位置*/
    // 若 root.val 不符合 max 和 min 的限制，说明不是合法 BST
    if (min != null && root.val <= min.val) return false;
    if (max != null && root.val >= max.val) return false;

    // 判断左右子树
    // 限定左子树的最大值是 root.val，右子树的最小值是 root.val
    return isValidBST(root.left, min, root) 
        && isValidBST(root.right, root, max);
}
```

> 正确代码（后序）

```cpp
class Solution {
public:

    // 递归定义：如果是BST返回true。
    bool isValidBST(TreeNode *root) {
        if(root == nullptr) return true;
        // 处理左右子树
        auto lres = isValidBST(root->left);
        auto rres = isValidBST(root->right);
        if(!lres || !rres) return false;

        // 处理根
        /**后序处理*/
        int lmax, rmin;
        if(root->left != nullptr){
            lmax = getMax(root->left);
            if(lmax >= root->val) return false;
        }

        if(root->right != nullptr){
            rmin = getMin(root->right);
            if(rmin <= root->val) return false;
        }
        return true;
    }

    int getMax(TreeNode* root){
        auto tn = root;
        while(tn->right != nullptr){
            tn = tn->right;
        }
        return tn->val;
    }
    int getMin(TreeNode* root){
        auto tn = root;
        while(tn->left != nullptr){
            tn = tn->left;
        }
        return tn->val;
    }

};
```

## 遍历
- 遍历框架
```cpp
void BST(TreeNode root, int target) {
    if (root.val == target)
        // 找到目标，做点什么
    if (root.val < target) 
        BST(root.right, target);
    if (root.val > target)
        BST(root.left, target);
}
```

## 插入
- 对数据结构的操作无非**遍历 + 访问**，**遍历就是「找」，访问就是「改」**。具体到这个问题，插入一个数，就是先找到插入位置，然后进行插入操作。
- 上一个问题，我们总结了 BST 中的遍历框架，就是「找」的问题。直接套框架，加上「改」的操作即可。**一旦涉及「改」，函数就要返回TreeNode类型，并且对递归调用的返回值进行接收**。

> 框架
```cpp
TreeNode insertIntoBST(TreeNode root, int val) {
    // 找到空位置插入新节点
    if (root == null) return new TreeNode(val);
    // if (root.val == val)
    //     BST 中一般不会插入已存在元素
    if (root.val < val) 
        root.right = insertIntoBST(root.right, val);
    if (root.val > val) 
        root.left = insertIntoBST(root.left, val);
    return root;
}
```

## 删除

- 这个问题稍微复杂，跟插入操作类似，**先「找」再「改」**，先把框架写出来再说


```cpp
TreeNode deleteNode(TreeNode root, int key) {
    if (root.val == key) {
        // 找到啦，进行删除
    } else if (root.val > key) {
        // 去左子树找
        root.left = deleteNode(root.left, key);
    } else if (root.val < key) {
        // 去右子树找
        root.right = deleteNode(root.right, key);
    }
    return root;
}
```

## 给定n个节点，求多少种不同的 BST 结构
> 95.不同的二叉搜索树（Easy）
<div align="center" style="zoom:0%"><img src="./pic/95-1.png"></div>

- 只需要求多少种
- 思路：
  - 选定根
  - 遍历左右子树，返回BST结构的种数,记为x,y。`int count(int lo, int hi)`
  - x*y为该选定根下的BST种数，为根选定另一个值（循环）



> 96.不同的二叉搜索树II（Medium）

- 需要记录结果
- 思路
  - 穷举 root 节点的所有可能。
  - 递归构造出左右子树的所有合法 BST。
  - 给 root 节点穷举所有左右子树的组合。

<div align="center" style="zoom:0%"><img src="./pic/96-1.png"></div>
