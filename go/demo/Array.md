# 数组
- demo
```go
package main

import "fmt"

func testArray() {
    // 1.定义数组
    var arr1 [3]int
    // 2.定义&初始化
    var arr2 = [5]int{1, 2, 3, 4, 5}
    var arr3 = [5]int{2: 2, 0: 9}
    var arr4 = [...]string{2: "str1", 1: "wwww"}
    fmt.Println(arr1)
    fmt.Println(arr2)
    fmt.Println(arr3)
    fmt.Println(arr4)
    // 3.遍历
    fmt.Println("-----------------")
    for i, v := range arr2 {
        fmt.Println("index:", i, ",value:", v)
    }
    fmt.Println("-----------------")
    for i := range arr3 {
        fmt.Println("index:", i)
    }
    fmt.Println("-----------------")
    for _, v := range arr4 {
        fmt.Println("value:", v)
    }
}
// 二维数组
func testArray2() {
    // 1. 定义&初始化
    var arr1 [3][4]int
    var arr2 = [3][3]int{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}

    fmt.Println(arr1)
    fmt.Println(arr2)
    // 2. 遍历
    for _, v1 := range arr2 {
        for _, v2 := range v1 {
            fmt.Print(v2," ")
        }
    }
}
func main() {
    testArray()
    testArray2
}

```
- output
```
[0 0 0]
[1 2 3 4 5]
[9 0 2 0 0]
[ wwww str1]
-----------------
index: 0 ,value: 1
index: 1 ,value: 2
index: 2 ,value: 3
index: 3 ,value: 4
index: 4 ,value: 5
-----------------
index: 0
index: 1
index: 2
index: 3
index: 4
-----------------
value: 
value: wwww
value: str1
------二维数组------
[[0 0 0 0] [0 0 0 0] [0 0 0 0]]
[[1 2 3] [4 5 6] [7 8 9]]
1 2 3 4 5 6 7 8 9 
```

# Slice切片
