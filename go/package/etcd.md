> go.etcd.io/etcd/mvcc/mvccpb  
> go.etcd.io/etcd/clientv3

对etcd的操作，增删改查，事务，租约，监视，分布式锁


- demo1
  - 连接
```go
func demo1() {
	var (
		config clientv3.Config
		client *clientv3.Client
		err    error
	)
    fmt.Print("123")
    // 指定etcd连接目标，以及超时时间，生成连接用的配置信息
	config = clientv3.Config{
		Endpoints:   []string{"39.107.83.89:2379"},
		DialTimeout: 5 * time.Second,
    }
    // 连接
	if client, err = clientv3.New(config); err != nil {
		log.Print(err)
		return
	}
	fmt.Println("done")
	client = client
}
```

- demo2
  - 增：clientv3.NewKV进行操作
```go

func demo2() {
	var (
		config clientv3.Config
		client *clientv3.Client
		err    error
		kv     clientv3.KV
		putRsp *clientv3.PutResponse
	)
	// 配置
	config = clientv3.Config{
		// Endpoints:   []string{"149.28.202.210:2379"},
		Endpoints:   []string{"39.107.83.89:2379"},
		DialTimeout: 5 * time.Second,
	}
	// 创建客户端
	if client, err = clientv3.New(config); err != nil {
		log.Println(err)
		return
	}
	// 用于读写键值对
	kv = clientv3.NewKV(client)

	if putRsp, err = kv.Put(context.TODO(), "/cron/jobs/job1", "hello"); err != nil {
		log.Println(err)
		return
	} else {
		//
		fmt.Println("Revision", putRsp.Header.Revision)
	}
	fmt.Println("demo2 done")
}
```

- demo3
  - 增，且取回被替换的
```go
func demo3() {
	var (
		config clientv3.Config
		client *clientv3.Client
		err    error
		kv     clientv3.KV
		putRsp *clientv3.PutResponse
	)
	// 配置
	config = clientv3.Config{
		// Endpoints:   []string{"149.28.202.210:2379"},
		Endpoints:   []string{"39.107.83.89:2379"},
		DialTimeout: 5 * time.Second,
	}
	// 创建客户端
	if client, err = clientv3.New(config); err != nil {
		log.Println(err)
		return
	}
	// 用于读写键值对
	kv = clientv3.NewKV(client)
    // 必须加上clientv3.WithPrevKV()可选项，putRsp.PrevKv才有值
    // putRsp存放被替换的值
	if putRsp, err = kv.Put(context.TODO(), "/cron/jobs/job1", "hello3333", clientv3.WithPrevKV()); err != nil {
		log.Println(err)
		return
	} else {
		//
		fmt.Println("Revision:", putRsp.Header.Revision)
		if putRsp.PrevKv != nil {
			fmt.Println("PreValue:", string(putRsp.PrevKv.Value))
		}
	}

}
```

- demo4
  - 查
```go
func demo4() {
	var (
		config clientv3.Config
		client *clientv3.Client
		err    error
		kv     clientv3.KV
		getRsp *clientv3.GetResponse
	)
	// 配置
	config = clientv3.Config{
		// Endpoints:   []string{"149.28.202.210:2379"},
		Endpoints:   []string{"39.107.83.89:2379"},
		DialTimeout: 5 * time.Second,
	}
	// 创建客户端
	if client, err = clientv3.New(config); err != nil {
		log.Println(err)
		return
	}
	// 用于读写键值对
	kv = clientv3.NewKV(client)

	if getRsp, err = kv.Get(context.TODO(), "/cron/jobs/job1"); err != nil {
		log.Println(err)
	} else {
		// create_revision：创造时的版本号
		// mod_revision:最后修改的版本号
		// version:修改的次数
		fmt.Println(getRsp.Kvs)
	}

}
```

- demo5
  - 查，读取某一前缀所有值
