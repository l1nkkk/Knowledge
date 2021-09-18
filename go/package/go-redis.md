> https://cloud.tencent.com/developer/article/1608750
> https://pkg.go.dev/github.com/go-redis/redis#Client.SetNX

- 测试连接性
```go
func testPong(){
	client := redis.NewClient(&redis.Options{
		Addr:     "127.0.0.1:6379",
		Password: "linqing000", // no password set
		DB:       0,           // use default DB
	})

	pong, err := client.Ping().Result()
	if err != nil {
		fmt.Println("reis 连接失败：", pong, err)
		return
	}
	fmt.Println("reis 连接成功：", pong)
}

```


- 存入数据
```go
func testSet(key string, value string)(err error){
	client := redis.NewClient(&redis.Options{
		Addr:     "127.0.0.1:6379",
		Password: "linqing000", // no password set
		DB:       0,           // use default DB
	})
	_, err = client.SetNX(key, value, 10*time.Hour).Result()
	return
}
```