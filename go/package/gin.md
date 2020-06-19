> 来源1：https://www.jianshu.com/p/a31e4ee25305
# demo1---路由和路由参数


```go
func demo1() {
    // 1.创建路由
    router := gin.Default()
    // 2.绑定路由规则和函数

    // 接口1
    // test: curl 127.0.0.1:8000/
    router.GET("/", func(c *gin.Context) {
        //将字符串写入响应体中。
        c.String(http.StatusOK, "hello world\n")
    })

    // 接口2
    // test:  curl 127.0.0.1:8000/user/123
    // 不能够处理：curl http://127.0.0.1:8000/user/rsj217/
    router.GET("/user/:name", func(c *gin.Context) {
        // Slice： [{name 123}]
        fmt.Println(c.Params)
        name := c.Param("name")
        c.String(http.StatusOK, "hello %s\n", name)
    })

    // 接口3
    // test:curl 127.0.0.1:8000/user/123/china
    router.GET("/user/:name/*action", func(c *gin.Context) {
        name := c.Param("name")
        action := c.Param("action")
        msg := name + " is " + action + "\n"
        c.String(http.StatusOK, msg)
    })
    router.Run(":8000")
}
```

## 涉及
> func Default
- `func Default() *Engine`
- `Default` 创建一个路由handler
- 该函数返回了一个带有日志和复原的中间件的Engine

> func Get
- `func (group *RouterGroup) GET(relativePath string, handlers ...HandlerFunc) IRoutes`
- router.Handle("GET", path, handle) 的简便方式
- 通过HTTP 方法绑定 路由和路由函数

> gin.Context
- gin 对net/http进行了封装 把request和response都封装在了`gin.Context`中

> func Run
- `func (*Engine) Run`
- 带来了http.Server路由，使程序开始监听和服务HTTP请求
- 这个方法会无限期的阻塞所调用的Goroutine，除非发生错误
- 通过`Run`绑定监听端口启动路由

> *和:
- `":"`：相比较不太灵活
  - eg: `/user/:name`。 /user/rsj217，和/user/hello都可以匹配，而/user/和/user/rsj217/不会被匹配。
- `"*"`:比较灵活
  - eg: `/user/*name`。/user/rsj217，/user/hello，/user/和/user/rsj217/都会被匹配。
> func (*Context) Param 
- c.Params.ByName(key)的简便形式
- 用来获取url param的值，同`*`和`:`配合


## 测试
```sh
l1nkkk@l1nkkk-TM1701:~$ curl 127.0.0.1:8000/
hello world
l1nkkk@l1nkkk-TM1701:~$ curl 127.0.0.1:8000/user/123
hello 123
l1nkkk@l1nkkk-TM1701:~$ curl 127.0.0.1:8000/user/123/china
123 is /china
```

# demo2---query string参数与body参数
web提供的服务通常是client和server的交互，**其中客户端向服务器发送请求，除了路由参数，其他的参数无非两种，查询字符串query string和报文体body参数。** 所谓query string，即路由用，用?以后连接的key1=value2&key2=value2的形式的参数。当然这个key-value是经过urlencode编码。