```go
func demo5() {
	var (
		config clientv3.Config
		client *clientv3.Client
		err    error
		kv     clientv3.KV
		getRsp *clientv3.GetResponse
	)
	// 配置
	config = clientv3.Config{
		// Endpoints:   []string{"149.28.202.210:2379"},
		Endpoints:   []string{"39.107.83.89:2379"},
		DialTimeout: 5 * time.Second,
	}
	// 创建客户端
	if client, err = clientv3.New(config); err != nil {
		log.Println(err)
		return
	}
	// 用于读写键值对
	kv = clientv3.NewKV(client)

	kv.Put(context.TODO(), "/cron/jobs/job2", "hhhh")

	if getRsp, err = kv.Get(context.TODO(), "/cron/jobs", clientv3.WithPrefix()); err != nil {
		log.Println(err)
	} else {
		// create_revision：创造时的版本号
		// mod_revision:最后修改的版本号
		// version:修改的次数
		fmt.Println(getRsp.Kvs)
	}

}

```

- demo6
  - 删除,并显示删除前的kv

```go
func demo6() {
	var (
		config clientv3.Config
		client *clientv3.Client
		err    error
		kv     clientv3.KV
		delRsp *clientv3.DeleteResponse
		kvPair *mvccpb.KeyValue
	)
	// 配置
	config = clientv3.Config{
		// Endpoints:   []string{"149.28.202.210:2379"},
		Endpoints:   []string{"39.107.83.89:2379"},
		DialTimeout: 5 * time.Second,
	}
	// 创建客户端
	if client, err = clientv3.New(config); err != nil {
		log.Println(err)
		return
	}
	// 用于读写键值对
	kv = clientv3.NewKV(client)

	kv.Put(context.TODO(), "/cron/jobs/job2", "hhhh")

	// deleted：表示删除的个数
	// PrevKvs：存储删除之前的值
	if delRsp, err = kv.Delete(context.TODO(), "/cron/jobs/job2", clientv3.WithPrevKV()); err != nil {
		fmt.Println(err)
	} else {

		if len(delRsp.PrevKvs) != 0 {
			for _, kvPair = range delRsp.PrevKvs {
				fmt.Println("删除了...", string(kvPair.Key), ":", string(kvPair.Value))
			}
		}
	}

}
```

- demo7
  - 删除某一前缀的多个

```go
func demo7() {
	var (
		config clientv3.Config
		client *clientv3.Client
		err    error
		kv     clientv3.KV
		delRsp *clientv3.DeleteResponse
		kvPair *mvccpb.KeyValue
	)
	// 配置
	config = clientv3.Config{
		// Endpoints:   []string{"127.0.0.1:2379"},
		Endpoints:   []string{"127.0.0.1:2379"},
		DialTimeout: 5 * time.Second,
	}
	// 创建客户端
	if client, err = clientv3.New(config); err != nil {
		log.Println(err)
		return
	}
	// 用于读写键值对
	kv = clientv3.NewKV(client)

	kv.Put(context.TODO(), "/cron/jobs/job2", "hhhh")

	// 删除前缀
	// if delRsp, err = kv.Delete(context.TODO(), "/cron/jobs/job2", clientv3.WithPrefix()); err != nil {
	// 从这个key开始删两个
	if delRsp, err = kv.Delete(context.TODO(), "/cron/jobs/job2", clientv3.WithFromKey(), clientv3.WithLimit(2)); err != nil {
		fmt.Println(err)
	} else {

		if len(delRsp.PrevKvs) != 0 {
			for _, kvPair = range delRsp.PrevKvs {
				fmt.Println("删除了...", string(kvPair.Key), ":", string(kvPair.Value))
			}
		}
	}

}

```

- demo8
  - 租约

