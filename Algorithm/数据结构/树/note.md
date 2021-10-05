- [树的定义](#%E6%A0%91%E7%9A%84%E5%AE%9A%E4%B9%89)
  - [树，空树，根，子树](#%E6%A0%91%E7%A9%BA%E6%A0%91%E6%A0%B9%E5%AD%90%E6%A0%91)
  - [其他术语](#%E5%85%B6%E4%BB%96%E6%9C%AF%E8%AF%AD)
- [树的表示](#%E6%A0%91%E7%9A%84%E8%A1%A8%E7%A4%BA)
- [二叉树](#%E4%BA%8C%E5%8F%89%E6%A0%91)
  - [定义](#%E5%AE%9A%E4%B9%89)
  - [特殊二叉树](#%E7%89%B9%E6%AE%8A%E4%BA%8C%E5%8F%89%E6%A0%91)
  - [二叉树的重要性质](#%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E9%87%8D%E8%A6%81%E6%80%A7%E8%B4%A8)
  - [二叉树的抽象数据类型定义](#%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E6%8A%BD%E8%B1%A1%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B%E5%AE%9A%E4%B9%89)
  - [二叉树的存储结构](#%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E5%AD%98%E5%82%A8%E7%BB%93%E6%9E%84)
    - [数组](#%E6%95%B0%E7%BB%84)
    - [链表](#%E9%93%BE%E8%A1%A8)
  - [遍历](#%E9%81%8D%E5%8E%86)
    - [先序遍历](#%E5%85%88%E5%BA%8F%E9%81%8D%E5%8E%86)
    - [中序遍历](#%E4%B8%AD%E5%BA%8F%E9%81%8D%E5%8E%86)
    - [后序遍历](#%E5%90%8E%E5%BA%8F%E9%81%8D%E5%8E%86)
    - [总结](#%E6%80%BB%E7%BB%93)
    - [非递归遍历](#%E9%9D%9E%E9%80%92%E5%BD%92%E9%81%8D%E5%8E%86)
    - [层序遍历](#%E5%B1%82%E5%BA%8F%E9%81%8D%E5%8E%86)
  - [遍历应用例子](#%E9%81%8D%E5%8E%86%E5%BA%94%E7%94%A8%E4%BE%8B%E5%AD%90)
    - [叶子节点](#%E5%8F%B6%E5%AD%90%E8%8A%82%E7%82%B9)
    - [求高度](#%E6%B1%82%E9%AB%98%E5%BA%A6)
    - [二元运算表达式树及其遍历](#%E4%BA%8C%E5%85%83%E8%BF%90%E7%AE%97%E8%A1%A8%E8%BE%BE%E5%BC%8F%E6%A0%91%E5%8F%8A%E5%85%B6%E9%81%8D%E5%8E%86)
    - [由两种遍历序列确定二叉树](#%E7%94%B1%E4%B8%A4%E7%A7%8D%E9%81%8D%E5%8E%86%E5%BA%8F%E5%88%97%E7%A1%AE%E5%AE%9A%E4%BA%8C%E5%8F%89%E6%A0%91)
  - [树的同构](#%E6%A0%91%E7%9A%84%E5%90%8C%E6%9E%84)
    - [思路](#%E6%80%9D%E8%B7%AF)
  - [二叉搜索树](#%E4%BA%8C%E5%8F%89%E6%90%9C%E7%B4%A2%E6%A0%91)
    - [操作](#%E6%93%8D%E4%BD%9C)
# 树的定义
## 树，空树，根，子树
<div style="zoom:50%" align="center"><img src="pic/1.png"></div>

- 子树是不相交的
- 除了根结点，每个节点有且只有一个父结点。
- 一颗N个节点的树有N-1条边。树是保证结点联通的边最少的连接方式。
## 其他术语
- 需注意
  - 树的度
  - 路径和路径的长度
<div style="zoom:50%" align="center"><img src="pic/2.png"></div>

<div style="zoom:50%" align="center"><img src="pic/3.png"></div>

# 树的表示
- 数组表示：很难去判别谁是父亲、儿子是谁
- 用链表去表示：每个节点结构不一样，实现困难。
  - 如果把所有的节点都设置成A这样的结构，那么实现起来简单一点，但是如果有n个节点，那么一共有3n个子节点指针。而实际需要n-1个，带来2n+1的浪费。
<div style="zoom:80%" align="center"><img src="pic/4.png"></div>

- `儿子兄弟表示法`：左边指向第一个儿子，右边指向他的下一个兄弟。
  - **旋转45°后形成一颗`二叉树`。所以解决了`二叉树`是怎么表示怎么实现，也就解决了一般树的许多问题。**
<div style="zoom:80%" align="center"><img src="pic/5.png"></div>
<div align="center"><img style="zoom:80%" src="pic/6.png"><br/><span>旋转45°</span></div>

# 二叉树
## 定义
- 与一般度为2的树的区别是，二叉树的子树有左右之分。
<div style="zoom:50%" align="center"><img src="pic/7.png"><br/></div>

## 特殊二叉树
- 斜二叉树
- 完美二叉树，满二叉树（特殊的完全二叉树）
- 完全二叉树
<div style="zoom:50%" align="center"><img src="pic/8.png"><br/></div>

## 二叉树的重要性质
<div style="zoom:50%" align="center"><img src="pic/9.png"><br/></div>

- 性质3推理：全部结点数-1=边树=结点对边的贡献
  - `n1+n2+n0-1=n0*0+n1*1+n2*2`
## 二叉树的抽象数据类型定义

<div style="zoom:50%" align="center"><img src="pic/10.png"><br/></div>

## 二叉树的存储结构
### 数组
> 完全二叉树
<div style="zoom:50%" align="center"><img src="pic/11.png"><br/></div>

> 一般二叉树
<div style="zoom:50%" align="center"><img src="pic/13.png"><br/></div>

### 链表
<div style="zoom:50%" align="center"><img src="pic/12.png"><br/></div>

## 遍历
### 先序遍历
<div style="zoom:50%" align="center"><img src="pic/14.png"><br/></div>

### 中序遍历
<div style="zoom:50%" align="center"><img src="pic/15.png"><br/></div>

### 后序遍历
<div style="zoom:50%" align="center"><img src="pic/16.png"><br/></div>

### 总结
- 每个节点都有三次碰到他的时候

<div style="zoom:50%" align="center"><img src="pic/17.png"><br/></div>

### 非递归遍历
- 思路：使用堆栈
- 难点：后序遍历

<div style="zoom:90%" align="center"><img src="pic/18.png"><br/></div>

### 层序遍历
<div style="zoom:60%" align="center"><img src="pic/19.png"><br/></div>

[代码1-树的构造和遍历代码](code/1.traversal.cpp)

## 遍历应用例子
### 叶子节点
- 任何顺序的遍历都可以，只要在打印的时候加个条件判断就可以了（判断左右子树是否都为空）

### 求高度
- 左右两个子树最高的+1
- 高度=max(Hl,Hr)+1
- 利用后续遍历的程序框架
<div style="zoom:60%" align="center"><img src="pic/21.png"><br/></div>

### 二元运算表达式树及其遍历
- 生活中的运算顺序：子树遍历之前加左括号，子树遍历之后+右括号
<div style="zoom:60%" align="center"><img src="pic/22.png"><br/></div>

### 由两种遍历序列确定二叉树
- 必须要有中序，因为这样才能区分出左右子树
<div style="zoom:60%" align="center"><img src="pic/23.png"><br/></div>

## 树的同构
- 什么是同构
<div style="zoom:60%" align="center"><img src="pic/24.png"><br/></div>

- 题意
<div style="zoom:60%" align="center"><img src="pic/25.png"><br/></div>
<div style="zoom:60%" align="center"><img src="pic/26.png"><br/></div>

### 思路
- 二叉树怎么表示——静态链表
  - 根在没人指向他的位置
- 建立二叉树
- 判断同构

> 二叉树的表示
<div align="center"><img src="pic/27.png"><br/></div>

> 程序框架
<div  align="center"><img src="pic/28.png"><br/></div>

> 建立二叉树
<div  align="center"><img src="pic/29.png"><br/></div>
<div  align="center"><img src="pic/30.png"><br/></div>

> 判断同构
<div  align="center"><img src="pic/31.png"><br/></div>
<div  align="center"><img src="pic/32.png"><br/></div>

[代码3-判断同构](code/3.同构.md)


## 二叉搜索树
<div  align="center"><img src="pic/34.png"><br/></div>

### 操作
- 查找
- 插入
- 删除

<div  align="center"><img src="pic/33.png"><br/></div>

> 查找操作
<div  align="center"><img src="pic/35.png"><br/></div>
<div  align="center"><img src="pic/36.png"><br/></div>

- 因为非递归函数的执行效率高，可将“尾递归”函数改为迭代函数

<div  align="center"><img src="pic/37.png"><br/></div>

- 效率决定于树的高度

> 查找最大值和最小值
<div  align="center"><img src="pic/38.png"><br/></div>


> 插入

- 关键在于找到插入的位置
<div  align="center"><img src="pic/39.png"><br/></div>

> 删除
- 叶节点
- 只有一个孩子
- 有两个孩子
  - 使得变成要么没有孩子要么只有一个孩子的情况。

<div  align="center"><img src="pic/40.png"><br/></div>






