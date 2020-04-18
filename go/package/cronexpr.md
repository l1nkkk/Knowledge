> github.com/gorhill/cronexpr   
> 用来做一些定时任务的

- test1
  - 定时运行某一任务，支持秒级和年级

```go

func test1() {
	var (
		expr     *cronexpr.Expression
		err      error
		now      time.Time
		nextTime time.Time
	)
	// 分钟 小时 天 月 星期
	// 每个一分钟
	if expr, err = cronexpr.Parse("* * * * *"); err != nil {
		fmt.Print(err)
		return
	}
	// 其实比linux高级支持秒和年（2018-2099）
	if expr, err = cronexpr.Parse("*/3 * * * * * *"); err != nil {
		fmt.Print(err)
		return
	}
	// expr = expr

	now = time.Now()
	nextTime = expr.Next(now)
	fmt.Println(now, "------", nextTime)
	// 一定时间后执行function，nextTime和now都是duration
	time.AfterFunc(nextTime.Sub(now), func() {
		fmt.Println("be run:", nextTime)
	})
	fmt.Println("tag")
	time.Sleep(6 * time.Second)
	fmt.Println("test1 done")
}
```

- test2
```go
func test2() {

	var (
		expr    *cronexpr.Expression
		err     error
		eTask   *ExprTask
		taskMap map[string]*ExprTask
		now     time.Time
	)

	taskMap = make(map[string]*ExprTask, 20)
	// job1，5秒一次
	if expr, err = cronexpr.Parse("*/5 * * * * * *"); err != nil {
		fmt.Println(err)
		return
	}
	now = time.Now()
	eTask = &ExprTask{
		expr:    expr,
		nextime: expr.Next(now),
	}
	taskMap["job1"] = eTask
	// job2，3秒一次
	if expr, err = cronexpr.Parse("*/3 * * * * * *"); err != nil {
		fmt.Println(err)
		return
	}
	now = time.Now()
	eTask = &ExprTask{
		expr:    expr,
		nextime: expr.Next(now),
	}
	taskMap["job2"] = eTask

	go func() {
		var (
			et      *ExprTask
			jobname string
			now     time.Time
		)

		for {
			now = time.Now()
			for jobname, et = range taskMap {
				if et.nextime.Before(now) || et.nextime.Equal(now) {
					go func(jobname string) {
						fmt.Printf("%s:被调用\n", jobname)
					}(jobname)
					et.nextime = et.expr.Next(now)
					fmt.Println(jobname, ":下次执行时间--", et.nextime)
				}
			}

			// 暂停
			select {
            // NewTimer creates a new Timer that will send the current time on its channel after at least duration d.
            // 没100 ms就会有一个对象进入管道
			case <-time.NewTimer(100 * time.Millisecond).C:
			}
		}
	}()
	time.Sleep(100 * time.Second)
}

```