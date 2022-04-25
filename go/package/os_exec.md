> exec包执行外部命令。它包装了os.StartProcess函数以便更容易的修正输入和输出，使用管道连接I/O，以及作其它的一些调整。  
> 中文文档：https://studygolang.com/pkgdoc

> test1
- 无获取输出
```go
func test1() {
	var (
		cmd *exec.Cmd
	)

	cmd = exec.Command("/bin/bash", "-c", "sleep 2;ls -l")

	if err := cmd.Run(); err != nil {
		fmt.Print(err)
		return
	}
	fmt.Println("done test1")
}

```

> test2
- 有获取输出
```go
func test2() {
	var (
		cmd *exec.Cmd
	)

	cmd = exec.Command("/bin/bash", "-c", "sleep2;ls -l")

	if out, err := cmd.CombinedOutput(); err != nil {
		fmt.Print(err)
		return
	} else {
		fmt.Print(string(out))
	}
}
```

> test3
- 可控，可强杀
- 异步

```go
type binres struct {
	err error
	out []byte
}

// 执行一个cmd命令，让其执行一段时间以后，强制关闭。
func test3() {
	var (
		cmd        *exec.Cmd
		resChan    chan binres
		ctx        context.Context
		cancelFunc context.CancelFunc
		res        binres
	)
	resChan = make(chan binres, 1000)

	// 继承TODO这个上下文
	ctx, cancelFunc = context.WithCancel(context.TODO())

	// ctx其实里边有一个chan
	// cancelFunc会把chan关闭
	go func() {
		var (
			bres binres
		)
		// 内部维护ctx，用select监听chan；select{case<-ctx.Done();}

		cmd = exec.CommandContext(ctx, "/bin/bash", "-c", "sleep 2;ls -l")
		bres.out, bres.err = cmd.CombinedOutput()
		resChan <- bres
	}()
	time.Sleep(1 * time.Second)
	cancelFunc()
	res = <-resChan
	fmt.Printf("err: %v\nout: %v", res.err, res.out)
}
```