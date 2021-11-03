```go
func det1() int {
	result := 2
	defer func() {
		result = 1
	}()
	return result
}

//change pointer in defer， result is 2
func det2() int {
	result := 2
	defer func(result *int) {
		*result = 1
	}(&result)
	return result
}

//use name result and change in defer， result is 1
func det3() (result int) {
	result = 2
	defer func() {
		result = 1
	}()
	return result
}

//return is pointer，result is 1
func det4() *int {
	result := 2
	defer func() {
		result = 1
	}()
	return &result
}

// 2
// 2
// 1
// 1
func main() {
	a := det1()
	b := det2()
	c := det3()
	d := det4()
	println(a)
	println(b)
	println(c)
	println(*d)
}
```