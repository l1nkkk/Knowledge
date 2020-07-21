- [序言](#%E5%BA%8F%E8%A8%80)
- [开始](#%E5%BC%80%E5%A7%8B)
  - [编译器](#%E7%BC%96%E8%AF%91%E5%99%A8)
  - [输入输出](#%E8%BE%93%E5%85%A5%E8%BE%93%E5%87%BA)
  - [注释](#%E6%B3%A8%E9%87%8A)
  - [控制流](#%E6%8E%A7%E5%88%B6%E6%B5%81)
    - [EOF是什么](#EOF%E6%98%AF%E4%BB%80%E4%B9%88)
- [变量和基本类型](#%E5%8F%98%E9%87%8F%E5%92%8C%E5%9F%BA%E6%9C%AC%E7%B1%BB%E5%9E%8B)
  - [基本内置类型](#%E5%9F%BA%E6%9C%AC%E5%86%85%E7%BD%AE%E7%B1%BB%E5%9E%8B)
  - [类型转换](#%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2)
    - [字面值常量](#%E5%AD%97%E9%9D%A2%E5%80%BC%E5%B8%B8%E9%87%8F)
  - [变量](#%E5%8F%98%E9%87%8F)
    - [变量定义](#%E5%8F%98%E9%87%8F%E5%AE%9A%E4%B9%89)
    - [变量声明和定义的关系](#%E5%8F%98%E9%87%8F%E5%A3%B0%E6%98%8E%E5%92%8C%E5%AE%9A%E4%B9%89%E7%9A%84%E5%85%B3%E7%B3%BB)
    - [标识符](#%E6%A0%87%E8%AF%86%E7%AC%A6)
    - [作用域](#%E4%BD%9C%E7%94%A8%E5%9F%9F)
  - [复合类型](#%E5%A4%8D%E5%90%88%E7%B1%BB%E5%9E%8B)
    - [引用](#%E5%BC%95%E7%94%A8)
    - [指针](#%E6%8C%87%E9%92%88)
    - [理解复合类型的声明](#%E7%90%86%E8%A7%A3%E5%A4%8D%E5%90%88%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%A3%B0%E6%98%8E)
  - [const限定符](#const%E9%99%90%E5%AE%9A%E7%AC%A6)
    - [const的引用](#const%E7%9A%84%E5%BC%95%E7%94%A8)
    - [指针和const](#%E6%8C%87%E9%92%88%E5%92%8Cconst)
    - [顶层const和底层const](#%E9%A1%B6%E5%B1%82const%E5%92%8C%E5%BA%95%E5%B1%82const)
    - [constexpr 和常量表达式](#constexpr-%E5%92%8C%E5%B8%B8%E9%87%8F%E8%A1%A8%E8%BE%BE%E5%BC%8F)
    - [const和constexpr的讨论](#const%E5%92%8Cconstexpr%E7%9A%84%E8%AE%A8%E8%AE%BA)
  - [处理类型](#%E5%A4%84%E7%90%86%E7%B1%BB%E5%9E%8B)
    - [类型别名](#%E7%B1%BB%E5%9E%8B%E5%88%AB%E5%90%8D)
    - [auto类型说明符](#auto%E7%B1%BB%E5%9E%8B%E8%AF%B4%E6%98%8E%E7%AC%A6)
    - [decltype类型指示符](#decltype%E7%B1%BB%E5%9E%8B%E6%8C%87%E7%A4%BA%E7%AC%A6)
  - [自定义数据类型](#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B)
- [字符串、向量和数组](#%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%90%91%E9%87%8F%E5%92%8C%E6%95%B0%E7%BB%84)
  - [命名空间的using声明](#%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4%E7%9A%84using%E5%A3%B0%E6%98%8E)
  - [标准库类型string](#%E6%A0%87%E5%87%86%E5%BA%93%E7%B1%BB%E5%9E%8Bstring)
  - [标准库类型vector](#%E6%A0%87%E5%87%86%E5%BA%93%E7%B1%BB%E5%9E%8Bvector)
    - [操作](#%E6%93%8D%E4%BD%9C)
    - [迭代器](#%E8%BF%AD%E4%BB%A3%E5%99%A8)
  - [数组](#%E6%95%B0%E7%BB%84)
    - [复杂数组声明](#%E5%A4%8D%E6%9D%82%E6%95%B0%E7%BB%84%E5%A3%B0%E6%98%8E)
    - [数组的访问](#%E6%95%B0%E7%BB%84%E7%9A%84%E8%AE%BF%E9%97%AE)
    - [指针和数组](#%E6%8C%87%E9%92%88%E5%92%8C%E6%95%B0%E7%BB%84)
  - [多维数组](#%E5%A4%9A%E7%BB%B4%E6%95%B0%E7%BB%84)
- [表达式](#%E8%A1%A8%E8%BE%BE%E5%BC%8F)
  - [左值和右值](#%E5%B7%A6%E5%80%BC%E5%92%8C%E5%8F%B3%E5%80%BC)
  - [求值顺序](#%E6%B1%82%E5%80%BC%E9%A1%BA%E5%BA%8F)
  - [算数运算符](#%E7%AE%97%E6%95%B0%E8%BF%90%E7%AE%97%E7%AC%A6)
  - [赋值运算符](#%E8%B5%8B%E5%80%BC%E8%BF%90%E7%AE%97%E7%AC%A6)
  - [递增、递减运算符](#%E9%80%92%E5%A2%9E%E9%80%92%E5%87%8F%E8%BF%90%E7%AE%97%E7%AC%A6)
  - [条件运算符](#%E6%9D%A1%E4%BB%B6%E8%BF%90%E7%AE%97%E7%AC%A6)
  - [位运算符](#%E4%BD%8D%E8%BF%90%E7%AE%97%E7%AC%A6)
  - [sizeof运算符](#sizeof%E8%BF%90%E7%AE%97%E7%AC%A6)
  - [逗号运算符](#%E9%80%97%E5%8F%B7%E8%BF%90%E7%AE%97%E7%AC%A6)
- [语句](#%E8%AF%AD%E5%8F%A5)
  - [try 语句块和异常处理](#try-%E8%AF%AD%E5%8F%A5%E5%9D%97%E5%92%8C%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86)
- [函数](#%E5%87%BD%E6%95%B0)
  - [函数基础](#%E5%87%BD%E6%95%B0%E5%9F%BA%E7%A1%80)
  - [参数传递](#%E5%8F%82%E6%95%B0%E4%BC%A0%E9%80%92)
  - [返回类型和return语句](#%E8%BF%94%E5%9B%9E%E7%B1%BB%E5%9E%8B%E5%92%8Creturn%E8%AF%AD%E5%8F%A5)
  - [函数重载](#%E5%87%BD%E6%95%B0%E9%87%8D%E8%BD%BD)
  - [const_cast和重载](#constcast%E5%92%8C%E9%87%8D%E8%BD%BD)
  - [特殊用途语言特性](#%E7%89%B9%E6%AE%8A%E7%94%A8%E9%80%94%E8%AF%AD%E8%A8%80%E7%89%B9%E6%80%A7)
    - [默认实参](#%E9%BB%98%E8%AE%A4%E5%AE%9E%E5%8F%82)
    - [内联函数和constexpr函数](#%E5%86%85%E8%81%94%E5%87%BD%E6%95%B0%E5%92%8Cconstexpr%E5%87%BD%E6%95%B0)
    - [调试帮助](#%E8%B0%83%E8%AF%95%E5%B8%AE%E5%8A%A9)
  - [函数匹配](#%E5%87%BD%E6%95%B0%E5%8C%B9%E9%85%8D)
  - [函数指针](#%E5%87%BD%E6%95%B0%E6%8C%87%E9%92%88)
- [类](#%E7%B1%BB)
  - [构造函数](#%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0)
  - [类成员](#%E7%B1%BB%E6%88%90%E5%91%98)
  - [友元](#%E5%8F%8B%E5%85%83)
# 序言
> 潘爱民

- 要像编译器一样理解c++
- 建议多读几遍此书
- 在实践中，不必全面的使用c++语言的各种特性，应该根据实际情况取舍，鼓励使用c++语言的一个子集就够了，可以参考google发布的`Google C++ Style Guide`

> 孟岩
- c++ 发布之后影响很大，但是让c++复杂了很多
- c++最大的力量在于其不抽象。

# 开始
## 编译器
常见编译器如下：
| 编译器         | 命令  |
| -------------- | ----- |
| GNU            | g++   |
| CLANG          | clang |
| Visual  Studio | cl    |

## 输入输出
一个流就是一个字符序列，是从IO设备读出或写入IO设备的，iostream库包含istream和ostream，分别表示输入流和输出流。
| 对象  |          说明          |
| :---: | :--------------------: |
|  cin  |        标准输入        |
| cout  |        标准输出        |
| cerr  |   输出警告和错误信息   |
| clog  | 输出运行时的一般性信息 |
- endl的效果是结束当前行，并将设备关联的缓冲区中的内容刷到设备中。
  - 程序员在调试的时候常常添加打印语句，这时候应该保证“一直”刷新流，不然程序崩溃，输出可能还在缓冲区中，从而导致程序崩溃的定位错误。
  - 标准库定义了不同的输入和输出运算符，来适应各种不同类型的运算对象。

## 注释
- 单行注释`//`
  - 调试时需要注释某些代码，推荐使用这种方式来避免嵌套带来的错误
- 界定符注释`/**/`
  - 推荐使用下面的注释方式，这样比较直观。
  - 该运算符不能嵌套
```cpp
/*
*
*
*/
```

## 控制流

> istream 对象作为条件
- 当istream作为条件时，其检测流的状态，如果流有效，那么检测成功；如果遇到EOF或者遇到无效的输入（如需要int实际是string），istream的状态会变为无效，处于该状态的对象会使条件变为假
```cpp
#include <iostream>
using namespace std;
int main(){
    int  a = 0;
    int res = 0;
    while(cin >> a){
        res += a;
    }
    cout << res << endl;
    return 0;
}
```

### EOF是什么
> https://ruanyifeng.com/blog/2011/11/eof.html

- end of file的缩写，表示"文字流"（stream）的结尾。这里的"文字流"，可以是文件（file），也可以是标准输入（stdin）。
- EOF不是特殊的字符，而是一个定义在stdio.h的常量`c #define EOF (-1)`
- **在Linux系统之中，EOF根本不是一个字符，而是当系统读取到文件结尾，所返回的一个信号值（也就是-1）**。至于系统怎么知道文件的结尾，资料上说是通过比较文件的长度。

以下是判断文件是否到结尾的代码：
```cpp
int c;
while ((c = fgetc(fp)) != EOF) {
    putchar (c);
}
```
- fgetc()不仅是遇到文件结尾时返回EOF，而且当发生错误时，也会返回EOF。因此，C语言又提供了feof()函数，用来保证确实是到了文件结尾。
- C语言的feof()函数依然返回0，表明没有到达文件结尾；只有当fgetc()向后再读取一个字符（即越过最后一个字符），feof()才会返回一个非零值，表示到达文件结尾。

```cpp
　　int c = fgetc(fp);

　　while (c != EOF) {

　　　　do something;

　　　　c = fgetc(fp);

　　}

　　if (feof(fp)) {

　　　　printf("\n End of file reached.");

　　} else {

　　　　printf("\n Something went wrong.");

　　}
```

> 总结  

Linux中，在新的一行的开头，按下Ctrl-D，就代表EOF（如果在一行的中间按下Ctrl-D，则表示输出"标准输入"的缓存区，所以这时必须按两次Ctrl-D）；Windows中，Ctrl-Z表示EOF。（顺便提一句，Linux中按下Ctrl-Z，表示将该进程中断，在后台挂起，用fg命令可以重新切回到前台；按下Ctrl-C表示终止该进程。）

那么，如果真的想输入Ctrl-D怎么办？这时必须先按下Ctrl-V，然后就可以输入Ctrl-D，系统就不会认为这是EOF信号。Ctrl-V表示按"字面含义"解读下一个输入，要是想按"字面含义"输入Ctrl-V，连续输入两次就行了。

# 变量和基本类型

## 基本内置类型
- 基本内置类型：分为算数类型和空类型
  - 控类型仅用于一些特殊的场合，最常见的就是在函数返回上，表示不返回任何值。
- 算数类型：分为整型（包括字符和布尔类型）和浮点型。
- 整型
  - c++规定一个int至少和short一样大，一个long至少和int一样大，一个long long 至少和一个long一样大。这些都是编译器决定的
  - c++11:long long 类型的增加
- 带符号和无符号
  - 对于char来说：char、 signed char、 unsigned char，char和 signed char并不一样，char表现为哪种是编译器决定的。

<div align="center">
<img src="pic/1.jpg">
</div>

> 类型选择

- 不可能为负的时候，取无符号数
- 浮点运算的时候选double。float的效率和double差不多，long double效率太差
- 算数表达式中不要用bool和char，因为char是不固定的，针对其他的编译器。

## 类型转换
- bool
  - 布尔转整数：false->0, true->1
  - 整数转布尔：0->false, 非0->1
- 浮点和整数
  - 浮点转整数：仅保留小数点之前
  - 整数转浮点：小数部分记为0，如果整数所占的空间超过了浮点类型的容量，会带来精度的丢失。
- 无符号赋值一个超过它表示范围的值时，将对其进行取模(模二进制全1)，再存入。

```cpp
#include <iostream>
using namespace std;
int main(){
    unsigned char a  = -1;
    // -1%256=255
    printf("%d",a);
}
```
> 以下类型也适应类型判断

```cpp
#include <iostream>
using namespace std;
int main(){
    int i = 2;
    // 实现类型判断
    if(i){
        cout << "IN if";
    }

}
```

> 无符号类型的表达式
- 表达式中既有带符号数又有无符号数类型的时候，会对结果转为无符号数，所以为负的都会`取模`。
- 不要混用带符号类型和无符号类型
```cpp
#include <iostream>
using namespace std;
int main(){
    unsigned ua = 12,ub = 11,uc=1;
    int a = 30,b = 10,c=-1;
    // 结果为-28，取模------》ua - a = 4294967278
    cout << "ua - a = " << ua - a << endl;
    // b - ua = 4294967294
    cout << "b - ua = " << b - ua << endl;
    // b - ua = 4294967295
    cout << "b - ub = " << b - ub << endl;
    // c * uc = 4294967295
    cout << "c * uc = " << c * uc << endl;
    // uc * c = 4294967295
    cout << "uc * c = " << uc * c << endl;
}
```

### 字面值常量
> 整型和浮点型

- 整型
  - 十进制，八进制，十六进制：10,010.0x10
  - 默认：十进制是int,long,long long中能装进数但是最小的一个；八进制和十六进制字面值的类型是int,long,long long，unsigned int,unsigned long,unsigned long long中最小的一个。
  - 可以通过后缀表示字面值的类型
  - 十进制的字面值不会是负数，-42表示负十进制字面值，那个负号并不在字面值之内，他的作用仅仅是对字面值取负值。
- 浮点
  - 默认是：double，可以指定
  - 字面值表现为一个小数或以科学计数法表示的指数，指数部分用E和e
  - eg：3.14；3.14E0；0.；0e0；.001
```cpp
// 2 * 10 ^2 = 200
printf("%f",2e2);
```
> 字符和字符串
- 字符
  - eg:`'a'`
- 字符串
  - 字符数组

- 转义盲区
  - \x后加十六进制，\后加八进制
- 布尔
  - true，false
- 指针
  - nullptr

```cpp
#include <iostream>
using namespace std;
int main(){
    // output：Hi MOM
    cout << "Hi \x4dO\115";
}
```

<div align="center">
<img src="pic/2.png">
</div>

```cpp
#include <iostream>
#include <string.h>
using namespace std;
int main(){
    // 这里的字面常量是const char[7]的类型
    const char *c = u8"中国";
    cout << c << endl;
    // len:6
    cout << "len:" << strlen(c);
}
```

## 变量
- 该书中：`对象`是指一块能存储数据并具有某种类型的内存空间
### 变量定义
> 关于初始化和赋值的讨论：https://blog.csdn.net/coutamg/article/details/61419459
- **初始化和赋值是两码事**，初始化不是赋值，初始化的含义是创建变量时赋予一个初始值，而赋值的含义是把对象的当前值擦除，以一个新值来替代。**对于基本类型来说差别不大，但是对于自定义的类型，差别就很大**

- 建议：**初始化每一个内置类型的变量。** 因为由于这个原因出现的错误很难找。

- 如果是内置的类型的变量没有显示初始化，他的值由定义的位置决定，`定义在函数之外的变量会被初始化`，而在函数内部将不初始化`uninitialized`，一个未被初始化的内置类型变量的值是未定义的。
```cpp
#include <iostream>
using namespace std;
int a;
int main(){
    int b;
    float c;
    cout << a << endl;
    cout << b << endl;
    cout << c << endl;
}
```

- 以下是四种初始化方式
  - 其中最值得最易的就是列表初始化，用列表初始化如果存在丢失信息的风险，编译器会报错,如下第二个程序所示。
  - c++11标准：列表初始化
```cpp
#include <iostream>
using namespace std;
int main(){
    int a = 3;
    int b = {4};
    int c{5}; // 列表初始化
    int d(6);
    cout << a << " " << b << " " << c << " " << d;
}
```

```cpp
#include <iostream>
using namespace std;
int main(){
   double pi = 3.14;
   int b = pi;
   // error
   int a{pi};
}
```

### 变量声明和定义的关系
- **c++支持`分离式编译`**，也就是说可以将程序分割多个文件，每个文件可以被独立编译。如果将其分离为多个，一个文件的代码可能需要使用另一个文件中定义的变量，如std::cout。**所以为了支持分离式编译，c++区分了`声明和定义`**
- 声明：向生命一个变量而非定义它的时候，在变量名前加入 `extern`，且不要初始化，如 `extern int a`。如果包含初始化值，就是定义了，如 `extern int a = 3 `。
- 定义：`int a`
### 标识符
- 命名规范
  - 大小写敏感
  - 变量名一般不要首字符大写
  - 自定义类名一般大写字母开头
  - 驼峰法或者`_`分割命名

### 作用域
> 全局和局部冲突时
- 首先肯定要避免全局和局部发生冲突，但是当发生冲突时，如下处理

- 使用`::`，全局作用域本身没有名字，所以左边是空的
```cpp
#include <iostream>
using namespace std;
string a = "out";
int main(){
    string a= "in";
    // in
    cout << a  << endl;
    // out
    cout << ::a << endl;
}
```

## 复合类型
- 声明语句的描述：一条声明语句由一个基本数据类型和紧随其后的一个`声明符`列表组成。
  - 一般我们`声明符`就是变量名，此时变量的类型就是声明的基本数据类型。
  - 可以有更复杂的`声明符`，基于基本的数据类型得到更复杂的类型，并把它指定给变量
- c++有集中复合类型：引用和指针就是其中之一。

### 引用
- C++11标准：添加了右值引用；但是一般我们说的引用是左值引用
- 引用：给对象起了别名，引用和它的初始值对象绑定在一起，而不是将初始值拷贝给引用。
- 注
  - 引用并非对象，而是对象的别名
  - 引用必须被初始化，其本身不允许随意改变引用锁绑定的对象，从这层理解，引用又算是常量
  - 对引用进行赋值，其实是把值赋值给引用绑定的对象。
  - 引用本身不是一个对象，所以不能定义引用的引用
  - 引用只能和对象绑定，而不能和字面值和表达式绑定。`int &t = 3; // error`


> 例子
```cpp
#include <iostream>
using namespace std;
string a = "out";
int main(){
    int i,&t=i;
    t = 3;
    // output：3 3 
    cout << i << " " << t << endl;
}
```
### 指针
- 指针：是一个存放对象地址的对象，和引用一样也实现了间接访问，然而又有很多不同点。
- 注
  - 指针是一个对象
  - 因为引用不是对象，所以不能定义指向引用的指针
  - `*` 和 `&`可以用于组成复合类型，也可以用于做运算符。
  - 建议给所有的指针都进行初始化，因为很多运行时的错误都是因为没有对指针进行初始化
  - **赋值永远改变的是等号左侧的对象**


> 空指针

- 空指针：不指向任何对象。
- 几种得到空指针的方法，如下所示
  - C++11规范：添加了nullptr
  - 推荐使用`nullptr`
```cpp
int *p; 
p = 0;
p = NULL;
p = nullptr;
```

> void* 指针

- 可以用来存放任意对象的地址
- 不能直接操作`void*`所指向的对象，因为我们并不知道这个对象到底是什么类型，不知道有哪些操作。

### 理解复合类型的声明
- 同一条定义语句中，基本数据类型只有一个，但是声明符的形式却可以不同，也就是说可以定义出不同类型的变量，如`int a, *b, &c;`
- `int *p1, p2;`中，其中p2的类型是int类型，*仅仅修饰的是p。**其实类型修饰符只是声明符的一部分而已，他不是作用于本次定义的全部变量**，造成误解是源于`int* p;`这样的写法
- 指针和引用的声明有两种方法，如下，坚持选择一种即可

```cpp
// 第一种
int *p;

// 第二种
int* p;

```


> 指向指针的引用

- 指针是对象，所以存在指向指针的引用,如下代码所示
  - **要理解ap的类型是什么，只需要从右往左读**。`同理可得：如果面对一条比较复杂的指针或引用的时候，从右向左阅读有助于弄清楚它的真实含义`

```cpp
#include <iostream>
using namespace std;
int main(){
    int i, *p = &i, *&ap =p;
    *ap = 3;
    // output:i = 3; *p = 3; *ap = 3
    cout << "i = " << i << "; *p = " << *p << "; *ap = " << *ap;

}
```

## const限定符
- 被其修饰的变量的值不能改变
- const对象必须初始化，因为其一旦创建就不能再改变
- 默认情况下，const对象`仅在本文件内有效`，当多个文件中出现同名的const变量的时候，其实等同于在不同的文件中定义了独立的变量
- **如果要让多个文件使用同一个变量，需要在定义和声明的时候都使用extern**
```cpp
// test.cpp文件，在这里定义
extern const int bufSize = getbuf();
// test.h文件,在这里声明
extern const int bufSize; 
```
```cpp
// illegal
const int buf;
int cnt = 0;
const int sz = cnt; // legal.
++cnt;              // legal.
++sz;               // illegal, attempt to write to const object(sz).
```



### const的引用
- 对const的引用，简称为`常量引用`
```cpp
const int ci = 1024;
// legal
const int &r1 = ci;

r1 = 42;
// illegal，
int &r2 = r1;
```

- 引用的类型必须接所引用的对象类型一致，但是有两种意外
  1. 在对`常量引用`进行初始化的时候，允许用任意表达式作为初始化值，只要表达式的结果 可以转换成 引用的类型 就可以了，如允许是一个非常量的对象，字面值，甚至是一个一般表达式。
     
```cpp
    int i = 42;
    // 1.legal，非常量
    const int &r1 = i;
    // 2.legal，字面值
    const int &r2 = 42;
    // 3.legal，一般表达式
    const int &r3 = r1 *2;
    // 4.legal，j可以转int类型
    const int &r4 = j;
    // illegal,一定要是和对象绑定
    int &r5 = r1*2;
```
1. 对于以上第4种情况，其实存在一个临时量`const int temp = j;const int &r4 = j;`，所以此时引用绑定的是一个临时变量
2. 为什么对第4种情况，当r4不是常量的时候，c++不支持呢？因为既然使用了引用，肯定希望改变r4的值，否则干嘛要这样呢，所以c++干脆将其定义为违法操作了。

### 指针和const
- 这里面比较容易搞混的就是指向常量的指针和指针常量
- 指向常量的指针：指针指向的对象是一个常量，不能对这个对象做修改
- 指针常量：指针是一个常量，不能对指针的指向做修改。
- 还是可以使用从右往左读变量的方法。

```cpp
int i = 3;
// 指向常量的指针
const int * p1;
// 常量指针
int *const p2 = &i;
// 指向常量对象的常量指针
const int *const p3 = &i;
```

### 顶层const和底层const
- 个人感觉就是为了理解`指针常量`和`指向常量的指针`而设定的名词概念。也可以不用管。
- 顶层const：可以表示任意的对象是常量，所有的类型都适用，如指针本身是个常量。
  - 执行拷贝的时候，没有影响。
- 底层const：指针所指的对象是一个常量，适用于指针和引用等复合类型。
  - 拷贝的时候，`拷入和拷出`都必须具有相同的底层const资格 或者 两个对象的数据类型必须能够转换。

```cpp
int i = 0;
const int ci = 42;//顶层const
const int *p2 = &ci;// 底层const
const int *const p3 = p2;//靠右的const是顶层const，靠左的const是底层const
// illegal，p3包含底层const的定义，而p没有
int *p = p3;
// legal,p2和p3的底层都是const
p2 = p3
// legal，int*能转换成const int *
p2 = &i;
```

### constexpr 和常量表达式
> 常量表达式
- `常量表达式`：值不会改变并且`在编译过程`就能得到计算结果的表达式。
- 一个对象或者(表达式)判断是不是常量表达式是根据：`数据类型`和`初始值`共同决定的。
```cpp
// max是常量表达式
const int max = 20;
// limit是常量表达式
const int limit = max + 3;
// temp不是常量表达式，因为
int temp = 3;
// sz不是常量表达式，因为get_size()得运行了才知道结果
const int sz = get_size();
```

> constexpr
- 引入：在一个复杂的系统中，很难去知道const是不是常量表达式。
- constexpr(C++11规范)：可以在编译时强制要求变量是常量表达式。
- 字面值类型：可以在编译时被计算、比较简单、可以赋值给constexpr的类型
  - 算数类型，引用和指针都属于字面值类型
  - 自定义类和标准库类不属于，像string就不是。
- **如果认定变量是一个常量表达式，那么就把其声明为constexpr类型，不再用const**
- 指针和constexpr
  - constexpr把他所定义的对象置为`顶层cosnt`
  ```cpp
    // p是一个指向常量的指针。
    const int *p = nullptr;
    // q是一个常量指针
    constexpr int *q = nullptr;
  ```
- 题：是否正确
  - 答：错误,p不能被赋值为 int
```cpp
int null = 0, *p = null;
```

### const和constexpr的讨论
> 自己加的，来源：https://www.zhihu.com/question/35614219


- 在编译的时候，编译器会把用到该变量的地方都替换成对应的值。补：但是const不能保证其编译时是常量，他只能保证运行时不被修改
- 简单说const其实是readonly，constexpr才是const。
- 语义上：
  - constexpr：告诉编译器我可以是编译期间可知的，尽情的优化我吧。
  - const：告诉程序员没人动得了我，放心的把我传出去；或者放心的把变量交给我，我啥也不动就瞅瞅。
- 语法上：
  - constexpr是一种比const 更严格的束缚, 它修饰的表达式本身在编译期间可知, 并且编译器会尽可能的 evaluate at compile time.
  - 在constexpr 出现之前, 可以在编译期初始化的const都是implicit constexpr. 
  - 直到c++ 11, constexpr才从const中细分出来成为一个关键字, 而 const从1983年 c++ 刚改名的时候就存在了... **如果你初学c++, 应当尽可能的, 合理的使用constexpr来帮助编译器优化代码**.
- 测constexpr函数是否产生编译时期值的方法很简单，就是利用std::array需要编译期常值才能编译通过的小技巧。这样的话，即可检测你所写的函数是否真的产生编译期常值了。

## 处理类型
### 类型别名
- 作用：给类型起一个别名，使其易于理解和编程使用。 
- 方法
  - typedef
  - using
- const是对给定类型的修饰,以下代码第4点需要注意

```cpp
// 1.wages是double的同义词
typedef double wages;
// 2.base是double的同义词，p是double*的同义词
typedef wages base, *p;
// 3.myint是int的别名
using myint = int;

// 4.指向double的常量指针，因为这里p是指针，const修饰p
const p tp = &wages;

```

### auto类型说明符
- 引入：有时候声明变量的时候，很难知道表达式的类型。
- 作用：让编译器自己去分析表达式所属类型
- C++11标准
> 细节
- 可以多个类型，但是只能一个基本类型
- auto其实推的是基本数据类型，而且auto定义的变量必须初始化，其根据初始化来推荐。
- 推断出来的auto类型可能和初始值的类型不一样，编译器会适当改变结果类型使其更符合我们可能想要的。
  - 当使用引用对象进行初始化时，其实真正参与初始化的是引用绑定的类型，eg：3
  - auto一般(除了 引用 和 带*的auto指针 )忽略顶层的const，同时底层的const会保留下来。eg:4,5
  - 如果希望顶层const保留，可以加上const。eg：15
  - `&`和`*`还是只从属于某个声明符
  - 加不加`*`影响的只是auto，变量不会收到影响。eg:7,8
  - 涉及到变量是引用类型的时候，必须加`&`。
  - 个人观点：其实在`引用`和`指针`中，初始化表达式中的顶层const，自动编程了底层const，所以const得以保留。

```cpp
auto i = 0,*p = &i;// 1. i是整型，p是整型指针
auto j = 0,pi = 3.14;// 2. error,j是整型，pi是浮点型

int &r = i;
auto a = r;// 3. a是整型（r是i的别名，而i是一个整数）

const int ci = i, &cr = ci;
auto b = ci; // 4. b是整型，顶层const除去
auto c = cr; // 5. c是整型
auto d = i; // 6. d是一个整型指针
auto e = &ci;// 7. d是一个指向整型常量的指针，因为底层const保留，auto为int *
auto *e1 = &ci;// 8. d是一个指向整型常量的指针，因为底层const保留，auto为int


auto &g = ci; // 9. ！g是一个整数常量引用，初始值中的顶层常量保留，因为这里
auto &h = 42; // 10. !error，不可以为非常量引用绑定字面值，因为但从42无法推出const
const auto &j = 42 // 11. !right:可以为常量引用绑定字面值

auto k = ci, &l = i; // 12. k是整数，l是整数的引用
auto &m = ci, *p = &ci; // 13. m是整数的常数引用，p是指向整型常数的指针，auto为 const int
auto &n = i, *p2 = &ci; // 14. error,因为i是整型，ci是整型常数

const auto f = ci; // 15. f为const int，auto为int类型
```

### decltype类型指示符
- 引入：希望根据 表达式 推断类型，却不想用该表达式初始化，decltype提供此功能
- 在处理引用和顶层观点const和auto有些许不同，eg:3,4
- 如果decltype中的表达式不是一个变量，则返回的类型为表达式结果的类型。eg：5
- 有时候表达式可以返回一个引用类型，一般发生这种情况，可以说明这个表达式可以作为赋值语句的左值。eg6
- decltype与auto一个重要的区别在于decltype的结果类型与表达式形式密切相关。
  - 加上括号与不加可能导致结果不同。eg:7,8。decltype((变量))永远是引用，decltype(变量)只有变量是引用的时候才会是引用。


```cpp
// 1. sum的类型是x返回值的类型
decltype(f()) sum = x;
const int ci = 0, &cj = ci;
// 2. x为const int类型
decltype(ci) x = 0;
// 3. y为const int&类型
decltype(cj) y = x;
// 4. error,z是一个引用，必须要初始化
decltype(cj) z;

int i = 42, *p = &i, &r = i;
// 5. b为int类型,如果想让r的decltype不是引用类型，可以使用这种方法
decltype(r + 0) b;
// 6. error,c为int&类型，必须初始化
decltype(*p) c;
// 7. errord是int&，必须初始化
decltype((i)) d;
// 8. e是一个int
decltype(i) e;
```

## 自定义数据类型
- C++11标准：可以为数据成员提供一个类内初始值。eg:1
- 建议将类定义在头文件，文件名和类名保持一致。这样可以被多个文件使用，如果头文件改变，其他使用该头文件的程序必须重新编译。

```cpp
// 1. 类内初始值
struct Student{
    int no = 0;
}
```

> 头文件保护符


```cpp
#ifndef STUDENT_H
#define STUDENT_H


#endif
```

# 字符串、向量和数组
## 命名空间的using声明
- 格式：`using namespace::name`
- 建议不要直接`using namespace std;`
- 头文件不应该包含using声明，因为其会被其他包引用

```cpp
using namspace::cin
```

## 标准库类型string
- 初始化
  - 拷贝初始化:使用`=`的初始化
  - 直接初始化

```cpp
string s1;
string s2(s1);
string s2 = s1; // 拷贝初始化
string s3 = "value";// 拷贝初始化
string s4(n,'c');// 直接初始化
string s5 = string(n,'c')// 拷贝初始化
```

- 读写
  - << ,>>
    - 输入的时候，会忽略开头的空白（空格，换行，制表符）。遇到下一次空白时结束。
    - `>>`：返回输入状态，可以转换为bool进行判断，遇到文件结束标记或者非法输入循环结束为false；eg：1
  - `getline(is, s)//is为输入流`
    - 如果想输入空格，可以选择getline，遇到回车结束。换行实际是被丢弃掉的，没有接收。
    - 也会返回流参数,遇到文件结束标记或者非法输入循环结束为false；。eg:2

```cpp
// 1.逐个读取单词，直到遇到文件结束标记或者非法输入循环结束
int main(){
    string str;
    while(cin >> str){
        cout << str << endl;
    }
}
```

```cpp
// 2.逐行读取句子，，直到遇到文件结束标记或者非法输入循环结束
int main(){
    string str;
    while(getline(cin,str)){
        // 需要endl来换行，str不会接收换行
        cout << str << endl;
    }
}
```
- size
  - 如果表达式中有了size()函数就不要再使用int了，这样可以避免混用int和unsigned可能带来的问题。
  - `string::size_type`类型。可以用auto或者decltype来获取

```cpp
string line = "abc"
auto len = line.size()
```

- 比较
  - 先比较的是逐个字符，如果都一样再比较长度。
- 字面值和string相加
  - `+`左边和右边必须要有string类型，得益于string对`+`的重载
  - 不能把字面值直接相加，eg：`s = "abc"+"def"+s`

- 处理字符
  - 可以借助cctype这个库：里面可以判断字符类型，以及对字符做一些转换
- **范围for语句**
  - C++11规范
  - `for(declaration : expression)`，eg:1
  - 如果想改变string中的字符，应该将循环变量定义为引用类型


```cpp
// 1. 使用范围for语句进行每个字符的遍历，每次迭代将下一个字符拷贝给c
int main(){
    string str;
    str = "abcdefg";
    for( auto c : str){
        cout << c << " ";
    }
}
```
```cpp
// 2. 要对string里面的字符转为大写，这个引用变量依次绑定字符串中的每个元素对象。
#include <iostream>
#include<cctype>
using namespace std;
int main(){
    string str;
    str = "abcdefg";
    for( auto &c : str){
        c = towupper(c);
    }
    cout << str;
}
```
- 下标运算
  - 技巧：设置小标的类型为string::size_type，因为这是个无符号数，一定不小于0，所以只要确定小标小于size的值就可以了。
  - 一定要判断下标的合法性！
```cpp
for (decltype(s.size) i; i != s.size;i++)
```

## 标准库类型vector
- 模板
  - 类模板
  - 函数模板
  - 实例化：模板本身不是类或者函数，编译器根据模板创建出类或函数的过程成为实例化
- vector是一种容器
- vector会进行值初始化，比如元素的内置类型像int，会被初始化为0；而string会调用默认初始化，即一个空串。
- 元素的类型不能是引用。

### 操作
> 初始化
```cpp
vector<T> v1; // 默认初始化
vector<T> v2(v1); // 将v1拷贝给了v2
vector<T> v2 = v1;// 等价于v2(v1)
vector<T> v3(n,val);// 包含n个重复的val
vector<T> v4(n); // 包含n个重复的值默认初始化
vector<T> v5{a,b,c...}; // v5包含了初始值个数的元素，每个元素被赋予相应的初始值
vector<T> v5={a,b,c...}; // 等价于v5{a,b,c...}
```
> 添加

- `pushback`
  - 在想要同时多个初始化时可以使用

> 遍历
- 带引用
- 不带引用
```cpp
// output:1 4 9 16 25 36 
int main(){
    vector<int> v = {1,2,3,4,5,6};
    for (auto &i : v){
        i *= i;
    }
    for (auto i : v){
        cout << i << " ";
    }
    return 0;
}
```

> 其他

- 判断空：v.empty()
- 元素个数：v.size()
- 索引：v[]
- 判断相等：==，!=
  - 只有类型一致才能判断，当size一样，每一个索引对应的值一样，才相等
- 比较: >,>=,<=,<
  - 只有当元素的值可比较，vector对象才可以比较，
  - 若元素值有区别，则vector对象的大小关系由第一对相异的元素值的大小关系决定。
  - 若元素没区别，则比较vector的容量。

> 注意

- 确保下标合法的一种方法就是使用`范围for循环`

### 迭代器
- 类似于指针，可以间接访问
- 容器和string的一种对内部元素的间接引用
- 使用了迭代器，就不要想迭代器所属的容器添加元素

> begin和end   

- begin:容器中第一个元素
- end:容器中尾元素的下一个位置，若果容器为空，begin==end。end成员常被称为尾后迭代器。
  - 尾后迭代器不能解引用和递增等操作，只能用来做哨兵。

- begin和end返回的具体类型由对象是否是常量决定
```cpp
// it1为vector<int>::iterator
// it1为vector<int>::const_iterator
vector<int> v;
const vector<int> cv;
auto it1 = v.begin();
auto it2 = v.begin();
```
- C++11规范：cbegin和cend，可以直接返回const_iterator.


> 迭代器运算


| 运算           | 解释                                                                     |
| -------------- | ------------------------------------------------------------------------ |
| *iter          | 引用                                                                     |
| iter->men      | 获取元素的成员,替代了(*it).men                                           |
| ++iter         | 指向下一个                                                               |
| --iter         | 指向前一个                                                               |
| iter1 == iter2 | 判断是不是相等，如果指向同一个容器的同一个元素或者是尾后迭代器则相等     |
| iter1 != iter2 |                                                                          |
| iter + n       | 往end方向移动n。结果迭代器 或者 指向容器内一个元素 或者 为尾后迭代器的   |
| iter - n       | 往begin方向移动n。结果迭代器 或者 指向容器内一个元素 或者 为尾后迭代器的 |
| iter += n      |                                                                          |
| iter - n       |                                                                          |
| iter1 - iter2  | 参与运算的迭代器必须是同一个容器的，类型为difference_type的带符号的整型  |
| <=, >=, <, >   | 比较靠近end的比较大                                                      |
- C++比较多的会被for循环使用!=来控制，因为这样在所有的标准库提供的所有容器上都有效。
  - 所有的标准库容器的迭代器都定义了`!=`和`=`，但是他们当中大多数都没有定义`<`运算符


## 数组
- 维度必须是一个常量表达式

```cpp
unsigned cnt = 10;
constexpr unsigned sz = 12;

int a[cnt]; // illegal
int b[sz]; //legal
```

- 和内置类型变量一样，如果在`函数内没有初始化`，那么默认初始化会将其成为一个稳定一的值。
  - 下面例子中，sa和sa2不是内置类型，所以默认初始化为空字符串。而ia在函数外部，所以初始化为0。ia2在函数内部，所以其值为undefined

```cpp
string sa[10];
int ia[10];

int main() {
  string sa2[10];
  int ia2[10];
}
```

- 不允许拷贝赋值
  - 有的编译器支持这种赋值，这是一种编译器的扩展，不支持这样使用。
```cpp
int a[] = {0,1,2};
int a2[] = a;

```
- 初始化的时候，如果只给一小部分初始化，那么其他会自动默认初始化。
  - eg:`int a[10]={1,2,3}`
### 复杂数组声明
- 按从右向左的方法理解不带括号的，eg：1,2
- 按由内到外理解带括号的，eg：3,4
```cpp
// 1. 有十个整型指针的数组
int *ptrs[10];
// 2. 错误,没有引用的数组
int &refs[10] = /*?*/; 
// 3. 指向一个含有10个int的数组
int (*Parray)[10] = &arr;
// 4. 引用一个含有10个int的数组
int (&arrRef)[10] = arr;
```

### 数组的访问
- 类型:`size_t`，其是一种机器相关的无符号类型，定义爱cstddef头文件中
```cpp
const size_t sign = 3;
int a[3];
for (size_t i = 0; i < sign; i++){

}
```

### 指针和数组
- auto
  - 大多数表达式中，使用数组类型的对象，其实是使用一个指向该数组首元素的指针。
  - 使用`&`避免auto使用的时候将类型推断为指针。因为加了&，类型推断时auto就不可能有`*`。
```cpp
int ia[] = {0,1,2,3,4,5};
auto ia2(ia); // ia2是一个整型指针，指向ia的第一个元素
auto ia2(&ia[0]); //与上面等价
decltype(ia) ia3 = {0,1,2,3,4,5}; // ia3是一个由6个整数组成的数组
```

```cpp
int main(){
    int arr[10]{1,2,3,4,5};
    auto& a(arr);
    a[3] = 5;
    cout << arr[3];

}
```

- 指针也是迭代器
- 尾后指针的获取
  1. 直接用运算符。
  2. C++11规范：使用begin和end。（推荐）
```cpp
int arr[10];
// 1. 数组的一个特殊性质
int *p = &arr[10];
cout << p << endl;
// 2. 直接调用end
cout << end(arr) << endl;
return 0;
```

> 指针运算
- 对vector和string的迭代器支持的操作，数组指针都支持
- 指针相减的类型：`ptrdiff_t`
- 像string和vector等标准库的下标类型必须是无符号类型，而内置的下标运算没有这样的要求。其不是无符号数。

```cpp
int ia[] = {0,2,4,6,8};
int *p = &ia[2];
int j = p[1];
int k = p[-2]; // p[-2]是ia[0]表示的那个元素
```

> 注：
- 允许使用数组来初始化vector

```cpp
// 使用数组初始化vector
int arr = {0,1,2,3};
vector<int> ivec(begin(arr),end(arr));
```
- c++应该精良使用vector和迭代器，避免使用内置数组和指针。应该尽量使用string，而不是基于数组的字符串。

## 多维数组
> 初始化
```cpp
// 1.
int a[3][3] = {
  {1,2,3},
  {4,5,6},
  {7,8,9}
};

// 2.没初始化的都为0
int a[3][3] = {1,2,3,4};

// 3.没初始化的都为0
int a[3][3] = {{1},{4},{7}};

```
> 范围for循环处理多维数组
- 要使用范围for语句处理多维数组，除了最内层的循环外，其他所有循环的控制变量都应该是引用类型
```cpp
int main(){
    int a[3][3] = {
        {1,2,3},
        {4,5,6},
        {7,8,9}
    };
    // 一定要引用类型。
    for(auto& row : a){
        for(auto col : row){
            cout << col << " ";
        }
        cout << endl;
    }

}
```

> 指针和多维数组
- 多维数组其实是个数组的数组，定义指针的时候牢记。

```cpp
int ia[3][5];
int (*p)[4] = ia; // p是指向含有4个整数的数组
int *p[4]; // 整型指针数组
p = &ia[3]; // 尾后指针
```

- 1. 到了C++11的时候，可以用auto

```CPP
int main(){
    int a[3][4] = {
        {1,2,3,4},
        {5,6,7,8},
        {9,10,11,12}
    };
    for(auto p = a;p != end(a);p++){
        for(auto q = *p;q != end(*p);q++){
            cout << *q << " ";
        }
        cout << endl;
    }

}
```
- 2. 类型别名简化多维数组指针
```cpp
using int_array = int[4];
int main(){
    int a[3][4] = {
        {1,2,3,4},
        {5,6,7,8},
        {9,10,11,12}
    };
    for(int_array *p = a;p != end(a);p++){
        for(int *q = *p;q != end(*p);q++){
            cout << *q << " ";
        }
        cout << endl;
    }

}
```

# 表达式
## 左值和右值
- C++的表达式，不是左值就是右值。
- C中定义：左值可以用于复制语句左侧，右值不可以
- 在C++中就没那么简单。当一个对象用作右值的时候，用的是对象的值。当对象被用作左值，用的是对象的身份(在内存中的位置)。
- 个人理解：可以理解为左值可读可写，右值只读。
- `decltype` 中传入左值和右值时不同。假如p是int*类型，decltype(*p)的结果是int&，decltype(&p)的结果是int**.

## 求值顺序
- 优先级定义了运算对象组合方式，打算没有说明对象按照什么顺序求值。
  - 下面这个例子中，不知道f1和f2谁先运行，这是未定义的。
```cpp
int i = f1() * f2();
```

## 算数运算符
- 对于%，结果的正负取决于`被模数`的正负。
- C++11规范：对于/,对于int类型，直接社区小数点之后。

## 赋值运算符
- 一种建议的写法
> 繁琐的写法
```cpp
int i;
i = get_value();
while(i = get_value()!=42){
  i = get_value();
  ...
}
```

> 推荐的写法
```cpp
int i;
while((i = get_value())!=42){

}
```
- 复合赋值运算符
  - `a op= b`等同于`a = a op b`。唯一区别就是复合赋值运算符只需要求一次，使用普通的需要两次。一次是右边子表达式的求值，另一次是赋值运算求值。这种区别只有小小的性能差别。

## 递增、递减运算符
- 除非必须，否则不要使用后置++。--也一样
  - 前置++可以避免不必要的工作，可以把值+1直接返回给运算对象。而后置的需要将原始的进行存储，这是一种浪费，对于迭代器的浪费更大。

> 使用后置++的情况

- 用在又需要+1，又需要原来的值。
- `*pbeg++`这样的形式很常用，等同于*(pbeg++)
```cpp
auto pbeg = v.begin();
while(pbeg != v.end() && *pbeg > 0)
  cout << *pbeg++ << endl;
```

> 用后置++的陷阱

```cpp
auto pbeg = v.begin();
while(pbeg != v.end())
  *pbeg = toupper(*beg++);
```
- 赋值运算符左右两端都用到了pbeg，并且右边对其进行了改变，这样的语句是`未定义行为的`，存在以下两种可能
  - `*pbeg = toupper(*beg);`
  - `*(pbeg+1) = toupper(*beg++);`

## 条件运算符
- 嵌套用法
  - 注：最多2-3层

```cpp
finalgrade = (grade > 90) ? "high pass"
                        :(grade < 60) ? "fail":"pass";
```

## 位运算符
- 强烈推荐将位运算符用于处理无符号整数
- `>>`的行为是`未定义的`

## sizeof运算符
- 对引用类型执行sizeof运算将得到 被引用对象所占空间的大小
- 对指针将得到指针本身的大小
- 对解引用将得到指针指向对象所占空间的大小
  - sizeof不会实际求运算对象的值，所以即使指针是无效的也没有什么影响。eg.1
- 对数组将得到数组所占空间的大小。eg:2
- 对string或者vector执行sizeof只是返回该对象固定部分的大小。

```cpp
int ia[10],*p;
// 1. 即使指针无效也没有关系
sizeof *p;
// 2. 获取数组元素个数
constexpr size_t sz = sizeof(ia)/sizeof(*ia);
int arr2[sz];
```

## 逗号运算符
- 对于逗号运算符来说，首先对左侧的表达式求值，然后将值结果丢弃掉。真正返回的结果是右侧表达式的值，如果右侧运算对象是左值，那么最终的求值结果也是左值。


# 语句
- 空语句
  - 多余的空语句并非总是无害的。如在没{}的循环上
  - 复合语句 `{}` 等价于 `;`
- 悬垂else
  - else和最近的if匹配。可以用 `{}` 避免和最近 `if` 匹配
- switch内部变量定义
  - 如果被略过的代码中含有变量的定义怎么办？不允许跨过 `变量的初始化语句` 直接调到该变量作用域内的领一个位置

```cpp
case true:
  string a;//错误，因为控制流绕过一个隐式初始化
  int b = 0;//错误，因为控制流绕过一个显示初始化
  int c;// 正确
  break;
case false:
  jval = 10;
```
- 解决另声明变量在语句块内部
```cpp
case true:
{
  string a;//错误，因为控制流绕过一个隐式初始化
  int b = 0;//错误，因为控制流绕过一个显示初始化
  int c;// 正确
  break;
}
case false:
  ...
```

- while语句(非do while)
  - 定义在while条件部分或者while循环体内的变量每次迭代都经历`从创建到销毁的过程`
  - 什么时候使用while：`不确定循环次数的时候；或者想循环结束后访问循环的变量`

- 范围for循环
  - 了解范围for的本质
```cpp
vector<int> v = {0,1,2,3,4};
for(auto &r : v)
  r *= 2;
```
等价于

```cpp
for(auto beg = v.begin(), end = v.end(); beg != end;beg++){
  auto &r = *beg;
  r *= 2;
}
```

- do while
  - 不允许在条件内部定义变量
```cpp
do{
  输入密码
}while(判断输入)
```

- goto 语句
  - 不要在程序中使用goto，很容易错。
  - 和switch类似，goto`不允许将程序的控制权从变量作用域之外移到作用域之内`。eg.1
  - 向后跳过一个已经执行的定义是合法的。跳回到变量定义之前意味着系统将销毁该变量。eg.2

```cpp
// 1.
  goto end;
  int ix = 10
end:
  ix = 4;

// 2.
begin:
  int sz = get_size();
  if(sz <= 0){
    got begin;
  }
```
## try 语句块和异常处理
- 抛出：throw
  - 一旦发出异常信号，检测出问题的部分也就完成了任务，接下来交给调用者了。
- 确定接收抛出的域:try
  - try之后可接多个catch
- 处理抛出：catch
  - 如果没有匹配到catch，那么这个函数会被停止，然后继续搜索上层函数的catch有没有。如果最终没有，`程序转到名为terminate的标准库函数`，函数行为和系统有关，一般执行该程序将导致非正常退出。

- 每个标准库异常都定义了名为what的成员函数，这些函数没有参数，返回值是C风格的字符串。
- 异常会终止一些资源的清理，如果异常发生期间正确执行了清理工作的程序被称为 `异常安全程序`，对于需要异常处理继续执行的程序，需要很小心。
- 标准异常：见p176
```cpp
double testThrow(double a, double b){
    if (b == 0){
        throw runtime_error("B can not be 0");
    } else{
        return a/b;
    }
}

int main(){
    try{
        cout << testThrow(10,0) << endl;
    }catch (runtime_error err){
        cout << err.what();
    }
    return 0;
}

```


# 函数
## 函数基础
- 形参和实参
  - 实参是形参的初始值
  - 尽管实参和形参存在对应关系，但是没有规定实参的求值顺序。
- 函数返回类型
  - 不能返回数组和函数，但是可以返回 数组或者函数 的指针
- 局部变量
  - 对于作用域：限于本函数，会隐藏外部变量
  - 对于生命周期：依赖于定义的方式
  - 自定对象：只存在于块执行期间的对象，内置类型未初始化将残生未定义值。如形参。
  - 局部静态对象：内置类型未初始化将产生0值。生命周期贯穿函数调用及之后的时间。
- 函数声明
  - 含有函数声明的头文件应该被包含到定义函数的源文件中

## 参数传递 
- 引用传递：形参是引用类型
- 值传递：进行拷贝传值，相互独立。
- 在C++中推荐使用引用类型的形参替代指针
- 如果函数不用改变引用形参的值，最好将其声明为常量引用。
  - 使用引用而非常引用会极大的限制参实参的类型
```cpp
string::size_type test(string &s);
test("lin");//error
```
- 如何一次返回多个值
  - 使用引用参数
  - 重新定义一个结构
- 当用实参初始化形参时会忽略掉顶层的const
```cpp
void func(const int i);
void func(int i);// error,重复定义
```
- 形参的初始化方式和变量的初始化方式一样。
- 数组参数
  - 数组两个性质：不允许拷贝数组，使用数组时通常将其转换为指针
  - 以下三个函数是等价的，每个函数的唯一形参都是const int*类型，只检查传入的参数是否是const int *。eg.1 2 3
  - 如何保证数组形参在使用时不越界：
    - 使用标记指定数组长度：类似c风格的字符串
    - 传入尾后元素的指针
    - 显示传递一个数组的大小
  - 数组引用形参.eg.4
  - 多维数组。eg.5，6
- main 的argv和argc,第一个元素是程序的名字。eg.7
- 含有可变形参的函数
  - `initializer_list 形参`：与vector类似，只是我们不能改变initializer_list其中的元素的值。eg. 8
  - 省略符形参：为了**便于C++程序访问某些特殊的C代码而设置的**，这些代码使用了名为varargs的C标准库功能。
    - 仅仅用于C和C++的通用类型
    - 省略符形参对应的实参无需类型检查
```cpp
// 1
void print(int *)
// 2
void print(const int[])
// 3
void print(const int[10])
// 4. 不加括号就变成引用的数组，将产生错误
void print(int (&arr)[10])
// 5.
void print(int (*matrix)[10], int rowSize)
// 6.编译器会忽略第一维度，含有10个整数的数组指针
void print(int matrix[][10], int rowSize)

// 7.
int main(int argc,char **argv){
    for(int i = 0;i < argc;i++){
        cout << argv[i] << endl;
    }
    return 0;
}

// 8.
double demo(initializer_list<string> vstr){
    for( auto s : vstr ){
        cout << s << " ";
    }
}

int main(int argc,char **argv){
    demo({"233","444"});
    return 0;
}

```

## 返回类型和return语句
- 返回void的函数可以不同return，因为一般函数会在最后补上`return;`
- 返回一个值的方式和初始化变量和形参的方式一样。
- 返回的值用于初始化调用点的一个临时变量，该临时量就是函数调用的结果。
- 同初始化和形参一样，返回的对象可以是引用类型，引用返回左值。eg.1
- 不要返回局部对象的引用和指针。
- C++11标准：函数可以返回花括号保卫的值的列表。
- 主函数main的返回
  - 0表示成功，非0表示失败，非0的具体意义根据机器而定
  - cstdlib库中`EXIT_FAILURE`和`EXIT_SUCCESS`为了使返回机器无关。
- 返回数组指针：定义一个返回数组的指针或引用比较麻烦
  1. 取别名后返回。eg.2
  2. 声明一个返回数组指针的函数
  3. C++11标注：尾置返回类型
  4. 使用decltype

```cpp
// 1.
string & addHeader(string &s){
    s = "head:"+s;
    return s;
}

int main(int argc,char **argv){
    string s = "123";
    cout << addHeader(s);
    addHeader(s) = "123"
    cout << s;
}
// 2.区别名
typedegf int arrInt10[10];
using arrInt10 = int[10];
attInt10 func(int i);
// 3.声明数组返回
int (*func(int i))[10];
// 4.尾置返回类型
auto func(int i) -> int(*)[10];
// 5. decltype
int odd[] = {0,1,2,3,4,5,6,7,8,9};
decltype(odd) func(int i){

}
```
## 函数重载
- 在形参数量和类型上不同，而不允许两个函数除了返回类型意外其他都相同。
- 重载和const形参
  - 一个拥有底层const的形参无法和另一个没有顶层const的形参区分开来。eg.1
  - 如果形参是某种类型的指针或者引用，可以通过指向的是常量对象还是非常量对象实现函数重载。
    - 编译器可以通过实参是否是常量来判断应该选用哪个
    - 当传递一个非常量的时候，编译器会优先选用非常量版本的函数

```cpp
// 1.错误
int test1(int a);
int test1(const int a);

// 2.正确
int test2(string &);
int test2(const string&);
// 3.正确
int test3(string *);
int test3(const string*);
```

## const_cast和重载
```cpp
const string & test(const string &s1,const string &s2){
}

```
- 上面这个返回的结果仍然是const string的引用，需要一种新的test函数，**当实参不是常量时，得到的结果是一个普通的引用**，`const_cast`可以做到

```cpp
string & test(string &s1,string &s2){
  auto &r = test(const_cast<const string&>(s1),const_cast<const string&>(s2);
  return const_cast<string&>(r);
}
```
- 重载的三种结果
  - 最佳匹配
  - 无匹配
  - 二义性调用
- 将函数声明置于局部作用域中是不推荐的。如果这样做了，将隐藏外层作用域中声明的同名实体。

```cpp
void print(const string);
void print(double);
void test(){
  void print(int);//新作用域
  print(3);
  print("wwww");// 错误,void print(const string);被隐藏了
}
```

## 特殊用途语言特性
### 默认实参
- 函数的后续声明能为函数设置默认值形参
- 局部变量不能做默认实参。可以用全局变量默认初始化

```cpp
string str= "123";
void test(string = str);
// 初始化为123
test();
void test2(){
  str = "456";
  // 初始化为456
  test();
}

```
### 内联函数和constexpr函数
- 内联函数
  - 只是给编译器一个优化的建议，编译器可以忽略
- constexpr函数
  - 能够用于常量表达式
  - 要是常量表达式的原则：函数的返回类型及所有形参类型都是字面值类型，而且函数体中必须要有一条return语句。
  - constexpr函数被隐式指定为内联函数
  - constexpr 函数不一定返回常量表达式
  - 把内联函数和constexpr函数放在头文件内。因为和其他函数不一样，内联函数和constexpr函数可以再程序多次定义。
```cpp
constexpr int new_sz{return 42;}
int arr[scale(2)] // legal
int i = 2;
int a2[scale(i)];//ilegal，scale(i)不是常量表达式，因为实参不是常量表达式
```
- 把内联函数和constexpr函数放在头文件内。因为和其他函数不一样，内联函数和constexpr函数可以在程序中定义多次（注：当被同程序不同文件include的时候），但是必须保证多个定义是完全一致的。
### 调试帮助
- assert
  - assert是一种预处理宏
  - assert用于检查`不能发生`的条件
- NDEBUG
  - NDEBUG如果定义了，assert就什么都不做。eg.1

```cpp
void print(const int a[],size_t size){
#ifndef NDEBUG
    cout << __func__ << "：数组大小为" << size << endl;
#endif
}

int main(int argc,char **argv){
    int a[10];
    print(a,10);
    return 0;
}
```
- `__func__`是C++编译器定义的，可以输出当前调试的函数的名字，预处理器还定义了另外4个对程序调试很有用的名字

|          |                                |
| :------: | :----------------------------: |
| __FILE__ |     存放文件名字符串字面值     |
| __LINE__ |    存放当前行号的整型字面值    |
| __TIME__ | 存放文件编译时间的字符串字面值 |
| __DATE__ | 存放文件编译日期的字符串字面值 |

## 函数匹配
- 先选候选函数，再选可行函数，在进行最佳匹配的寻找。
- 候选函数：
  - 特征：与被调用的函数同名；声明在调用点课件
- 可行函数：
  - 能够被这组实参调用的函数

```cpp
void f(); //a
void f(int);//b
void f(int,int);//c
void f(double,double = 3.14);//d

// 先选出a,b,c,d，再选出b,d，再选d(最佳匹配)
f(5.6);
// illegal先选出a,b,c,d，再选出c,d，出现二义性
f(42,2.56);
```
- 一个函数，又重载，又默认参数，很容易在调用时有二义性。

- 实参类型转换：后面再看,还没看

<div align="center">
<img src="./pic/3.png">
</div>

## 函数指针
- 函数指针指向的是函数而非对象。
- 注意函数指针与函数类型有区别。

> 定义一个指向函数的指针
```cpp
bool lengthCompare(const string &);
bool (*pf)(const string &);
```
- 当我们要把函数名当一个值使用的时候，自动转化为指针。当使用函数指针的时候可以直接使用，不用解引用。
```cpp
pf = lengthCompare;  // 自动转换为指针
pf = &lengthCompare; // 等价于上面个
pf("l1nkkk");
(*pf)("l1nkkk"); // 等价于上面的语句
```

> 重载函数的指针

- 需要特别注意函数指针的定义。定义取决于其赋予哪个函数的指针。

> 函数指针形参

- 数组当实参的时候，会自动转指针；函数也是一样，会自动转函数的指针。eg.1
- 数组和函数都不能当形参。
- 函数作为实参的时候，自动转指针。eg.2
```cpp
// eg.1
void test(bool pf(const string &));   // 自动转换成指向函数的指针
void test(bool (*pf)(const string&)); // 显示地将形参定义指向函数的指针
// eg.2
test(lengthCompare);
```
- 使用typedef和decltype
```cpp
// 函数类型
typedef bool Func(const string &);
typedef decltype(lengthCompare) Func2; // 等价类型
// 指向函数的指针
typedef bool (*FuncP)(const string &);
typedef decltype(lengthCompare) *FuncP2; // 等价类型
// 声明函数，同一类型
void test(FuncP);
void test(Func);
```
> 返回指向函数的指针
- 和数组类型，不能返回一个函数
- 可以使用尾置返回类型的方式。eg.5
```cpp
using F = int(int*,double); // F是函数类型
using PF = int(*)(int*,double); //PF是指针类型

// 以下5中等价
// 1
PF f1(int); // legal
// 2
F f1(int);  // illegal,不能返回一个函数。
// 3
F* f1(int);  // legal
// 4. 純定义
int (*f1(int))(int);
// 5. 尾置返回
auto f1(int)->int(*)(int*,double);

```

# 类
- 定义在类的内部的成员函数是`隐式的inline函数`。
- struct与class
  - 唯一区别就是struct第一个权限控制之前默认是public，而class是private
- 类作用域
  - 类本身就是一个作用域。
  - 编译器分两步处理，先编译成员的声明，在轮到成员函数体。所以不用担心成员函数体声明在成员变量之前。
- this
  - 用请求该函数的对象地址初始化this
  - 默认情况下是一个指向类类型非常量版本的常量指针，即`Student * const`
  - 可以看成是这样的调用：`stu1.getNum() ===> Student::getNum(&stu1);`
  - const成员函数：指向类类型常量版本的指针，即`const Student * const`
- const函数
  - 常量对象 以及 常量对象的指针和引用只能调用const函数
- 左值返回：可以定义一个返回this对象的函数，即`return *this;`，return类型为`Student &` 这个时候调用后可以继续调用。如`stu1.fun1().fun2()`，其中fun1返回左值。
- 其他
  - 当我们定义的函数是用来模仿一个 内置运算符的时候，返回也最好尽量一样。
  - IO类属于不能被拷贝的类型，因此我们只能通过引用来传递他们。而且不能是const，因为读取和写入会改变对象。
- 类相关的非成员函数
  - 一般来说，和类定义在同一个头文件中

```cpp
struct Student{
  // 封装
  using studentNum = int;
private:
  studentNum num = "";
  string name = "";
  int sex = 0;
};
```

## 构造函数
- 当我们创建一个const的对象时，只有构造函数完成初始化后，对象才具有const特性。
- 默认构造函数：什么都不给的时候调用的类初始化。
- `合成的默认构造函数`：没有构造函数的时候，编译器给的。
  - 初始化
    - 如果存在类内初始化，用它来初始化成员
    - 否则，就用默认初始化规则(2.2.1节p40)。
  - 局限
    - 一旦我们自定义构造函数，就不再有
    - 如果有内置类型或复合类型(数组和指针)，默认初始化是未定义的。
    - 如果含有一个其他类的成员，而且这个类的成员没有默认构造函数，将无法编译。
    - 当类需要分配内存的时候，往往不适用。可以使用string和vector避免分配和释放内存带来的复杂
  - C++11标准：`=default`表示让默认构造函数，使用合成的默认构造函数
  <div ><img src="pic/4.png"></div>

- 构造函数初始值列表
  - 当某个数据成员被构造函数初始值列表忽略的时候，将与`合成默认构造函数`相同的方式进行隐式初始化
  - 如果没有`构造函数初始值列表`，可以看成`构造函数初始值列表`为空

## 类成员
> 定义类型成员
- 类型成员通常出现在类开始的地方
<div ><img src="pic/5.png"></div>
<div ><img src="pic/6.png"></div>

> 另成员作为内联函数
- 可以直接将函数定义在类内
- 在类内把inline作为声明的一部分
- 在类外部用inline关键字修饰函数的定义
- 推荐：最好只在类外部定义的地方说明inlune，这样可以使类更容易理解。

> 可变数据成员

- 目的：让const成员函数也可以修改某个数据成员。
- 在变量的声明中加入`mutable`
- 一个可变数据成员永远不会是const，即使他是 const对象的成员
  
> 类内初始化
- 可以使用`=`和`{}`来进行类内初始化。


## 友元
- 一般在`类开始`或者`类结束`的地方声明友元
- 友元的声明仅仅只是指定访问全向，不是一个函数的声明，在友元声明的时候，编译器都是一直以为这个函数已经在这个作用域可见了的。所以如果没函数声明，得到了在使用的时候才会报错。
- 推荐把友元的声明与类本身放在同一个头文件
- 许多编译器没有强制限定 友元函数必须在使用之前在 类的外部声明。但是为了代码编译器友好，推荐都必须声明。
  
