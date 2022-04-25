> 方法集
```go
type Animal interface {
	Speak()
	Eat()
}

type Cat struct{}

func (c *Cat) Speak() {
	fmt.Println("miaomiao")
}

// 注意，T 而不是 *T
func (c Cat) Eat() {
	fmt.Println("cat eatting")
}

type Dog struct{}

func (c *Dog) Speak() {
	fmt.Println("wongwong")
}

func (c *Dog) Eat() {
	fmt.Println("dog eatting")
}

func Done(a Animal) {
	a.Eat()
	a.Speak()
}

func main() {
	var c Cat
	var d Dog

	// 下面注释部分编译不能通过
	// Done(c)
	// Done(d)

	// 注意，Done(&c)可以编译通过，原因在于方法集规则上
	Done(&c)
	Done(&d)
}
```



> 实例：commandline
```cpp
import (
	"flag"
	"fmt"
)

type Meter struct {
	data float64
}

// 输出，支持更人性化输出
func (m *Meter) String() string {
	return fmt.Sprintf("%fm", m.data)
}

// 输入，支持更人性化输入
func (m *Meter) Set(s string) error {
	var unit string
	fmt.Sscanf(s, "%f%s", &m.data, &unit)
	switch unit {
	case "m":
		return nil
	case "km":
		m.data *= 1000
		return nil
	}
	return fmt.Errorf("invalid in set")
}

func MeterFlag(name string, value Meter, usage string) *Meter {
	f := value
	flag.CommandLine.Var(&f, name, usage)
	return &f
}

var m = MeterFlag("dis", Meter{33}, "distance")

// $ go run method.go -dis 88km
// 88000.000000m
// $ go run method.go
// 33.000000m
func main() {
	flag.Parse()
	fmt.Println(m)
}

```

