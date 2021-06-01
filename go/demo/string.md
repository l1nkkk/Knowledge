```go
package main

import "unicode/utf8"
import "fmt"

func demo1() {
	s := "lin西华！"
	bytes := []byte(s)
	// 1.len是字节数
	// 2.s[i]索引的也是字节
	for i := 0; i < len(s); i++ {
		fmt.Printf("%d:%#x ", i, s[i])
	}
	fmt.Println()
	// 3.使用range可以直接按照utt-8遍历
	for i, ch := range s {
		fmt.Printf("(%d:%#x) ", i, ch)
	}
	fmt.Println()
	// 4.获取utf-8数
	fmt.Println("s的utf-8字符数：", utf8.RuneCountInString(s))
	// 5.utf-8遍历复杂版
	for len(bytes) > 0 {
		// 返回的size是解码后用到了多少个字节，ch是解码结果
		ch, size := utf8.DecodeRune(bytes)
		// 截取更新
		bytes = bytes[size:]
		fmt.Printf("%c ", ch)
	}
}

func main() {
	demo1()
}
```