```go
func demo8() {
	var (
		cfg         clientv3.Config
		client      *clientv3.Client
		lease       clientv3.Lease
		lgp         *clientv3.LeaseGrantResponse
		err         error
		leaseid     clientv3.LeaseID
		kv          clientv3.KV
		putRsp      *clientv3.PutResponse
		getRsp      *clientv3.GetResponse
		keepRsp     *clientv3.LeaseKeepAliveResponse
		keepRspChan <-chan *clientv3.LeaseKeepAliveResponse
	)

	cfg = clientv3.Config{
		Endpoints:   []string{"127.0.0.1:2379"},
		DialTimeout: 5 * time.Second,
	}
	if client, err = clientv3.New(cfg); err != nil {
		log.Println(err)
		return
	}

	// 申请一个能生成租约的对象
	lease = clientv3.NewLease(client)

	// 生成租约，3为过期时间，3s过期
	if lgp, err = lease.Grant(context.TODO(), 3); err != nil {
		log.Println(err)
		return
	}
	leaseid = lgp.ID

	// 续租
	// keepRspChan投递续约后的响应
	if keepRspChan, err = lease.KeepAlive(context.TODO(), leaseid); err != nil {
		log.Println(err)
		return
	}

	go func() {
		for {
			select {
			case keepRsp = <-keepRspChan:
				// 网络异常，或者context被cancel
				if keepRsp == nil {
					fmt.Println("租约已经结束")
					goto END
				} else {
					// 租约id打印
					fmt.Println("收到自动续租应答", keepRsp.ID)
				}

			}
		}
	END:
	}()

	// 获取kvAPI子集
	kv = clientv3.NewKV(client)
	if putRsp, err = kv.Put(context.TODO(), "/cron/lock/job1", "linqing", clientv3.WithLease(leaseid)); err != nil {
		fmt.Println(err)
		return
	} else {
		fmt.Printf("写入成功:version-%d", putRsp.Header.Revision)
	}

	for {
		if getRsp, err = kv.Get(context.TODO(), "/cron/lock/job1"); err != nil {
			fmt.Println(err)
			return
		}
		if getRsp.Count != 0 {
			fmt.Println("数据还在:", getRsp.Kvs)
		} else {
			fmt.Println("数据不在了")
			return
		}
		time.Sleep(2 * time.Second)
	}
}
```

- demo9
  - 监视
```go
func demo9() {
	var (
		cfg    clientv3.Config
		client *clientv3.Client
		// lease       clientv3.Lease
		// lgp         *clientv3.LeaseGrantResponse
		err error
		// leaseid     clientv3.LeaseID
		kv clientv3.KV
		// putRsp      *clientv3.PutResponse
		getRsp *clientv3.GetResponse
		// keepRsp     *clientv3.LeaseKeepAliveResponse
		// keepRspChan <-chan *clientv3.LeaseKeepAliveResponse
		watchStartRevision int64
		watcher            clientv3.Watcher
		watchRspChan       clientv3.WatchChan
		watchRsp           clientv3.WatchResponse
		event              *clientv3.Event
	)

	cfg = clientv3.Config{
		Endpoints:   []string{"127.0.0.1:2379"},
		DialTimeout: 5 * time.Second,
	}
	if client, err = clientv3.New(cfg); err != nil {
		log.Println(err)
		return
	}
	// 初始化kv对象
	kv = clientv3.NewKV(client)

	// 模拟对数据的操作
	// go func() {
	// 	for {
	// 		kv.Put(context.TODO(), "/cron/jobs/job7", "i am job7")
	// 		kv.Delete(context.TODO(), "/cron/jobs/job7")
	// 		time.Sleep(1 * time.Second)
	// 	}
	// }()

	// 先get当前值
	if getRsp, err = kv.Get(context.TODO(), "/cron/jobs/", clientv3.WithPrefix()); err != nil {
		fmt.Println(err)
		return
	}

	// if len(getRsp.Kvs) != 0 {
	// 	fmt.Println("当前值：", string(getRsp.Kvs[0].Value))

	// }
	// 当前etcd集群事务id，单调递增+1
	watchStartRevision = getRsp.Header.Revision + 1

	// 创建一个可以用来创造watch的对象
	watcher = clientv3.NewWatcher(client)

	// 返回一个投递监控信息返回的管道
	watchRspChan = watcher.Watch(context.TODO(), "/cron/jobs/", clientv3.WithRev(watchStartRevision), clientv3.WithPrefix())

	var i int
	for watchRsp = range watchRspChan {
		fmt.Printf("Watch Rsp:%d\n", i)
		i++
		for _, event = range watchRsp.Events {
			switch event.Type {
			case mvccpb.PUT:
				fmt.Println("修改为：", string(event.Kv.Value), "Revision", event.Kv.CreateRevision, event.Kv.ModRevision)

			case mvccpb.DELETE:
				fmt.Println("删除了", "Revison:", event.Kv.ModRevision)
			}
		}
	}
	fmt.Printf("end")
}
```

- demo
  - 采用这个库提供的面向对象的方式，来操作
