

#

# 基准测试
- 如果你有一个基准测试，它运行数百万次或数十亿次迭代，每次操作的时间都在微秒或纳秒级，那么你可能会发现基准测试结果不稳定，因为热缩放、内存局部性、后台处理、gc活动等等。


- 避免基准测试的启动成本
  - 有时候每次基准测试运行前都有一些初始化操作。 b.ResetTimer()将让你跳过这些运行时间。
  - 如果每次循环迭代内部都有一些高成本的其他逻辑，请使用b.StopTimer()和b.StartTimer()来暂停基准计时器。
```go
func BenchmarkExpensive(b *testing.B) {
    boringAndExpensiveSetup()
    b.ResetTimer() // HL
    for n := 0; n < b.N; n++ {
            // 被测试的功能
    }
}

func BenchmarkComplicated(b *testing.B) {
    for n := 0; n < b.N; n++ {
        b.StopTimer() // HL
        complicatedSetup()
        b.StartTimer() // HL
        // 被测试的功能
    }
}
```
- 有三个方法用于计时：
  - `StartTimer` ：开始对测试进行计时。该方法会在基准测试开始时自动被调用，我们也可以在调用 StopTimer 之后恢复计时；
  - `StopTimer` ：停止对测试进行计时。当你需要执行一些复杂的初始化操作，并且你不想对这些操作进行测量时，就可以使用这个方法来暂时地停止计时；
  - `ResetTimer` ：对已经逝去的基准测试时间以及内存分配计数器进行清零。对于正在运行中的计时器，这个方法不会产生任何效果。本节开头有使用示例。
## 命令
- `go test -bench=.`
  - 默认情况下，当你调用go test时，基准测试是不执行的
  -  -bench 接收一个与待运行的基准测试名称相匹配的正则表达式，`.` 表示运行所有基准测试。
- `-benchtime=`
  - 默认是1s，控制基准测试循环次数。
  - 工作原理：`b.N `从 1 开始，如果基准测试函数在**1秒内**就完成 (默认值)，则 `b.N` 增加，并再次运行基准测试函数。`b.N` 在近似这样的序列中不断增加；**1, 2, 3, 5, 10, 20, 30, 50, 100** 等等。 
- `-run=none`
  - 过滤掉单元测试的输出，这里使用**none**，因为我们基本上不会创建这个名字的单元测试方法
  - `go test` 会在运行基准测试之前之前执行包里所有的单元测试，所有如果你的包里有很多单元测试，或者它们会运行很长时间，你也可以通过 `go test 的-run `标识排除这些单元测试，不让它们执行； 比如： `go test -run=^$`。
- `-benchmem`
  - 可以提供每次操作分配内存的次数，以及每次操作分配的字节数。
- `-cpu=`
  - 基准测试时CPU数
- `-count=`
  - 运行多次基准测试

## demo1：Itoa多种方法的性能测试
- https://www.flysnow.org/2017/05/21/go-in-action-go-benchmark-test.html
> 从BenchmarkSprintf中可看出的规则
1. 基准测试的代码文件必须以**_test.go结尾**
2. 基准测试的函数必须以**Benchmark**开头，必须是可导出的
3. 基准测试函数必须接受一个指向Benchmark类型的指针作为唯一参数
4. 基准测试函数不能有返回值
5. **`b.ResetTimer`是重置计时器**，这样可以避免for循环之前的初始化代码的干扰
6. 最后的for循环很重要，被测试的代码要放到循环里
7. `b.N`是基准测试框架提供的，表示循环的次数，因为需要反复调用测试的代码，才可以评估性能

----

```go
func BenchmarkSprintf(b *testing.B){
	num := int64(10)
	b.ResetTimer()
	for i:=0; i < b.N; i++{
		fmt.Sprintf("%d", num)
	}
}
func BenchmarkFormatInt(b *testing.B){
	num := int64(10)
	b.ResetTimer()
	for i:=0; i < b.N; i++{
		strconv.FormatInt(num,10)
	}
}
func BenchmarkItoa(b *testing.B){
	num := 10
	b.ResetTimer()
	for i:=0; i < b.N; i++{
		strconv.Itoa(num)
	}
}
```
- 结果
```
$ go test -bench=. -run=none -benchmem
goos: linux
goarch: amd64
pkg: github.com/jo3yzhu/yaney/test
cpu: Intel(R) Core(TM) i7-8550U CPU @ 1.80GHz
BenchmarkSprintf-8      17266064                65.94 ns/op            2 B/op          1 allocs/op
BenchmarkFormatInt-8    458760657                2.542 ns/op           0 B/op          0 allocs/op
BenchmarkItoa-8         438113790                2.693 ns/op           0 B/op          0 allocs/op
PASS
ok      github.com/jo3yzhu/yaney/test   4.102s

```
> 结果分析
- 重点各个字段含义
  - `-8`:表示运行时对应的GOMAXPROCS的值
  - `17266064`：表示运行了17266064次循环
  - `65.94 ns/op`：平均每次耗时
  - `2 B/op`：每次内存分配大小
  - `1 allocs/op`:内存分配次数

## demo2：编译优化
- https://segmentfault.com/a/1190000016354758

```go
const m1 = 0x5555555555555555
const m2 = 0x3333333333333333
const m4 = 0x0f0f0f0f0f0f0f0f
const h01 = 0x0101010101010101

func popcnt(x uint64) uint64 {
	x -= (x >> 1) & m1
	x = (x & m2) + ((x >> 2) & m2)
	x = (x + (x >> 4)) & m4
	return (x * h01) >> 56
}

func BenchmarkPopcnt(b *testing.B) {
	for i := 0; i < b.N; i++ {
		popcnt(uint64(i))
	}
}
```
- 结果
```
$ go test -bench=. -run=none -benchmem -benchtime=2s      
goos: linux
goarch: amd64
pkg: github.com/jo3yzhu/yaney/test
cpu: Intel(R) Core(TM) i7-8550U CPU @ 1.80GHz
BenchmarkPopcnt-8       1000000000               0.2702 ns/op          0 B/op          0 allocs/op
PASS
ok      github.com/jo3yzhu/yaney/test   0.305s
```

> 分析
- 0.3 纳秒，这基本上是一个时钟周期。即使假设CPU每个时钟周期内会执行多条指令，这个数字似乎也不合理地低。 发生了什么？

- 要了解发生了什么，我们必须看看benchmark下的函数popcnt。  popcnt是一个叶子函数 - 它不调用任何其他函数 - 因此编译器可以内联它。

- 因为函数是内联的，所以编译器现在可以看到它没有副作用。  popcnt不会影响任何全局变量的状态。 这样，调用就被消除了。 这是编译器看到的：
```go
func BenchmarkPopcnt(b *testing.B) {
    for i := 0; i < b.N; i++ {
            // 优化了
    }
}
```
- 在所有版本的Go编译器上，仍然会生成循环。 但是英特尔CPU非常擅长优化循环，尤其是空循环。



# 参考
> https://www.flysnow.org/2017/05/21/go-in-action-go-benchmark-test.html
> https://segmentfault.com/a/1190000016354758
> https://books.studygolang.com/The-Golang-Standard-Library-by-Example/chapter09/09.2.html