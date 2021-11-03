```cpp
// 注意，err必须再返回值中定义
func f1(a int) (res int, err error) {
	defer func() {
		if p := recover(); p != nil {
			err = fmt.Errorf("divide 0")
		}
	}()
	res = 10 / a
	return res, err
}

func main() {
	if res, err := f1(0); err != nil {
		log.Default().Println(err)
	} else {
		fmt.Println(res)
	}
	fmt.Println("done")
}
```

> 有选择的恢复
```go
func f1(a int) (res int, err error) {
	defer func() {
		switch p := recover(); p {
		case nil:
		case mypanic{}:
			err = fmt.Errorf("my error")
		default:
			panic(p)
		}
	}()
	res = 10 / a
	return res, err
}
```