```go
func demo10() {
	var (
		cfg    clientv3.Config
		client *clientv3.Client
		opResp clientv3.OpResponse
		err    error
		kv     clientv3.KV
		putOp  clientv3.Op
		getOp  clientv3.Op
	)

	cfg = clientv3.Config{
		Endpoints:   []string{"127.0.0.1:2379"},
		DialTimeout: 5 * time.Second,
	}
	if client, err = clientv3.New(cfg); err != nil {
		log.Println(err)
		return
	}
	kv = clientv3.NewKV(client)

	// 创建op
	putOp = clientv3.OpPut("/cron/jobs/job8", "linuuuu")
	// 执行op
	if opResp, err = kv.Do(context.TODO(), putOp); err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println("写入Revision：", opResp.Put().Header.Revision)

	getOp = clientv3.OpGet("/cron/jobs/job8")
	if opResp, err = kv.Do(context.TODO(), getOp); err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("数据Revision：", opResp.Get().Kvs[0].ModRevision)
	fmt.Println("数据Value：", string(opResp.Get().Kvs[0].Value))
}
```

- demo11
```go

func demo11() {

	var (
		cfg                   clientv3.Config
		client                *clientv3.Client
		err                   error
		kv                    clientv3.KV
		lease                 clientv3.Lease
		leaseGrantRsp         *clientv3.LeaseGrantResponse
		leaseId               clientv3.LeaseID
		leaseKeepAliveRsp     *clientv3.LeaseKeepAliveResponse
		leaseKeepAliveRspChan <-chan *clientv3.LeaseKeepAliveResponse
		ctx                   context.Context
		cancelFunc            context.CancelFunc
		txn                   clientv3.Txn
		txnRsp                *clientv3.TxnResponse
		// putOp  clientv3.Op
		// getOp  clientv3.Op
	)
	cfg = clientv3.Config{
		Endpoints:   []string{"127.0.0.1:2379"},
		DialTimeout: 5 * time.Second,
	}
	if client, err = clientv3.New(cfg); err != nil {
		log.Println(err)
		return
	}
	kv = clientv3.NewKV(client)

	// 1.上锁(创建租约, 自动续租, 拿着租约去抢占一个key)
	// 得到申请租约的对象
	lease = clientv3.NewLease(client)

	// 获取一个5秒的租约
	if leaseGrantRsp, err = lease.Grant(context.TODO(), 5); err != nil {
		log.Println(err)
		return
	}
	leaseId = leaseGrantRsp.ID

	ctx, cancelFunc = context.WithCancel(context.TODO())

	// 3.释放锁
	// 第一个defer为放弃续租
	// 第二个为清除与租约id有关的key

	defer lease.Revoke(context.TODO(), leaseId)
	defer cancelFunc()
	// 自动续约
	if leaseKeepAliveRspChan, err = lease.KeepAlive(ctx, leaseId); err != nil {
		log.Println(err)
		return
	}
	// 测试用
	goto SKIP
	// 续约管道监控
	go func() {
		for {
			select {
			case leaseKeepAliveRsp = <-leaseKeepAliveRspChan:
				if leaseKeepAliveRsp == nil {
					fmt.Println("续租结束。")
					goto END
				} else {
					fmt.Println("续约：", leaseGrantRsp.ID)
				}
			}
		}
	END:
	}()
SKIP:
	// 创建事务
	txn = kv.Txn(context.TODO())

	//  if 不存在key， then 设置它, else 抢锁失败
	// 创造版本号为0，说明不存在key
	txn.If(clientv3.Compare(clientv3.CreateRevision("/cron/lock/job9"), "=", 0)).
		Then(clientv3.OpPut("/cron/lock/job9", "L1NKKK", clientv3.WithLease(leaseId))).
		Else(clientv3.OpGet("/cron/lock/job9"))

	// 提交事务
	if txnRsp, err = txn.Commit(); err != nil {
		log.Println(err)
		return
	}

	// 判断是否抢到了锁key
	if !txnRsp.Succeeded {
		fmt.Println("锁被占用：", string(txnRsp.Responses[0].GetResponseRange().Kvs[0].Value))
		return
	}

	// 2.处理业务
	fmt.Println("业务处理中。。。")
	time.Sleep(1000 * time.Second)
	fmt.Println("done")
}

```