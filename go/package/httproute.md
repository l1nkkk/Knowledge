- [Router](#Router)
- [demo](#demo)
# Router

```go
type Router struct {

    // If enabled, adds the matched route path onto the http.Request context
    // before invoking the handler.
    // The matched route path is only added to handlers of routes that were
    // registered when this option was enabled.
    // 如果启用，则在调用处理程序之前将匹配的路由路径添加到http.Request上下文中。
    // 匹配的路由路径仅添加到启用此选项时注册的路由的处理程序。 
    SaveMatchedRoutePath bool

    // Enables automatic redirection if the current route can't be matched but a
    // handler for the path with (without) the trailing slash exists.
    // For example if /foo/ is requested but a route only exists for /foo, the
    // client is redirected to /foo with http status code 301 for GET requests
    // and 308 for all other request methods.
    //如果无法匹配当前路由，但存在带有（不带）尾部斜杠的路径处理程序，则启用自动重定向。
     //例如，如果请求了/foo/，但仅针对/foo存在路由，则客户端将使用HTTP状态代码301重定向到/foo，以获取请求，将308状态返回到其他所有请求方法。
    RedirectTrailingSlash bool

    // If enabled, the router tries to fix the current request path, if no
    // handle is registered for it.
    // First superfluous path elements like ../ or // are removed.
    // Afterwards the router does a case-insensitive lookup of the cleaned path.
    // If a handle can be found for this route, the router makes a redirection
    // to the corrected path with status code 301 for GET requests and 308 for
    // all other request methods.
    // For example /FOO and /..//Foo could be redirected to /foo.
    // RedirectTrailingSlash is independent of this option.
    // 如果启用，则路由器将尝试修复当前请求路径（如果未为其注册句柄）。
    // 首先删除多余的路径元素，例如../或//。
    // 之后，路由器对清除的路径进行不区分大小写的查找。
    // 如果可以找到该路由的句柄，则路由器会使用GET请求的状态代码301和所有其他请求方法的状态代码308重定向到更正的路径。
    // 例如，/ FOO和/..//Foo可以重定向到/ foo。
    // RedirectTrailingSlash与该选项无关。
    RedirectFixedPath bool

    // If enabled, the router checks if another method is allowed for the
    // current route, if the current request can not be routed.
    // If this is the case, the request is answered with 'Method Not Allowed'
    // and HTTP status code 405.
    // If no other Method is allowed, the request is delegated to the NotFound
    // handler.
    // 如果启用，路由器将检查当前路由是否允许其他方法，如果当前请求不能被路由。
    // 如果是这种情况，则使用“不允许的方法”和HTTP状态代码405回答请求。
    // 如果不允许其他方法，则将请求委派给NotFound处理程序。
    HandleMethodNotAllowed bool

    // If enabled, the router automatically replies to OPTIONS requests.
    // Custom OPTIONS handlers take priority over automatic replies.
    // 如果启用，路由器将自动回复OPTIONS请求。
    // 自定义选项处理程序的优先级高于自动答复。
    HandleOPTIONS bool

    // An optional http.Handler that is called on automatic OPTIONS requests.
    // The handler is only called if HandleOPTIONS is true and no OPTIONS
    // handler for the specific path was set.
    // The "Allowed" header is set before calling the handler.
    // 在自动OPTIONS请求上调用的可选http.Handler。
    // 仅当HandleOPTIONS为true且没有OPTIONS时才调用处理程序
    // 设置了特定路径的处理程序。
    // 在调用处理程序之前，设置“允许”标头。
    GlobalOPTIONS http.Handler

    // Configurable http.Handler which is called when no matching route is
    // found. If it is not set, http.NotFound is used.
    // 未找到匹配路由时将调用的可配置的http.Handler。（指MethodNotAllowed） 如果未设置，则使用http.NotFound。
    NotFound http.Handler

    // Configurable http.Handler which is called when a request
    // cannot be routed and HandleMethodNotAllowed is true.
    // If it is not set, http.Error with http.StatusMethodNotAllowed is used.
    // The "Allow" header with allowed request methods is set before the handler
    // is called.
    // 可配置的http.Handler，当无法路由请求且HandleMethodNotAllowed为true时调用。
    // 如果未设置，则使用带有http.StatusMethodNotAllowed的http.Error。
    // 在调用处理程序之前设置带有允许的请求方法的“ Allow”标头。
    MethodNotAllowed http.Handler

    // Function to handle panics recovered from http handlers.
    // It should be used to generate a error page and return the http error code
    // 500 (Internal Server Error).
    // The handler can be used to keep your server from crashing because of
    // unrecovered panics.
    // 处理从http处理程序中恢复的紧急情况的功能。
    // 应该将其用于生成错误页面并返回http错误代码500（内部服务器错误）。
    // 处理程序可用于防止因未恢复的紧急情况而导致服务器崩溃。
    PanicHandler func(http.ResponseWriter, *http.Request, interface{})
    // contains filtered or unexported fields
}
```

# demo
```go
package main

import (
	"fmt"
	"github.com/julienschmidt/httprouter"
	"net/http"
)

/*
	demo1：最基本使用
*/

func gethome(w http.ResponseWriter, r *http.Request, ps httprouter.Params){
	fmt.Fprint(w,"hello ")
	fmt.Fprint(w,"world")
	fmt.Println(ps)
}

// input:http://127.0.0.1:8000/fefe
// output:[{name fefe}]
func getname(w http.ResponseWriter, r *http.Request, ps httprouter.Params){
	fmt.Fprint(w,"hello ")
	fmt.Fprint(w,"world12321")
	// ps本质上是一个切片，切片里存的是一个结构体，结构体里是key和value
	fmt.Println(ps)

}

func demo1(){
	r := httprouter.New()
	r.Handle("GET","/",gethome)
	r.Handle("GET","/:name",getname)
	if err := http.ListenAndServe(":8000",r);err == nil{
		return
	}
}



// ---------------demo1 end ....


/*
	demo2：CleanPath是啥子意思

	1. Replace multiple slashes with a single slash.
	2. Eliminate each . path name element (the current directory).
	3. Eliminate each inner .. path name element (the parent directory)
	   along with the non-.. element that precedes it.
	4. Eliminate .. elements that begin a rooted path:
	   that is, replace "/.." by "/" at the beginning of a path.

	1. 用单个斜杠替换多个斜杠。
	2. 消除每个.路径名元素（当前目录）。如/aa/.变为/aa
	3. 消除每个内部..路径名元素（父目录）
		以及之前的non-..元素。如 /aa/ww/..变为/aa
	4. 消除以..开头的根元素：
		也就是说在路径的开头用“ /”替换“ /..”。
*/


// res:	/feef/w/w
//		/feef../s
func demo2(){
	testlist :=[]string{
		"//feef//w//f/../w",
		"feef..//./s",
	}
	for _,test := range testlist{
		fmt.Println(httprouter.CleanPath(test))
	}

}

// ---------------demo2 end ....

/*
	demo3：ByName 是啥子意思
*/

// input:fefef/2d
// output: 2d
func getsex(w http.ResponseWriter, r *http.Request, ps httprouter.Params){
	fmt.Fprint(w,"hello ")
	fmt.Fprint(w,"world")
	fmt.Println(ps.ByName("sex"))
	//fmt.Println(httprouter.ParamsFromContext(context.TODO()))
}
func demo3(){
	r := httprouter.New()

	r.Handle("GET","/fefef/:sex",getsex)

	if err := http.ListenAndServe(":8000",r);err == nil{
		return
	}
}

// ---------------demo3 end ....


func main(){
	demo3()
}
```