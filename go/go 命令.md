# go build
`go build`命令用于**编译我们指定的源码文件或代码包以及它们的依赖包。**  
go build命令在编译**只包含库源码文件的代码包**（或者同时编译多个代码包）时，只会做检查性的编译，而不会输出任何结果文件。
## go 三类源码文件
golang源码文件有三类：
**命令源码文件**、**库源码文件**和**测试源码文件**
- 命令源码文件：有main函数的文件
- 库源码文件：用于集中放置各种待被使用的程序实体（全局常量、全局变量、接口、结构体、函数等等）
- 测试源码文件：后缀为test的文件
## 使用方法
1. 场景：想编译goc2p项目的代码包logging。  
因为在代码包logging中只有库源码文件和测试源码文件，所以在执行go build命令之后不会在当前目录和goc2p项目的pkg目录中产生任何文件 
- 其中一个方法是进入logging目录并直接执行该命令  
  `hc@ubt:~/golang/goc2p/src/logging$ go build`
- 另外一种编译logging包的方法是：
  `hc@ubt:~/golang/goc2p/src$ go build logging`

2. 场景：编译多个源码文件
- `hc@ubt:~/golang/goc2p/src$ go build logging/base.go logging/console_logger.go logging/log_manager.go logging/tag.go`  
  注：**使用这种方法会有一个限制。作为参数的多个Go源码文件必须在同一个目录中。比如上面的都是logging**。不过别担心，在需要的时候，那些被编译目标依赖的代码包会被go build命令自动的编译。例如，如果有一个导入路径为app的代码包，同时依赖了logging包和basic包。那么在执行go build app的时候，该命令就会自动的在编译app包之前去检查logging包和basic包的编译状态。如果发现它们的编译结果文件不是最新的，那么该命令就会先去的编译这两个代码包，然后再编译app包。
## 虚拟代码包
```
hc@ubt:~/golang/goc2p/src/cmd$ go build showds.go initpkg_demo.go
# command-line-arguments
./initpkg_demo.go:19: main redeclared in this block
        previous declaration at ./showds.go:56
```
command-line-arguments：命令程序在分析参数的时候**如果发现第一个参数是Go源码文件而不是代码包，则会在内部生成一个虚拟代码包。**（注：比如是showd.go不是logging）这个虚拟代码包的导入路径和名称都会是command-line-arguments。在其他基于编译流程的命令程序中也有与之一致的操作，比如go install命令和go run命令。
