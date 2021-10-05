```go
// switch 带表达式
func testswitch1(a int) {
	var b int
	switch b = 3; a {
	case 1:
		fmt.Println(1)
	case 2:
		fmt.Println(2)
		fallthrough
	case 3:
		fmt.Println(3)
	default:
		fmt.Println("default")
		fmt.Println(b)
	}
}

// switch 不带表达式
func testswitch2(a int) {
	var b int
	switch b = 3; {
	case a == 1:
		fmt.Println(1)
	case a == 2:
		fmt.Println(2)
		fallthrough
	case a == 3:
		fmt.Println(3)
	default:
		fmt.Println("default")
		fmt.Println(b)
	}
}

// 类型断言
func typeswitch() {
	var x interface{}
	var y = 10.0
	x = y
	switch i := x.(type) {
	case nil:
		fmt.Println("x的类型是：%T", i)
	case int:
		fmt.Println("x的类型是int")
	case float64:
		fmt.Println("x的类型是float64")
	}
}

func main() {
	testswitch1(2)
	typeswitch()
}
```