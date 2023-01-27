
# demo1
```go
package main

import "fmt"

func updateSlice(s []int) {
	s[0] = 100
}

// 对数组/切片的各种切片姿势
// arr[2:6] =  [2 3 4 5]
// arr[:6] =  [0 1 2 3 4 5]
// arr[2:] =  [2 3 4 5 6 7]
// arr[:] =  [0 1 2 3 4 5 6 7]
func testSlice1() {
	// 1. 初始化数组
	var a = [...]int{0, 1, 2, 3, 4, 5, 6, 7}
	// 2. 数组---》Slice
	fmt.Println("-------------testSlice 1")
	fmt.Println("arr[2:6] = ", a[2:6])
	fmt.Println("arr[:6] = ", a[:6])
	fmt.Println("arr[2:] = ", a[2:])
	fmt.Println("arr[:] = ", a[:])
}

// 切片后的数据是否是copy的？还是共享的？
// arr[2:] =  [2 3 4 5 6 7]
// arr[:] =  [0 1 2 3 4 5 6 7]
// Update s1:
// s1: [100 3 4 5 6 7]
// s2: [0 1 100 3 4 5 6 7]
// Update s2:
// s1: [100 3 4 5 6 7]
// s2: [100 1 100 3 4 5 6 7]
// ReSlice:
// [100 1 100 3 4]
// [100 3 4]
// Extending slice
// s1 =  [2 3 4 5]
// s2 =  [5 6]
func testSlice2() {
	// 1. 初始化数组
	var a = [...]int{0, 1, 2, 3, 4, 5, 6, 7}
	// 2. 数组---》Slice
	fmt.Println("-----------testSlice 2")

	fmt.Println("arr[2:] = ", a[2:])
	s1 := a[2:]
	fmt.Println("arr[:] = ", a[:])
	s2 := a[:]

	fmt.Println("Update s1:")
	// 3.修改切片里的元素值
	updateSlice(s1)
	fmt.Println("s1:", s1)
	fmt.Println("s2:", s2)

	fmt.Println("Update s2:")
	// 3.修改切片里的元素值
	updateSlice(s2)
	fmt.Println("s1:", s1)
	fmt.Println("s2:", s2)

	// 4. Slice再切片
	fmt.Println("ReSlice:")
	s2 = s2[:5]
	fmt.Println(s2)
	s2 = s2[2:]
	fmt.Println(s2)
	// 5. Slice扩展
	fmt.Println("Extending slice")
	a[0], a[2] = 0, 2
	s1 = a[2:6]
	s2 = s1[3:5]
	fmt.Println("s1 = ", s1)
	fmt.Println("s2 = ", s2)

}

// 增加元素，对slice容量的影响
// s1 = [0 0 0 0 0 0 0], cap = 10,len = 7
// s2 = [1 2 3 4], cap = 4,len = 4
// After S2 append:
// s2 = [1 2 3 4 100 200 300], cap = 8,len = 7
// After  S2 append To S1:
// s1 = [0 0 0 0 0 0 0 1 2 3 4 100 200 300], cap = 20,len = 14
func testSlice3() {
	fmt.Println("-----------testSlice 3")
	// 1. 定义和初始化
	var s1 = make([]int, 7, 10)
	var s2 = []int{1, 2, 3, 4}
	// 2. 打印cap和len
	fmt.Printf("s1 = %v, cap = %d,len = %d\n", s1, cap(s1), len(s1))
	fmt.Printf("s2 = %v, cap = %d,len = %d\n", s2, cap(s2), len(s2))
	// 3. append
	fmt.Println("After S2 append:")
	s2 = append(s2, 100, 200, 300)
	fmt.Printf("s2 = %v, cap = %d,len = %d\n", s2, cap(s2), len(s2))
	// 3-1. 切片追加到切片
	fmt.Println("After  S2 append To S1:")
	s1 = append(s1, s2...)
	fmt.Printf("s1 = %v, cap = %d,len = %d\n", s1, cap(s1), len(s1))


}

// copy对slice的作用； slice是如何删除中间，最后和第一个元素的
// s1 =  [1 2 3 4 5 6 7]
// s2 =  [1 2 3]
// Delect elements:
// [1 3 4 5 6 7]
// Popping from front:
// front: 1
// s1 =  [3 4 5 6 7]
// Popping from tail:
// tail: 7
// s1 =  [3 4 5 6]
func testSlice4() {
	fmt.Println("-----------testSlice 4")
	// 1.定义和初始化
	var s1 = []int{1, 2, 3, 4, 5, 6, 7}
	var s2 = make([]int, 3)
	// 2.copy
	copy(s2, s1)
	fmt.Println("s1 = ", s1)
	fmt.Println("s2 = ", s2)
	// 3.删除中间元素
	fmt.Println("Delect elements:")
	s1 = append(s1[:1], s1[2:len(s1)]...)
	fmt.Println(s1)
	// 4.弹出第一个元素
	fmt.Println("Popping from front:")
	front := s1[0]
	s1 = s1[1:]
	fmt.Println("front:", front)
	fmt.Println("s1 = ", s1)
	// 4.弹出最后一个元素
	fmt.Println("Popping from tail:")
	tail := s1[len(s1)-1]
	s1 = s1[:len(s1)-1]
	fmt.Println("tail:", tail)
	fmt.Println("s1 = ", s1)
}


func main() {
	testSlice1()
	testSlice2()
    testSlice3()
    testSlice4()
}
```

