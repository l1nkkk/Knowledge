
- [运算符和输入输出](#%E8%BF%90%E7%AE%97%E7%AC%A6%E5%92%8C%E8%BE%93%E5%85%A5%E8%BE%93%E5%87%BA)
  - [运算符](#%E8%BF%90%E7%AE%97%E7%AC%A6)
  - [输出](#%E8%BE%93%E5%87%BA)
  - [输入](#%E8%BE%93%E5%85%A5)
- [变量](#%E5%8F%98%E9%87%8F)
  - [定义](#%E5%AE%9A%E4%B9%89)
  - [数据类型](#%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B)
  - [类型转换](#%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2)
  - [基本类型和string之间的转换](#%E5%9F%BA%E6%9C%AC%E7%B1%BB%E5%9E%8B%E5%92%8Cstring%E4%B9%8B%E9%97%B4%E7%9A%84%E8%BD%AC%E6%8D%A2)
  - [值类型和引用类型](#%E5%80%BC%E7%B1%BB%E5%9E%8B%E5%92%8C%E5%BC%95%E7%94%A8%E7%B1%BB%E5%9E%8B)
  - [细节](#%E7%BB%86%E8%8A%82)
- [常量](#%E5%B8%B8%E9%87%8F)
  - [定义](#%E5%AE%9A%E4%B9%89-1)
- [程序控制](#%E7%A8%8B%E5%BA%8F%E6%8E%A7%E5%88%B6)
  - [条件语句](#%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5)
    - [if语句](#if%E8%AF%AD%E5%8F%A5)
    - [switch](#switch)
  - [循环语句](#%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5)
- [函数](#%E5%87%BD%E6%95%B0)
  - [定义](#%E5%AE%9A%E4%B9%89-2)
  - [参数传递](#%E5%8F%82%E6%95%B0%E4%BC%A0%E9%80%92)
- [指针](#%E6%8C%87%E9%92%88)
- [复杂数据类型](#%E5%A4%8D%E6%9D%82%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B)
  - [数组](#%E6%95%B0%E7%BB%84)
  - [Slice切片](#Slice%E5%88%87%E7%89%87)
    - [定义和初始化](#%E5%AE%9A%E4%B9%89%E5%92%8C%E5%88%9D%E5%A7%8B%E5%8C%96)
    - [slice和string](#slice%E5%92%8Cstring)
    - [细节](#%E7%BB%86%E8%8A%82-1)
  - [map](#map)
# 运算符和输入输出
## 运算符
- `++`:只能做单独语句使用
- `>>`:对于无符号数，填充0；对于有符号数，填充符号位
## 输出               
- %T可以用来输出类型
- %c可以用来让byte类型以ascii形式输出
- 浮点：%g，全展开；%e，使用E表示，%f，随缘

## 输入
1. fmt.Scanln():遇到换行才停止扫描
2. fmt.scanf():按指定的格式将成都读取到的值保存到对应的各个变量
# 变量
## 定义

> [变量定义demo](demo/变量定义.md)
- 不带初始化
- 带初始化
  - golang可以自动推测类型
- 多变量不同类型初始化
- 全局变量初始化

## 数据类型
- 基本数据类型
  - 整型：(u)int,(u)int8,(u)int16,(u)int32,(u)int64,uintptr
  - 布尔类型：bool
  - 字符串行：string
    - 存的是UTF-8编码
  - 字符型：byte,rune
    - byte为1个字节，rune为4个字节，可以将其看成整型
  - 浮点型：float32,float64,complex64,complex128
- 派生/复杂数据类型
  - 指针
  - 数组
  - Slice切片
  - map
  - 结构体struct
  - 管道channel
  - 接口interface

## 类型转换
- go只有强制类型转换，没有隐式类型转换
```go
var a,b int = 3,4
var c int
c = int(math.Sqrt(float64(a*a+b*b)))
```
## 基本类型和string之间的转换
> 基本类型->string
- (推荐)使用`fmt.Sprint("%参数", 表达式)`
- FormatInt，FormatFloat...

> string->基本类型
- (推荐)SScanf
- ParseBool，Parsefloat

## 值类型和引用类型
- 值类型：基本数据类型（int类... 等等），数组和结构体struct
  - 特点：存放在栈中
- 引用类型：指针，slice切片，map，管道chan，interface
  - 特点：变量存储的是一个地址，具体数
  - 
## 细节
- rune有符号，与int32一样，可以看做其实就和int32一样。用来表示一个unicode码
- int和uintptr类型由操作系统的位数决定。
- 编译器推断类型的时候，浮点数：float64，整数：int，字符：int32
```go
// res:int,float64,int32
a, b, c := 1, 2.2, 'c'
fmt.Printf("%T,%T,%T", a, b, c)
```
- `go语言的编码统一用utf8，string中存的都是utf8编码`
- bool只允许取true和false
- 单引号，双引号和反引号：
  - 单引号：字符
  - 双引号：会识别转义字符的字符串
  - 反引号：不会发生转义，里面是什么就输出什么
- 字符串不可修改
- 用首字母大小写取本是否对包外可见
- :=简短变量声明，如果左值有多个可以不都是未声明的
- 对于字符串**len返回的是字节数**，可以用`==`和`<`等比较，比较是基于字节的，[i]返回第i个字节，是byte类型的。
- for i >= 0用真对于uint。无符号数往往只有位运算和其他特殊的运算场景才会使用。
- 如果一个变量实现String这个方法，那么fmt.Println默认会调用这个变量的string()进行输出
# 常量
## 定义
- 和变量的定义一样，只是把该写`var`的地方换成了`const`，而且不能用`":"`的方式
- 如果没有给其规定类型，可以作为各种类型使用
- 一般在其他语言中我们用常量会全大写，但是在go中大写首字母有其他的含义。
```go
func test1(a int) {
    fmt.Println(a + 3)
}

func consts() {
    const a = 5
    // 参数需要的是float64
    fmt.Println(math.Sqrt(a))
    // 参数需要的是int
    test1(a)
}

func main() {
    // result:
    // 2.23606797749979
    // 8
    consts()
}
```
- 特殊枚举类型定义，iota的使用
  - 在go里面没有枚举专门的类型，可以用const来替代。
  - 局限：不能产生10的幂，因为go没有幂运算符
  - [常量枚举demo](demo/常量枚举.md)
  - 可以用`"_"`跳过

# 程序控制
## 条件语句
### if语句
- 细节
  - 条件表达式的结果只能是true和false
  - 条件表达式允许像for那样，对变量进行定义或者单纯赋值。如果是定义，那么只在该条件的逻辑块内有效
  - 强制了{}的分布只能一种情况

> 格式
```go
if [定义变量和赋值;]条件表达式1{

}else if [定义变量和赋值;]条件表达式2{

}else{

}
```


> demo
```go
func testif() {
	var a int
    var flag = 1
    // 单纯赋值
	if a = 1; flag == 1 {
		a = 99
		fmt.Println(a)
	} else if b := 3; flag == 2 {
        // 变量定义和赋值
		fmt.Println(b)
	}
	// 错误：
	// fmt.Println(b)
	// 99 print
	fmt.Println(a)
}
func main() {
	testif()
}
```

### switch
- 不用加`break` ，使用 `fallthrough` 后会继续运性行下一个case
- case表达式可以常量,变量，有返回值的函数
- switch后可以不带表达式，这样就类似于if...else的使用，带表达式的一般用于=的关系，而不带的可以用在< 和 >这种关系。
- TypeSwitch：switch语句还可用于type-switch来判断某个interface变量中实际指向的变量类型。
- [switch使用demo](demo/switch的使用.md)

> 格式
```go
switch [赋值语句;表达式]{
    case 表达式1:
        语句块
    case 表达式2:
        语句块
    default:
        语句块
}
```

## 循环语句
- 不需要括号
- 没有while

> 格式

- 写法1
```go
for 初始化;循环条件;循环迭代{
    语句块
}
```

- 写法2（相当于while)
```go
for 循环条件{
    语句块
}
```

- 写法3（配合break）
```go
for{

}
```
-写法4(用于遍历一些容器)
```go
// 数组
for index,val := range array{

}
```

# 函数
## 定义
- 返回值可以多个，`"_"`可以用来接收return
- 返回值可以像参数一样取名字，但是不要乱用，一般只用于函数体比较短的
- 基本数据类型和数组某人都是值床底，在func内修改，对元数据不影响。如果希望修改，传入变量的地址&，函数内以指针进行操作。
- 支持可变参数
- 不支持函数的重载

> 格式
- 写法1
```go
func 函数名(aname1[,aname2...] 类型a, bname1[,bname2...]类型b)(返回值类型列表){

}
```
- 写法2（可变参数）
```go
// 一般情况”类型“用的是interface
func 函数名(变量名 ... 类型){

}
```
## 参数传递
- go语言只有值传递一种
# 指针
- go的指针很简单
- 指针不能运算

# 复杂数据类型
## 数组
- [10]int和[20]int是不同的类型
- 数组是值类型：调用`func f(arr [10]int)`会拷贝数组
- golang中一般不用数组，而是用切片
- 数组的零值就是所有内部元素的零值
- [数组使用demo](demo/复杂类型的使用.md)
  - 定义
  - 初始化
  - 遍历

## Slice切片
- [Slice使用demo](demo/复杂类型的使用.md)
- 定义和初始化
  - 有三种方式
- array切片
  - array 转为 slice
- slice修改对Array的影响
  - 如果在没有对slice进行append导致底层扩容的话，slice修改，array也会修改
- reslice
  - 可以对Slice再进行slice
- slice的扩展
  - 切片可以向后扩展，这取决于cap
- slice的动态追加
  - 使用append可以追加多个元素，也可以直接追加一个slice
  - 追加可能导致底层扩容，扩容后不再指向原来的地址块
  - 使用append之后原来的slice无变化，所以要赋值。
  - cap每次的增长方式就是×2
- slice的容量长度获取
  - 使用cap和len
- slice的遍历
  - 和array一样
- slice copy
  - 不会扩容，容量有多大就拷贝装多大。
- slice的元素删除
  - 利用reslice和append，进行拼凑。支持从头，从中间，从末尾的删除
### 定义和初始化
  1. 从数组转切片
  2. 使用`make`
  3. `[]T` 一步到位
> 格式
- 写法1
  - `a[:]` 数组转切片
  - slice的底层指向的是数组a，slice中元素修改，a也修改
```go
var a = [...]int{0,1，2,3,4}
var s1 = a[1,3]
var s2 = a[:]
```
- 写法2
  - make([]T,len,cap)

```go
var s []int = make([]int, 4)
```
- 写法3
  
```go
var s = []int{1,3,5}
```

### slice和string

### 细节
- slice可以向后扩展，但是不可以向前扩展，向后扩展取决于cap
```go
var a = [...]int{0, 1, 2, 3, 4, 5, 6, 7}
s1 := a[2:6]
s2 := s1[3:5]
// Result：
// s1 =  [2 3 4 5]
// s2 =  [5 6]
```
<div align="center">
<img src="pic/1.png">
</div>

- slice可以看成是对底层array的一个view
- slice还可以继续切片
- slice的零值为nil
- slice内部实现，其底层有ptr，len，cap，如下图所示
<div align="center">
<img src="pic/2.png">
</div>

## map