- [自由存储区和堆](#自由存储区和堆)
- [placement-new、new operator、operator new](#placement-newnew-operatoroperator-new)
  - [区别](#区别)
  - [demo1:operator new/operator delete使用](#demo1operator-newoperator-delete使用)
- [new 与 malloc](#new-与-malloc)


# 自由存储区和堆
- 参考：https://stackoverflow.com/questions/1350819/c-free-store-vs-heap
- 参考：https://www.quora.com/What-is-the-purpose-of-the-free-store-in-C
- 参考：https://www.cnblogs.com/qg-whz/p/5060894.html
- 参考：https://blog.csdn.net/nie19940803/article/details/76325082

- 两种动态内存区域。
  - heap
  - free store
> C++的内存布局
- 堆（`malloc/free`）、栈、自由存储区（`new delete`）、全局/静态存储区、常量存储区

> free store 和 heap的区别（语言背景角度）
- `malloc`在堆上分配的内存块，使用 `free` 释放内存，而 `new` 所申请的内存则是在自由存储区上，使用 `delete` 来释放
  - 准确来说free store 对应的是 `operator new`

- **free store 和 heap是不同内存区域吗（操作系统角度）**

> 多角度讨论异同
- （编译器上）大部分C++编译器**默认使用堆来实现自由存储**。也就是说这个时候说它是在堆上还是在自由存储区上都对。
- （语言背景）堆是C或操作系统概念。自由存储区是C++抽象出来的逻辑概念。
  - C++提出该概念更加强调了这两种内存自由分配不应该被互操作，且C++使得内存自由分配更加灵活（placement-new）。
  -  C++中使用 malloc 和 free 在技术上是可能的（偶尔有用），但这种**做法应该避免或至少是孤立的**。
- （程序角度）
  - **free store**：对象的生命周期 可以小于 分配存储空间的时间（即free store可以在不立即初始化的情况下分配内存，并且可以再不立即释放内存的情况下销毁对象）
  - **heap**：虽然默认的全局 new 和 delete （注：特指`::operator new`）可能由特定编译器根据 malloc 和 free 实现，但堆与空闲存储不同，并且在一个区域（heap or free store）中分配的内存不能在另一个区域中安全地释放。
    - 从堆(malloc出来的)中的内存可以用`placement-new`构造和**显式析构**，这样的话关于**free store**对象生存期的说明再这里也适用。




# placement-new、new operator、operator new
- 参考：https://blog.51cto.com/yiluohuanghun/1258342
- *参考：https://www.cnblogs.com/luxiaoxun/archive/2012/08/10/2631812.html

## 区别
- `new operator/delete operator`就是`new`和`delete`**操作符**，而`operator new/operator delete`是**函数**。（注：不是很准确，但是很帮助理解）
- `new operator`（操作符）
  - 作用：分配足够的空间（调用` operator new`），并且调用对象的构造函数
  - 执行过程：
    - 调用operator new分配内存
    - 调用构造函数生成类对象
    - 返回相应指针
  - 重载：不可以被重载
  - **new operator与delete operator的行为是不能够也不应该被改变，这是C++标准作出的承诺**


- `operator new`（函数）
  - 作用：分配内存，但不执行构造
  - 重载：可以重载。
    - 返回类型必须声明为`void*`
    - 第一个参数类型必须为表达要求分配空间的大小（字节），类型为`size_t`
    - 可以带其它参数
  - 特例：`placement new`就是``operator new`的重载。不分配内存，而是利用已有内存
  - 全局：`::operator new`，通用操作，在heap中分配
  - **operator new与operator delete和C语言中的malloc与free对应，只负责分配及释放空间**，但是不能够交叉使用，因为一个对象是free store另一个是heap。

- `placement-new`
  - 作用：允许用户把一个对象放到一个特定的地方，达到调用构造函数的效果
  - 重载：`placement new `是重载 `operator new` 的一个标准、全局的版本，它不能够被自定义的版本代替.（不像普通版本的`operator new`和`operator delete`能够被替换）
    - 也就是不能重载覆盖
  - 签名：`void *operator new( size_t, void * p ) throw() { return p; }`
  - `placement-new` 执行时，忽略了size_t，该参数没有作用。只使用和返回`void* p`。
  - 使用场景：
    - buffer性能提高：直接new一个数组当缓冲区，会调用构造函数，影响性能。**可以先预分配一块内存，之后用placement-new构造**
    - 节省了堆中找足够大的空间 的时间。`placement-new`的内存分配是常数时间，因为已经分配好了。
  - 区分普通new:
    - `Widget * p = new Widget; //ordinary new`
    - `pi = new (ptr) int; pi = new (ptr) int; //placement new`


> 为什么有必要写自己的operator new和operator delete？
- **效率**。具体看《Effective C++》中的第二章内存管理

> Placement new使用步骤
- 步骤1：分配缓存空间，有三种方式
  1. 堆中获取
     - `char * buff = new [N*sizeof(Task)]; //分配内存`
  2. 栈上获取
     - `char buf[N*sizeof(Task)]; //分配内存`
  3. 直接用地址。（地址必须有有意义）
     - `void* buf = reinterpret_cast<void*> (0xF00F);`
- 步骤2：对象的构造
  - `Task *ptask = new (buf) Task`
- 步骤3：使用
  - `ptask->memberfunction();`
- 步骤4：对象的析构
  - `ptask->~Task();`
  - 必须显示调用析构
- 步骤5：释放缓存空间
  - 可以反复利用缓存并给它分配一个新的对象（重复步骤2，3，4）
  - Eg：`delete [] buf;`(仅限于动态分配的内存)

----
- 如果你确实需要使用placement new，请认真遵循以上的步骤。


## demo1:operator new/operator delete使用
```cpp
#include <iostream>
#include <string>
using namespace std;

class X
{
public:
    X() { cout<<"constructor of X"<<endl; }
    ~X() { cout<<"destructor of X"<<endl;}

    void* operator new(size_t size,string str)
    {
        cout<<"operator new size "<<size<<" with string "<<str<<endl;
        return ::operator new(size);
    }

    void operator delete(void* pointee)
    {
        cout<<"operator delete"<<endl;
        ::operator delete(pointee);
    }
private:
    int num;    // 4字节
};

int main()
{
    // 调用 new 操作符（注意不是operator new）,这里需要传入 即将调用operator new所需的第二个参数，size参数 new操作符会自己给
    X *px = new("A new class") X;
    delete px;
    return 0;
}
```

```
operator new size 4 with string A new class
constructor of X
destructor of X
operator delete
```
- 结果解析
  - `X *px = new("A new class") X;`中，调用的是 new 操作符（注意不是operator new）,这里需要传入 即将调用operator new所需的第二个参数，size参数 new操作符会自己给
  - `delete px;`（为`delete operator`）时，先调用析构函数，再调用`operator delete`

# new 与 malloc
- https://www.cnblogs.com/qg-whz/p/5140930.html

| 特征 | new/delete | malloc/free |
| :---: | :---: | :---: |
| 分配内存的位置 | 自由存储区 | 堆 |
| 内存分配成功的返回值 | 完整类型指针 | void* |
| 内存分配失败的返回值 | 默认抛出异常 | 返回NULL |
| 分配内存的大小 | 由编译器根据类型计算得出 | 必须显式指定字节数 |
| 处理数组 | 有处理数组的new版本new[] | 需要用户计算数组的大小后进行内存分配 |
| 已分配内存的扩充 | 无法直观地处理 | 使用realloc简单完成 |
| 是否相互调用 | 可以，看具体的operator new/delete实现 | 不可调用new |
| 分配内存时内存不足 | 客户能够指定处理函数或重新制定分配器 | 无法通过用户代码进行处理 |
| 函数重载 | 允许 | 不允许 |
| 构造函数与析构函数 | 调用 | 不调用 |