- output

```
arr[2:6] =  [2 3 4 5]
arr[:6] =  [0 1 2 3 4 5]
arr[2:] =  [2 3 4 5 6 7]
arr[:] =  [0 1 2 3 4 5 6 7]
-----------testSlice 2
arr[2:] =  [2 3 4 5 6 7]
arr[:] =  [0 1 2 3 4 5 6 7]
Update s1:
s1: [100 3 4 5 6 7]
s2: [0 1 100 3 4 5 6 7]
Update s2:
s1: [100 3 4 5 6 7]
s2: [100 1 100 3 4 5 6 7]
ReSlice:
[100 1 100 3 4]
[100 3 4]
Extending slice
s1 =  [2 3 4 5]
s2 =  [5 6]
-----------testSlice 3
s1 = [0 0 0 0 0 0 0], cap = 10,len = 7
s2 = [1 2 3 4], cap = 4,len = 4
After S2 append:
s2 = [1 2 3 4 100 200 300], cap = 8,len = 7
After  S2 append To S1:
s1 = [0 0 0 0 0 0 0 1 2 3 4 100 200 300], cap = 20,len = 14
-----------testSlice 4
s1 =  [1 2 3 4 5 6 7]
s2 =  [1 2 3]
Delect elements:
[1 3 4 5 6 7]
Popping from front:
front: 1
s1 =  [3 4 5 6 7]
Popping from tail:
tail: 7
s1 =  [3 4 5 6]
```

# demo2：array和slice，底层数据的依赖探究]
```cpp
// [1 2 3 4 100 6]
// [2 3 4 100]
// cap=5, size=4
// cap=10, size=6
// [1 2 3 4 100 7]
// [2 3 200 100 7 8]
func main() {
	// Perform the search for the specified term.
	// search.Run("president")
	// 1.初始：共享底层数据
    // var array = []int{1, 2, 3, 4, 5, 6}  // 一樣的效果
	var array = [...]int{1, 2, 3, 4, 5, 6}
	s1 := array[1:5]
	s1[3] = 100
	fmt.Println(array)
	fmt.Println(s1)
	fmt.Printf("cap=%d, size=%d\n", cap(s1), len(s1))

	// 2.append使扩容
	s1 = append(s1, 7)
	s1 = append(s1, 8)
	fmt.Printf("cap=%d, size=%d\n", cap(s1), len(s1))

	// 3：slice扩容后，不再和slice共享
	s1[2] = 200
	fmt.Println(array)
	fmt.Println(s1)
}

```

